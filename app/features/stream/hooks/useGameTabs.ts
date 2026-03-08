import type { TabItem } from '~/shared/ui/tabs';
import type { MatchedStream } from '../stream.server';
import type { Game } from '~/server/db/schema';
import { useNavigate, useSearchParams } from 'react-router';

/**
 * Manages game tabs state, parsing the active game from URL search parameters,
 * and generating the tab items data and navigation handler.
 *
 * @param games List of available games.
 * @param streams List of all streams associated with the arcade.
 * @returns Object containing tab items data, active game ID, and selection handler.
 */
export function useGameTabs(games: Game[], streams: MatchedStream[]) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeGameId = resolveActiveGameId(games, searchParams.get('game'));
  const tabItems = buildGameTabItems(games, streams);

  function handleSelect(key: string | number) {
    const game = games.find(g => g.id === key);
    if (game) {
      navigate(`?game=${game.slug}`);
    }
  }

  return {
    tabItems,
    activeGameId,
    handleSelect,
  };
}

// Public helpers

/**
 * Filters the given list of streams by a specific game ID.
 *
 * @param streams List of all streams associated with the arcade.
 * @param gameId The ID of the game to filter streams by.
 * @returns Array of streams belonging to the specified game ID.
 */
export function filterStreamsByGameId(
  streams: MatchedStream[],
  gameId: number | null,
) {
  return streams.filter(stream => stream.gameId === gameId);
}

// Private helpers

function resolveActiveGameId(games: Game[], slug: string | null): number | null {
  if (!games.length) {
    return null;
  }

  if (slug) {
    const found = games.find(g => g.slug === slug);
    if (found) {
      return found.id;
    }
  }

  return games[0].id;
}

function buildStreamCountByGameId(streams: MatchedStream[]): Map<number, number> {
  const countByGameId = new Map<number, number>();

  for (const { gameId } of streams) {
    countByGameId.set(gameId, (countByGameId.get(gameId) ?? 0) + 1);
  }

  return countByGameId;
}

function buildGameTabItems(games: Game[], streams: MatchedStream[]): TabItem[] {
  const countByGameId = buildStreamCountByGameId(streams);

  return games.map(game => ({
    key: game.id,
    label: game.alias,
    badge: countByGameId.get(game.id) ?? undefined,
  }));
}
