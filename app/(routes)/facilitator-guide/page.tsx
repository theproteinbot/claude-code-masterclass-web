import { getFacilitatorChecklists } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';
import { MarkdownContent } from '@/components/sections/markdown-content';

export default function FacilitatorGuidePage() {
  const { doc, checklistSections } = getFacilitatorChecklists();

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Instructor Runbook" title="Facilitator Guide" description={doc.summary} tags={['Pre-flight', 'Delivery flow', 'Demo patterns', 'Failure modes']} />

      <div className="grid gap-4 lg:grid-cols-2">
        {checklistSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.bullets.length ? (
                section.bullets.map((item, i) => (
                  <ProgressCheckItem key={i} id={`facilitator:${section.id}:${i}`} label={item} />
                ))
              ) : (
                <MarkdownContent markdown={section.content} className="text-sm" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full Facilitator Markdown (Canonical)</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent markdown={doc.raw} className="max-h-[560px] overflow-auto pr-2 text-xs" />
        </CardContent>
      </Card>
    </div>
  );
}
