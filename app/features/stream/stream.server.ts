import type { StreamRule } from '~/server/db/schema';
import type { LiveStreamInfo } from '~/server/youtube';
import { getCachedStreams, setCachedStreams } from '~/server/cache/stream.cache';
import { queryChannelsByArcadeId, queryStreamRulesByArcadeId } from '~/server/db/arcade.queries';
import { getLiveStreamsFromChannels } from '~/server/youtube';

export interface MatchedStream extends LiveStreamInfo {
  gameId: number;
  machineLabel: string | null;
}

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
  const cached = await getCachedStreams<MatchedStream[]>(kv, arcadeId);
  if (cached)
    return cached;

  const [channels, rules] = await Promise.all([
    queryChannelsByArcadeId(db, arcadeId),
    queryStreamRulesByArcadeId(db, arcadeId),
  ]);

  const streams = await getLiveStreamsFromChannels(channels.map(c => c.youtube_channel_id));
  const matched = matchStreams(streams, rules);

  await setCachedStreams(kv, arcadeId, matched);
  return matched;
}
