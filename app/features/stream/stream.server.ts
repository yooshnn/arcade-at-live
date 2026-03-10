import type { ActiveStreamsResult, MatchedStream } from './types';
import type { StreamRule } from '~/server/db/schema';
import type { LiveStreamInfo } from '~/server/youtube';
import { getChannelsByArcadeId, getStreamRulesByArcadeId } from '~/features/arcade/arcade.server';
import { getCachedStreams, setCachedStreams } from '~/server/cache/stream.cache';
import { getLiveStreamsFromChannels } from '~/server/youtube';

function matchStreams(streams: LiveStreamInfo[], rules: StreamRule[]): MatchedStream[] {
  const matched: MatchedStream[] = [];

  // priority ASC order is guaranteed by queryStreamRulesByArcadeId
  for (const stream of streams) {
    const rule = rules.find(r => stream.title.includes(r.keyword));
    if (rule) {
      matched.push({
        ...stream,
        gameId: rule.game_id,
        machineLabel: rule.machine_label,
      });
    }
  }

  return matched;
}

async function getLiveStreamsWithSWR(
  kv: KVNamespace,
  waitUntil: (promise: Promise<unknown>) => void,
  arcadeId: number,
  youtubeChannelIds: string[],
): Promise<{ streams: LiveStreamInfo[]; scrapeFailed: boolean }> {
  const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  let cacheData = await getCachedStreams(kv, arcadeId);

  if (!cacheData) {
    const fetchedStreams = await getLiveStreamsFromChannels(youtubeChannelIds);

    if (fetchedStreams === null) {
      return { streams: [], scrapeFailed: true };
    }

    cacheData = { timestamp: now, streams: fetchedStreams };
    await setCachedStreams(kv, arcadeId, cacheData);
  }
  else {
    const isStale = now - cacheData.timestamp > REFRESH_INTERVAL;
    if (isStale) {
      waitUntil(
        getLiveStreamsFromChannels(youtubeChannelIds)
          .then(async (fetchedStreams) => {
            if (fetchedStreams !== null) {
              await setCachedStreams(kv, arcadeId, { timestamp: Date.now(), streams: fetchedStreams });
            }
          })
          .catch(console.error),
      );
    }
  }

  return { streams: cacheData.streams, scrapeFailed: false };
}

export async function getActiveStreamsByArcadeId(
  db: D1Database,
  kv: KVNamespace,
  waitUntil: (promise: Promise<unknown>) => void,
  arcadeId: number,
): Promise<ActiveStreamsResult> {
  const [channels, rules] = await Promise.all([
    getChannelsByArcadeId(db, kv, arcadeId),
    getStreamRulesByArcadeId(db, kv, arcadeId),
  ]);

  const { streams, scrapeFailed } = await getLiveStreamsWithSWR(
    kv,
    waitUntil,
    arcadeId,
    channels.map(c => c.youtube_channel_id),
  );

  if (scrapeFailed) {
    return {
      streams: [],
      scrapeFailed: true,
    };
  }

  return {
    streams: matchStreams(streams, rules),
    scrapeFailed: false,
  };
}
