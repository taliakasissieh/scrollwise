import { useEffect, useRef, useState } from 'react';
import { saveState } from '../store.js';

// Saves at most every 1.2 s, plus immediately when the tab is hidden or closed.
export function usePersist(state) {
  const latest = useRef(state);
  const timer = useRef(null);
  latest.current = state;
  useEffect(() => {
    if (timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      saveState(latest.current);
    }, 1200);
  }, [state]);
  useEffect(() => {
    const flush = () => saveState(latest.current);
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
}

export function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  useEffect(() => {
    const on = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}

// motion setting: 'system' follows the device, 'reduce' always reduces, 'full' never does.
export function useReducedMotion(setting) {
  const query = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const [system, setSystem] = useState(() => !!(query && query.matches));
  useEffect(() => {
    if (!query) return undefined;
    const on = () => setSystem(query.matches);
    if (query.addEventListener) query.addEventListener('change', on);
    else if (query.addListener) query.addListener(on);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', on);
      else if (query.removeListener) query.removeListener(on);
    };
  }, []);
  const reduce = setting === 'reduce' || (setting === 'system' && system);
  useEffect(() => {
    document.documentElement.classList.toggle('rm', reduce);
  }, [reduce]);
  return reduce;
}
