import type { MatchedStream } from './types';
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

export async function getActiveStreamsByArcadeId(
  db: D1Database,
  kv: KVNamespace,
  arcadeId: number,
): Promise<MatchedStream[]> {
  const [channels, rules] = await Promise.all([
    getChannelsByArcadeId(db, kv, arcadeId),
    getStreamRulesByArcadeId(db, kv, arcadeId),
  ]);

  let streams = await getCachedStreams(kv, arcadeId);
  if (!streams) {
    const fetchedStreams = await getLiveStreamsFromChannels(channels.map(c => c.youtube_channel_id));
    
    // If fetching failed (null), do not cache and return empty array for now
    if (fetchedStreams === null) {
      return [];
    }
    
    streams = fetchedStreams;
    await setCachedStreams(kv, arcadeId, streams);
  }

  return matchStreams(streams, rules);
}
