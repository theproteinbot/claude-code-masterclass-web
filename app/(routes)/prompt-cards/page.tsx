import { getDocById, getPromptCards } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { PromptCardsBoard } from '@/components/sections/prompt-cards-board';

export default function PromptCardsPage() {
  const doc = getDocById('prompt-cards');
  const cards = getPromptCards();

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Reusable Templates" title="Prompt Cards" description={doc.summary} tags={['Copy to clipboard', 'Templates', 'Anti-patterns']} />
      <PromptCardsBoard cards={cards} />
    </div>
  );
}
