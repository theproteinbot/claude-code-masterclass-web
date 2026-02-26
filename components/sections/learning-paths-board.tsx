'use client';

import * as React from 'react';
import type { LearningPathCard } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';
import { MarkdownContent } from '@/components/sections/markdown-content';

const levels = ['all', 'beginner', 'intermediate', 'advanced'] as const;

type LevelFilter = (typeof levels)[number];

export function LearningPathsBoard({ cards }: { cards: LearningPathCard[] }) {
  const [filter, setFilter] = React.useState<LevelFilter>('all');
  const visible = cards.filter((card) => (filter === 'all' ? true : card.level === filter));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <Button key={level} type="button" size="sm" variant={filter === level ? 'default' : 'outline'} onClick={() => setFilter(level)}>
            {level}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {visible.map((card) => (
          <Card key={card.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{card.name}</CardTitle>
                <Badge>{card.level}</Badge>
              </div>
              {card.duration ? <p className="text-xs text-muted-foreground">Suggested duration: {card.duration}</p> : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {card.intendedLearner.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Intended Learner</p>
                  <ul className="space-y-1">
                    {card.intendedLearner.map((item, i) => (
                      <li key={i} className="text-sm text-foreground/90">• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {card.outcomes.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outcomes</p>
                  <div className="space-y-1">
                    {card.outcomes.map((item, i) => (
                      <ProgressCheckItem key={i} id={`path:${card.id}:outcome:${i}`} label={item} />
                    ))}
                  </div>
                </div>
              ) : null}

              {card.sequence.length ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sequence</p>
                  <div className="space-y-1">
                    {card.sequence.map((item, i) => (
                      <ProgressCheckItem key={i} id={`path:${card.id}:sequence:${i}`} label={item} />
                    ))}
                  </div>
                </div>
              ) : null}

              <details className="rounded-xl border border-border bg-muted/30 p-3">
                <summary className="cursor-pointer text-sm font-medium">Raw section / citations</summary>
                <div className="mt-3">
                  <MarkdownContent markdown={card.rawSection.content} className="text-xs" />
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
