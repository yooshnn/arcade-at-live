-- Migration number: 0001 	 2026-03-07T06:50:44.906Z

-- 게임
CREATE TABLE games (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE,  -- "beatmania IIDX"
  alias      TEXT    NOT NULL UNIQUE,  -- "IIDX" (탭 UI 표시용)
  slug       TEXT    NOT NULL UNIQUE   -- "iidx" (쿠키/쿼리스트링용)
);

-- 오락실
CREATE TABLE arcades (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  slug       TEXT    NOT NULL UNIQUE,
  is_closed  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- 유튜브 채널
CREATE TABLE channels (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  arcade_id          INTEGER NOT NULL REFERENCES arcades(id) ON DELETE CASCADE,
  youtube_channel_id TEXT    NOT NULL UNIQUE,
  created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- 방송 매칭 규칙
CREATE TABLE stream_rules (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  arcade_id     INTEGER NOT NULL REFERENCES arcades(id) ON DELETE CASCADE,
  game_id       INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  keyword       TEXT    NOT NULL,
  machine_label TEXT,
  priority      INTEGER NOT NULL DEFAULT 0,  -- 낮을수록 먼저 매칭
  created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (arcade_id, game_id, keyword)
);

-- 인덱스
CREATE INDEX idx_channels_arcade_id ON channels(arcade_id);
CREATE INDEX idx_stream_rules_arcade_id_priority ON stream_rules(arcade_id, priority);
CREATE INDEX idx_stream_rules_game_id ON stream_rules(game_id);
CREATE INDEX idx_arcades_is_closed ON arcades(is_closed);
CREATE INDEX idx_arcades_slug ON arcades(slug);