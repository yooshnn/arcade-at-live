export interface Game {
  id: number;
  name: string; // "beatmania IIDX"
  alias: string; // "IIDX"
  slug: string; // "iidx"
}

export interface Arcade {
  id: number;
  name: string;
  slug: string;
  is_closed: 0 | 1;
  created_at: string;
}

export interface Channel {
  id: number;
  arcade_id: number;
  youtube_channel_id: string;
  created_at: string;
}

export interface StreamRule {
  id: number;
  arcade_id: number;
  game_id: number;
  keyword: string;
  machine_label: string | null;
  priority: number;
  created_at: string;
}
