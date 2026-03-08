import type { LiveStreamInfo } from '../youtube';
import { createCache } from './utils';

const TTL = 60 * 10; // 10m

export const YouTubeStreamsCache = createCache<LiveStreamInfo[]>((arcadeId: number) => `youtube:streams:${arcadeId}`, TTL);

export const getCachedStreams = (kv: KVNamespace, arcadeId: number) => YouTubeStreamsCache.get(kv, arcadeId);
export const setCachedStreams = (kv: KVNamespace, arcadeId: number, data: LiveStreamInfo[]) => YouTubeStreamsCache.set(kv, data, arcadeId);
export const invalidateCachedStreams = (kv: KVNamespace, arcadeId: number) => YouTubeStreamsCache.invalidate(kv, arcadeId);
