import { getDocById, getRubricBlocks } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownContent } from '@/components/sections/markdown-content';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';

export default function RubricsPage() {
  const doc = getDocById('rubrics');
  const blocks = getRubricBlocks();
  const scale = doc.sections.find((s) => s.level === 2 && /^Scoring Scale/i.test(s.title));

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Assessment" title="Rubrics" description={doc.summary} tags={['Scoring scale', 'Workshop', 'Labs', 'Capstone']} />

      {scale ? (
        <Card>
          <CardHeader>
            <CardTitle>{scale.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {scale.bullets.map((bullet, i) => {
              const parts = bullet.split('=').map((s) => s.trim());
              return (
                <div key={i} className="rounded-xl border border-border bg-card/60 p-3">
                  <p className="mb-2 font-mono text-xs text-primary">{parts[0] ?? `Level ${i}`}</p>
                  <p className="text-sm text-foreground/90">{parts.slice(1).join('=') || bullet}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {blocks.map((block) => (
          <Card key={block.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{block.title}</CardTitle>
                <Badge>{block.dimensions.length} dimensions</Badge>
              </div>
              {block.intro ? <p className="text-sm text-muted-foreground">{block.intro}</p> : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-2">
                {block.dimensions.map((dimension) => (
                  <div key={dimension.id} className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-2 font-medium">{dimension.title}</p>
                    <div className="space-y-1">
                      {dimension.bullets.length ? (
                        dimension.bullets.map((item, i) => (
                          <ProgressCheckItem key={i} id={`rubric:${dimension.id}:${i}`} label={item} />
                        ))
                      ) : (
                        <MarkdownContent markdown={dimension.detailsMarkdown} className="text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <details className="rounded-xl border border-border bg-card/40 p-3">
                <summary className="cursor-pointer text-sm font-medium">Raw rubric markdown</summary>
                <div className="mt-3">
                  <MarkdownContent markdown={block.rawSection.content} className="text-xs" />
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
