import type { Route } from './+types/$slug';
import { data } from 'react-router';
import { getArcadeBySlug } from '~/features/arcade/arcade.server';
import { filterStreamsByGameId, useGameTabs } from '~/features/stream/hooks';
import { Tabs } from '~/shared/ui/tabs';
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

  const { tabItems, handleSelect, activeGameId } = useGameTabs(games, streams);
  const selectedStreams = filterStreamsByGameId(streams, activeGameId);
  const hasSelectedStreams = selectedStreams.length > 0;

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

      <Tabs items={tabItems} activeKey={activeGameId} onSelect={handleSelect} />

      <main className="p-6">
        {!hasSelectedStreams && (
          <div className="py-20 text-center text-label-assistive">
            <div className="mb-4 text-4xl opacity-40">📺</div>
            <p className="text-sm">현재 방송 중인 스트림이 없습니다.</p>
          </div>
        )}

        {hasSelectedStreams && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4">
            {selectedStreams.map((stream) => {
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
