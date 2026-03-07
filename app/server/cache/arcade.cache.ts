import type { Arcade } from '../db/schema';

const KEY = 'arcades';
const TTL = 60 * 60 * 24; // 24h

export async function getCachedArcades(kv: KVNamespace): Promise<Arcade[] | null> {
  return kv.get<Arcade[]>(KEY, 'json');
}

export async function setCachedArcades(kv: KVNamespace, data: Arcade[]): Promise<void> {
  await kv.put(KEY, JSON.stringify(data), { expirationTtl: TTL });
}

export async function invalidateCachedArcades(kv: KVNamespace): Promise<void> {
  await kv.delete(KEY);
}
