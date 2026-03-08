import type { LiveStreamInfo } from '~/server/youtube';

export interface ActiveStreamsResult {
  streams: MatchedStream[];
  scrapeFailed: boolean;
}

export interface MatchedStream extends LiveStreamInfo {
  gameId: number;
  machineLabel: string | null;
}
