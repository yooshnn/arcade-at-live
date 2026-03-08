import { cn } from '~/shared/utils';
import { useScrollable } from './Tabs.hooks';

export interface TabItem {
  key: string | number;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string | number | null;
  onSelect: (key: string | number) => void;
}

export function Tabs({ items, activeKey, onSelect }: TabsProps) {
  const { scrollRef, canScrollLeft, canScrollRight, handleScrollLeft, handleScrollRight } = useScrollable();

  return (
    <div className="relative border-b border-line">
      {canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className="absolute left-0 top-0 z-10 flex h-full items-center bg-linear-to-r from-bg via-bg/80 to-transparent pl-2 pr-4 text-label-assistive transition-colors hover:text-label"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-0.5 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={cn(
                'relative shrink-0 px-4 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors',
                'after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5',
                isActive
                  ? 'text-primary after:bg-primary'
                  : 'text-label-assistive after:bg-transparent hover:text-label',
              )}
            >
              {item.label}
              {item.badge != null && (
                <span className={cn(
                  'ml-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded px-1 font-mono text-[10px] font-bold',
                  isActive
                    ? 'bg-primary-dim text-primary'
                    : 'bg-line text-label-assistive',
                )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          onClick={handleScrollRight}
          className="absolute right-0 top-0 z-10 flex h-full items-center bg-linear-to-l from-bg via-bg/80 to-transparent pl-4 pr-2 text-label-assistive transition-colors hover:text-label"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
