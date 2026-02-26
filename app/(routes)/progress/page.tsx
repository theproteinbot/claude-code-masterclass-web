import { buildSearchIndex } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { ProgressDashboard } from '@/components/sections/progress-dashboard';

export default function ProgressPage() {
  const items = buildSearchIndex().filter((item) => item.kind !== 'reference');

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Local Storage" title="Progress Tracker" description="Track page visits and checklist completion locally in your browser. Reset anytime." tags={['localStorage', 'Checklists', 'Visited pages']} />
      <ProgressDashboard checklistItems={items} />
    </div>
  );
}
