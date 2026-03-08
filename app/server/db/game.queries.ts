import type { Game } from './schema';

export async function queryGames(db: D1Database): Promise<Game[]> {
  const result = await db
    .prepare('SELECT * FROM games ORDER BY alias ASC')
    .all<Game>();
  return result.results;
}

export async function queryGamesByArcadeId(db: D1Database, arcadeId: number): Promise<Game[]> {
  const result = await db
    .prepare(`
      SELECT DISTINCT g.*
      FROM games g
      JOIN stream_rules sr ON sr.game_id = g.id
      WHERE sr.arcade_id = ?
      ORDER BY g.alias ASC
    `)
    .bind(arcadeId)
    .all<Game>();
  return result.results;
}
