import { getCapstoneDetails, getRubricBlocks } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';
import { MarkdownContent } from '@/components/sections/markdown-content';

export default function CapstonePage() {
  const { doc, deliverables, phases, successCriteria } = getCapstoneDetails();
  const rubricBlocks = getRubricBlocks().filter((b) => /capstone|lab rubric|scoring/i.test(b.title.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Practice Finale" title="Capstone Project" description={doc.summary} tags={['Deliverables', 'Phases', 'Self-assessment', 'Retro']} />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Required Deliverables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {deliverables.map((item, i) => (
              <ProgressCheckItem key={i} id={`capstone:deliverable:${i}`} label={item} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {successCriteria.map((item, i) => (
              <ProgressCheckItem key={i} id={`capstone:success:${i}`} label={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Capstone Phases (Suggested 2.5-4 Hours)</CardTitle>
          </CardHeader>
        <CardContent className="space-y-3">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="rounded-2xl border border-border bg-card/50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-medium">{phase.title}</p>
                <Badge>Phase {idx + 1}</Badge>
              </div>
              <div className="space-y-1">
                {phase.bullets.map((item, i) => (
                  <ProgressCheckItem key={i} id={`capstone:${phase.id}:task:${i}`} label={item} />
                ))}
              </div>
              <details className="mt-3 rounded-xl border border-border bg-muted/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">Phase notes</summary>
                <div className="mt-3">
                  <MarkdownContent markdown={phase.detailsMarkdown} className="text-xs" />
                </div>
              </details>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {rubricBlocks.map((block) => (
          <Card key={block.id}>
            <CardHeader>
              <CardTitle>{block.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {block.dimensions.slice(0, 6).map((dim) => (
                <div key={dim.id} className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="mb-1 text-sm font-medium">{dim.title}</p>
                  {dim.bullets.length ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {dim.bullets.slice(0, 4).map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  ) : (
                    <MarkdownContent markdown={dim.detailsMarkdown} className="text-xs" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canonical Capstone Markdown</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent markdown={doc.raw} className="max-h-[520px] overflow-auto pr-2 text-xs" />
        </CardContent>
      </Card>
    </div>
  );
}
