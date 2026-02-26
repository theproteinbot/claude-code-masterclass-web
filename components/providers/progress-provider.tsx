'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

type ProgressState = {
  checked: Record<string, boolean>;
  visited: string[];
  updatedAt: number;
};

type ProgressContextValue = {
  state: ProgressState;
  isChecked: (id: string) => boolean;
  toggleChecked: (id: string, next?: boolean) => void;
  markVisited: (path: string) => void;
  reset: () => void;
};

const STORAGE_KEY = 'masterclass-progress-v1';
const defaultState: ProgressState = { checked: {}, visited: [], updatedAt: Date.now() };

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(defaultState);
  const pathname = usePathname();

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      setState({
        checked: parsed.checked ?? {},
        visited: parsed.visited ?? [],
        updatedAt: parsed.updatedAt ?? Date.now(),
      });
    } catch {
      // Ignore malformed localStorage state.
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const markVisited = React.useCallback((path: string) => {
    setState((prev) => {
      if (prev.visited.includes(path)) return prev;
      return { ...prev, visited: [...prev.visited, path], updatedAt: Date.now() };
    });
  }, []);

  React.useEffect(() => {
    if (pathname) markVisited(pathname);
  }, [pathname, markVisited]);

  const value = React.useMemo<ProgressContextValue>(
    () => ({
      state,
      isChecked: (id) => !!state.checked[id],
      toggleChecked: (id, next) =>
        setState((prev) => ({
          ...prev,
          checked: { ...prev.checked, [id]: next ?? !prev.checked[id] },
          updatedAt: Date.now(),
        })),
      markVisited,
      reset: () => setState({ checked: {}, visited: [], updatedAt: Date.now() }),
    }),
    [state, markVisited],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
