'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProgress } from '@/components/providers/progress-provider';
import type { SearchItem } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';

export function ProgressDashboard({ checklistItems }: { checklistItems: SearchItem[] }) {
  const { state, reset } = useProgress();
  const totalChecked = Object.values(state.checked).filter(Boolean).length;
  const groups = useMemo(() => {
    const grouped = new Map<string, SearchItem[]>();
    for (const item of checklistItems) {
      const list = grouped.get(item.docTitle) ?? [];
      list.push(item);
      grouped.set(item.docTitle, list);
    }
    return Array.from(grouped.entries());
  }, [checklistItems]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Local Progress Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{totalChecked} checklist items completed. {state.visited.length} pages visited.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={reset}>Reset progress</Button>
            <Link href="/search" className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-sm text-foreground hover:bg-muted">Browse search index</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.visited.map((path) => (
              <code key={path} className="rounded bg-muted px-2 py-1 text-xs">{path}</code>
            ))}
          </div>
        </CardContent>
      </Card>

      {groups.map(([group, items]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{group}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {items.slice(0, 12).map((item) => (
              <ProgressCheckItem key={item.id} id={`search:${item.id}`} label={item.title} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
