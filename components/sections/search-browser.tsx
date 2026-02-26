'use client';

import * as React from 'react';
import Link from 'next/link';
import type { SearchItem } from '@/lib/content';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const kindOptions = ['all', 'module', 'activity', 'reference'] as const;

type Kind = (typeof kindOptions)[number];

export function SearchBrowser({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = React.useState('');
  const [kind, setKind] = React.useState<Kind>('all');
  const [tag, setTag] = React.useState<string>('all');

  const tags = React.useMemo(
    () => ['all', ...Array.from(new Set(items.flatMap((item) => item.tags))).sort()],
    [items],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false;
      if (tag !== 'all' && !item.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.docTitle.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, kind, query, tag]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search Modules and Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search labs, workshop agenda, TOC modules, prompts, references..." />
          <div className="flex flex-wrap gap-2">
            {kindOptions.map((option) => (
              <Button key={option} type="button" size="sm" variant={kind === option ? 'default' : 'outline'} onClick={() => setKind(option)}>
                {option}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((option) => (
              <Button key={option} type="button" size="sm" variant={tag === option ? 'secondary' : 'ghost'} onClick={() => setTag(option)}>
                {option}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} results</p>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {filtered.map((item) => (
          <Card key={item.id} className="transition-colors hover:border-primary/30">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap gap-2">
                    <Badge>{item.kind}</Badge>
                    <Badge>{item.docTitle}</Badge>
                    {item.tags.map((t) => (
                      <Badge key={`${item.id}-${t}`} className="bg-card">{t}</Badge>
                    ))}
                  </div>
                  <Link href={item.route} className="font-medium hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{item.snippet}</p>
                </div>
                <Link href={item.route} className="text-sm text-primary hover:underline">
                  Open
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
