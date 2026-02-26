'use client';

import * as React from 'react';
import type { PromptCard } from '@/lib/content';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/sections/copy-button';
import { MarkdownContent } from '@/components/sections/markdown-content';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';

export function PromptCardsBoard({ cards }: { cards: PromptCard[] }) {
  const [query, setQuery] = React.useState('');

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((card) =>
      [card.title, card.template, card.useWhen.join(' '), card.whyItWorks ?? '', card.avoid.join(' ')].join(' ').toLowerCase().includes(q),
    );
  }, [cards, query]);

  return (
    <div className="space-y-4">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompt cards by use-case, template, or anti-pattern..." />
      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge>Prompt Card</Badge>
                    {card.tocMapping.slice(0, 2).map((tag) => (
                      <Badge key={`${card.id}-${tag}`} className="bg-card">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                </div>
                <CopyButton text={card.template} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.useWhen.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Use When</p>
                  <div className="space-y-1">
                    {card.useWhen.map((item, i) => (
                      <ProgressCheckItem key={i} id={`prompt:${card.id}:use:${i}`} label={item} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Template</p>
                <pre className="overflow-x-auto rounded-xl border border-border bg-muted/60 p-3 text-xs leading-6"><code>{card.template}</code></pre>
              </div>

              {card.whyItWorks ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why It Works</p>
                  <p className="text-sm text-foreground/90">{card.whyItWorks}</p>
                </div>
              ) : null}

              {card.avoid.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avoid</p>
                  <ul className="space-y-1 text-sm text-foreground/90">
                    {card.avoid.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <details className="rounded-xl border border-border bg-muted/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">Full card markdown</summary>
                <div className="mt-3">
                  <MarkdownContent markdown={card.detailsMarkdown} className="text-xs" />
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
