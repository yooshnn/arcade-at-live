import type { Game } from '~/server/db/schema';
import { getCachedGamesByArcadeId, setCachedGamesByArcadeId } from '~/server/cache/game.cache';
import { queryGames, queryGamesByArcadeId } from '~/server/db/game.queries';

export async function getGames(db: D1Database): Promise<Game[]> {
  return queryGames(db);
}

interface GetGamesByArcadeIdParams {
  db: D1Database;
  kv: KVNamespace;
  arcadeId: number;
}

export async function getGamesByArcadeId(
  { db, kv, arcadeId }: GetGamesByArcadeIdParams,
): Promise<Game[]> {
  const cached = await getCachedGamesByArcadeId(kv, arcadeId);
  if (cached)
    return cached;

  const games = await queryGamesByArcadeId(db, arcadeId);
  await setCachedGamesByArcadeId(kv, arcadeId, games);
  return games;
}
