import { getDocById, getLearningPathCards } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { LearningPathsBoard } from '@/components/sections/learning-paths-board';

export default function LearningPathsPage() {
  const doc = getDocById('learning-paths');
  const cards = getLearningPathCards();

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Tracks" title="Learning Paths" description={doc.summary} tags={['Beginner', 'Intermediate', 'Advanced']} />
      <LearningPathsBoard cards={cards} />
    </div>
  );
}
