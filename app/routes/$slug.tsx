import type { Route } from './+types/$slug';
import { CactusIcon, CaretLeftIcon } from '@phosphor-icons/react';
import { data, Link } from 'react-router';
import { getArcadeBySlug } from '~/features/arcade/arcade.server';
import { getGamesByArcadeId } from '~/features/game/game.server';
import { StreamGrid } from '~/features/stream/components/StreamGrid';
import { filterStreamsByGameId, useGameTabs } from '~/features/stream/hooks';
import { getActiveStreamsByArcadeId } from '~/features/stream/stream.server';
import { Button } from '~/shared/ui/button';
import { EmptyState } from '~/shared/ui/EmptyState';
import { Tabs } from '~/shared/ui/tabs';

export async function loader({ params, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const { slug } = params;

  const arcade = await getArcadeBySlug(env.DB, env.CACHE, slug);

  const [streams, games] = await Promise.all([
    getActiveStreamsByArcadeId(env.DB, env.CACHE, arcade.id),
    getGamesByArcadeId(env.DB, env.CACHE, arcade.id),
  ]);

  return data({ arcade, streams, games });
}

export default function ArcadeStreamPage({ loaderData }: Route.ComponentProps) {
  const { arcade, streams, games } = loaderData;

  const { tabItems, handleSelect, activeGameId } = useGameTabs(games, streams);
  const selectedStreams = filterStreamsByGameId(streams, activeGameId);
  const hasSelectedStreams = selectedStreams.length > 0;

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link
            to="/"
            className="flex items-center gap-1.5 py-6 px-2 text-sm text-label-neutral hover:text-white"
          >
            <CaretLeftIcon />
            홈
          </Link>

          <div className="h-5 w-px shrink-0 bg-line mx-2" />

          <span className="min-w-0 flex-1 truncate text-base font-black tracking-wide px-2">
            {arcade.name}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-status-live" />
            <span className="font-mono text-sm text-label-assistive">
              <strong className="text-label">{streams.length}</strong>
            </span>
          </div>
        </div>

        <Tabs items={tabItems} activeKey={activeGameId} onSelect={handleSelect} />
      </header>

      <main className="p-6 pb-12">
        {!hasSelectedStreams && (
          <EmptyState
            icon={<CactusIcon />}
            message="라이브 스트림을 찾지 못했습니다."
            action={<Button render={<Link to="/" />} nativeButton={false}>돌아가기</Button>}
          />
        )}
        {hasSelectedStreams && (
          <StreamGrid streams={selectedStreams} />
        )}
      </main>
    </div>
  );
}
