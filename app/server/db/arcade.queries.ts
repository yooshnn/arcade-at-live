import type { Arcade, Channel, StreamRule } from './schema';

export async function queryArcades(db: D1Database): Promise<Arcade[]> {
  const result = await db
    .prepare('SELECT * FROM arcades WHERE is_closed = 0')
    .all<Arcade>();
  return result.results;
}

export async function queryArcadeBySlug(db: D1Database, slug: string): Promise<Arcade | null> {
  return db
    .prepare('SELECT * FROM arcades WHERE slug = ?')
    .bind(slug)
    .first<Arcade>();
}

export async function queryChannelsByArcadeId(db: D1Database, arcadeId: number): Promise<Channel[]> {
  const result = await db
    .prepare('SELECT * FROM channels WHERE arcade_id = ?')
    .bind(arcadeId)
    .all<Channel>();
  return result.results;
}

export async function queryStreamRulesByArcadeId(db: D1Database, arcadeId: number): Promise<StreamRule[]> {
  const result = await db
    .prepare('SELECT * FROM stream_rules WHERE arcade_id = ? ORDER BY priority ASC')
    .bind(arcadeId)
    .all<StreamRule>();
  return result.results;
}
