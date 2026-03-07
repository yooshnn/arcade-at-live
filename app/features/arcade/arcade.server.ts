import type { Arcade } from '~/server/db/schema';
import { getCachedArcades, setCachedArcades } from '~/server/cache/arcade.cache';
import { queryArcadeBySlug, queryArcades } from '~/server/db/arcade.queries';

export async function getArcades(db: D1Database, kv: KVNamespace): Promise<Arcade[]> {
  const cached = await getCachedArcades(kv);
  if (cached)
    return cached;

  const arcades = await queryArcades(db);
  await setCachedArcades(kv, arcades);

  return arcades;
}

export async function getArcadeBySlug(db: D1Database, slug: string): Promise<Arcade> {
  const arcade = await queryArcadeBySlug(db, slug);
  if (!arcade)
    throw new Response('Not Found', { status: 404 });

  return arcade;
}
