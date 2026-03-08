export function createCache<T>(keyFn: (...args: any[]) => string, defaultTtl: number) {
  return {
    async get(kv: KVNamespace, ...args: Parameters<typeof keyFn>): Promise<T | null> {
      return kv.get<T>(keyFn(...args), 'json');
    },
    async set(kv: KVNamespace, data: T, ...args: Parameters<typeof keyFn>): Promise<void> {
      await kv.put(keyFn(...args), JSON.stringify(data), { expirationTtl: defaultTtl });
    },
    async invalidate(kv: KVNamespace, ...args: Parameters<typeof keyFn>): Promise<void> {
      await kv.delete(keyFn(...args));
    },
  };
}
