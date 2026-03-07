const TTL = 60 * 10; // 10m

function key(arcadeId: number): string {
  return `streams:${arcadeId}`;
}

// TODO: Replace T with a specific type

export async function getCachedStreams<T>(kv: KVNamespace, arcadeId: number): Promise<T | null> {
  return kv.get<T>(key(arcadeId), 'json');
}

export async function setCachedStreams<T>(kv: KVNamespace, arcadeId: number, data: T): Promise<void> {
  await kv.put(key(arcadeId), JSON.stringify(data), { expirationTtl: TTL });
}

export async function invalidateCachedStreams(kv: KVNamespace, arcadeId: number): Promise<void> {
  await kv.delete(key(arcadeId));
}
