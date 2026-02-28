import { getDocById, getLabCards } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';
import { MarkdownContent } from '@/components/sections/markdown-content';

export default function LabsPage() {
  const doc = getDocById('labs');
  const labs = getLabCards();

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Hands-On" title="Labs + Checkpoints" description={doc.summary} tags={['Expandable checkpoints', 'Self-checks', 'Process evidence']} />

      <div className="grid gap-4">
        {labs.map((lab, index) => (
          <Card key={lab.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>{lab.title}</CardTitle>
                  {lab.objective ? <p className="mt-1 text-sm text-muted-foreground">{lab.objective}</p> : null}
                </div>
                {lab.duration ? <Badge>{lab.duration}</Badge> : <Badge>Lab {index + 1}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lab.promptStarter ? (
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt Starter</p>
                  <p className="text-sm leading-6">{lab.promptStarter}</p>
                </div>
              ) : null}

              <details className="rounded-xl border border-border bg-card/40 p-3" open>
                <summary className="cursor-pointer text-sm font-medium">Checkpoints ({lab.checkpoints.length})</summary>
                <div className="mt-3 space-y-1">
                  {lab.checkpoints.map((item, i) => (
                    <ProgressCheckItem key={i} id={`lab:${lab.id}:checkpoint:${i}`} label={item} />
                  ))}
                </div>
              </details>

              <details className="rounded-xl border border-border bg-card/40 p-3">
                <summary className="cursor-pointer text-sm font-medium">Tasks ({lab.tasks.length})</summary>
                <div className="mt-3 space-y-1">
                  {lab.tasks.map((item, i) => (
                    <ProgressCheckItem key={i} id={`lab:${lab.id}:task:${i}`} label={item} />
                  ))}
                </div>
              </details>

              {lab.successCriteria.length ? (
                <details className="rounded-xl border border-border bg-card/40 p-3">
                  <summary className="cursor-pointer text-sm font-medium">Success Criteria</summary>
                  <div className="mt-3 space-y-1">
                    {lab.successCriteria.map((item, i) => (
                      <ProgressCheckItem key={i} id={`lab:${lab.id}:success:${i}`} label={item} />
                    ))}
                  </div>
                </details>
              ) : null}

              <details className="rounded-xl border border-border bg-muted/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">Full lab markdown</summary>
                <div className="mt-3">
                  <MarkdownContent markdown={lab.detailsMarkdown} className="text-xs" />
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
