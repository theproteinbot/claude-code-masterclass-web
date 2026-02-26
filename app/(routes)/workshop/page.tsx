import { getDocById, getWorkshopAgenda } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';
import { MarkdownContent } from '@/components/sections/markdown-content';

export default function WorkshopPage() {
  const doc = getDocById('workshop');
  const agenda = getWorkshopAgenda();
  const outcomes = doc.sections.find((s) => s.level === 2 && /^Workshop Outcomes/i.test(s.title))?.bullets ?? [];
  const materials = doc.sections.find((s) => s.level === 2 && /^Materials Needed/i.test(s.title))?.bullets ?? [];

  return (
    <div className="space-y-6">
      <PageHero eyebrow="90 Minutes" title="Interactive Workshop Plan" description={doc.summary} tags={['Timeline', 'Hands-on', 'Facilitator checkpoints']} />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Agenda Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agenda.map((item, index) => (
              <details key={item.id} className="group rounded-xl border border-border bg-card/50 p-4" open={index < 2}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.timeLabel}</p>
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <Badge>{item.bullets.length || 'notes'} items</Badge>
                </summary>
                <div className="mt-3 space-y-2">
                  {item.bullets.length ? (
                    <div className="space-y-1">
                      {item.bullets.map((bullet, i) => (
                        <ProgressCheckItem key={i} id={`workshop:${item.id}:bullet:${i}`} label={bullet} />
                      ))}
                    </div>
                  ) : null}
                  <MarkdownContent markdown={item.detailsMarkdown} className="text-xs" />
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Workshop Outcomes</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {outcomes.map((item, i) => (
                <ProgressCheckItem key={i} id={`workshop:outcome:${i}`} label={item} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Materials Needed</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {materials.map((item, i) => (
                <ProgressCheckItem key={i} id={`workshop:materials:${i}`} label={item} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Canonical Markdown</CardTitle></CardHeader>
            <CardContent>
              <MarkdownContent markdown={doc.raw} className="max-h-[420px] overflow-auto pr-2 text-xs" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
