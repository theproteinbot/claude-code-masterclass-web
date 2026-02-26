import { buildSearchIndex } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { SearchBrowser } from '@/components/sections/search-browser';

export default function SearchPage() {
  const items = buildSearchIndex();

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Index" title="Search and Filter" description="Search modules, activities, prompts, rubrics, and references across all canonical curriculum markdown files." tags={['Module search', 'Activity filter', 'Reference lookup']} />
      <SearchBrowser items={items} />
    </div>
  );
}
