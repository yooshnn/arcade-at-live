import type { Route } from './+types/$slug';
import { useRef } from 'react';
import { data, useNavigate, useSearchParams } from 'react-router';
import { getArcadeBySlug } from '~/features/arcade/arcade.server';
import { getActiveStreamsByArcadeId } from '~/features/stream/stream.server';
import { queryGamesByArcadeId } from '~/server/db/game.queries';

export async function loader({ params, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const { slug } = params;

  const arcade = await getArcadeBySlug(env.DB, slug);

  const [streams, games] = await Promise.all([
    getActiveStreamsByArcadeId(env.DB, env.YOUTUBE_CACHE, arcade.id),
    queryGamesByArcadeId(env.DB, arcade.id),
  ]);

  return data({ arcade, streams, games });
}

function StreamIframe({ src }: { src: string }) {
  return (
    <div className="aspect-video w-full">
      <iframe
        key={src}
        src={src}
        className="h-full w-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

export default function DummyPage({ loaderData }: Route.ComponentProps) {
  const { arcade, streams, games } = loaderData;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabsRef = useRef<HTMLElement>(null);

  const selectedGameSlug = searchParams.get('game');
  const activeGame = games.find(game => game.slug === selectedGameSlug) ?? games[0] ?? null;
  const activeGameId = activeGame?.id ?? null;
  const activeStreams = streams.filter(stream => stream.gameId === activeGameId);

  const streamCountByGameId = new Map<number, number>();

  for (const stream of streams) {
    streamCountByGameId.set(
      stream.gameId,
      (streamCountByGameId.get(stream.gameId) ?? 0) + 1,
    );
  }

  function moveToGameTab(gameSlug: string) {
    navigate(`?game=${gameSlug}`);
  }

  function handleTabsWheel(event: React.WheelEvent<HTMLElement>) {
    if (event.deltaY === 0) {
      return;
    }

    event.preventDefault();
    tabsRef.current?.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
  }

  const hasActiveStreams = activeStreams.length > 0;

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-line bg-bg/85 px-6 backdrop-blur-md">
        <a
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm text-label-assistive transition-colors hover:text-label"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          홈
        </a>

        <div className="h-5 w-px shrink-0 bg-line" />

        <span className="min-w-0 flex-1 truncate text-base font-black tracking-wide">
          {arcade.name}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-status-live" />
          <span className="font-mono text-sm text-label-assistive">
            <strong className="text-label">{streams.length}</strong>
            {' '}
            방송 중
          </span>
        </div>
      </header>

      <nav
        ref={tabsRef}
        onWheel={handleTabsWheel}
        className="flex gap-0.5 overflow-x-auto border-b border-line px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game) => {
          const streamCount = streamCountByGameId.get(game.id) ?? 0;
          const isActive = game.id === activeGameId;

          const tabClassName = [
            'relative shrink-0 px-4 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors',
            'after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5',
            isActive
              ? 'text-primary after:bg-primary'
              : 'text-label-assistive after:bg-transparent hover:text-label',
          ].join(' ');

          const badgeClassName = [
            'ml-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded px-1 font-mono text-[10px] font-bold',
            isActive
              ? 'bg-primary-dim text-primary'
              : 'bg-line text-label-assistive',
          ].join(' ');

          return (
            <button
              key={game.id}
              onClick={() => moveToGameTab(game.slug)}
              className={tabClassName}
            >
              {game.alias}
              {streamCount > 0 && (
                <span className={badgeClassName}>
                  {streamCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="p-6">
        {!hasActiveStreams && (
          <div className="py-20 text-center text-label-assistive">
            <div className="mb-4 text-4xl opacity-40">📺</div>
            <p className="text-sm">현재 방송 중인 스트림이 없습니다.</p>
          </div>
        )}

        {hasActiveStreams && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4">
            {activeStreams.map((stream) => {
              const streamKey = `${activeGameId}-${stream.videoId}`;

              const machineLabelClassName = [
                'font-mono text-sm font-medium',
                stream.machineLabel ? 'text-label' : 'text-label-assistive',
              ].join(' ');

              return (
                <div
                  key={streamKey}
                  className="overflow-hidden rounded-lg border border-line bg-bg-elevated transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <StreamIframe src={stream.embedUrl} />

                  <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                    <span className={machineLabelClassName}>
                      {stream.machineLabel ?? '방송 중'}
                    </span>

                    <div className="flex shrink-0 items-center gap-1.5 rounded border border-status-live/25 bg-status-live/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-status-live">
                      <span className="size-1.5 animate-pulse rounded-full bg-status-live" />
                      LIVE
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
