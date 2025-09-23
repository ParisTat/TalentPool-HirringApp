import React from 'react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;      // distance in px required to trigger
  delayMs?: number;        // optional delay before firing refresh
}

const DEFAULT_THRESHOLD = 100;

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh, threshold = DEFAULT_THRESHOLD, delayMs = 0 }) => {
  const startY = React.useRef<number | null>(null);
  const pulling = React.useRef(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDist, setPullDist] = React.useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    // Disable when an overlay/menu is open (e.g., burger menu adds body.no-scroll)
    if (document.body.classList.contains('no-scroll')) return;
    if (document.scrollingElement && document.scrollingElement.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
      setPullDist(0);
    } else {
      startY.current = null;
      pulling.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!pulling.current || startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setPullDist(Math.min(delta, threshold * 1.6));
    // Do not trigger here; we trigger on release for better UX
  };

  const handleTouchEnd = () => {
    startY.current = null;
    if (pulling.current && pullDist > threshold && !isRefreshing) {
      // trigger once on release
      setIsRefreshing(true);
      const run = () => Promise.resolve(onRefresh ? onRefresh() : window.location.reload());
      const exec = delayMs > 0 ? new Promise<void>(res => setTimeout(() => { run().finally(() => res()); }, delayMs)) : run();
      Promise.resolve(exec).finally(() => {
        setIsRefreshing(false);
        setPullDist(0);
        pulling.current = false;
      });
    } else {
      pulling.current = false;
      setPullDist(0);
    }
  };

  React.useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart as any);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [isRefreshing]);

  const translate = isRefreshing ? 0 : Math.max(0, pullDist / 2);

  return (
    <div>
      <div className="fixed left-0 right-0 z-40 flex items-center justify-center pointer-events-none" style={{ top: 64, height: 50, opacity: pullDist > 0 || isRefreshing ? 1 : 0, transition: 'opacity 120ms ease' }}>
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" className={`${pullDist > threshold ? 'rotate-180' : ''}`} style={{ transition: 'transform 120ms ease' }}>
            <path fill="currentColor" d="M12 19a1 1 0 0 1-1-1V7.41l-3.3 3.29a1 1 0 1 1-1.4-1.42l5-5a1 1 0 0 1 1.4 0l5 5a1 1 0 1 1-1.4 1.42L13 7.4V18a1 1 0 0 1-1 1Z"/>
          </svg>
          <span>{isRefreshing ? 'Refreshing…' : pullDist > threshold ? 'Release to refresh' : 'Pull to refresh'}</span>
        </div>
      </div>
      <div style={{ transform: `translateY(${translate}px)`, transition: isRefreshing ? 'transform 180ms ease' : 'none' }}>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;


