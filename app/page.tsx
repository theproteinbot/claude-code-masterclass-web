import Link from 'next/link';
import { ArrowRight, BookOpen, ClipboardList, Rocket, Search } from 'lucide-react';
import { getHomeHighlights, getLearningPathCards, getWorkshopAgenda, getLabCards, getPromptCards } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { AnimatedCard } from '@/components/layout/animated-card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressCheckItem } from '@/components/sections/progress-check-item';

export default function HomePage() {
  const { overview, outcomes, formats, stats, featureDocs } = getHomeHighlights();
  const paths = getLearningPathCards();
  const agenda = getWorkshopAgenda();
  const labs = getLabCards();
  const prompts = getPromptCards();

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHero
        eyebrow="Instructor-Ready Curriculum"
        title="Master Claude Code Masterclass"
        description={overview.summary}
        tags={['App Router', 'Interactive Curriculum', 'Markdown-Driven', 'Local Progress Tracking']}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/workshop" className="inline-flex">
            <Button size="lg">
              Start 90-Min Workshop
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/learning-paths" className="inline-flex">
            <Button variant="outline" size="lg">Explore Learning Paths</Button>
          </Link>
          <Link href="/search" className="inline-flex">
            <Button variant="ghost" size="lg">
              <Search className="mr-2 h-4 w-4" /> Search Modules
            </Button>
          </Link>
        </div>
      </PageHero>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label}>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </AnimatedCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <AnimatedCard>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <CardTitle>Learning Outcomes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {outcomes.map((outcome, i) => (
              <ProgressCheckItem key={i} id={`home:outcome:${i}`} label={outcome} />
            ))}
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle>Delivery Formats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {formats.map((format, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/30 p-3 text-sm">{format}</div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="rounded-lg border border-border p-2">{paths.length} Tracks</div>
              <div className="rounded-lg border border-border p-2">{agenda.length} Agenda Blocks</div>
              <div className="rounded-lg border border-border p-2">{labs.length} Labs · {prompts.length} Cards</div>
            </div>
          </CardContent>
        </AnimatedCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {featureDocs.map((doc) => (
          <AnimatedCard key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{doc.title}</CardTitle>
                <Badge>{doc.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </CardHeader>
            <CardContent>
              <Link href={doc.route}>
                <Button variant="outline" size="sm">
                  Open Section
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </AnimatedCard>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AnimatedCard>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <CardTitle>Canonical Source Guarantee</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This site renders from the markdown artifacts in <code>../out_full</code> at runtime/build time, so citations and references stay tied to the generated curriculum package.</p>
            <p>Use the References page to inspect trusted-source links and the Search page to filter modules and activities across the full curriculum.</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard>
          <CardHeader>
            <CardTitle>Quick Start Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              'Choose a track in Learning Paths',
              'Run the Workshop page as a live agenda',
              'Use Labs checkpoints with progress tracking',
              'Assess with Rubrics + Capstone scoring',
              'Reuse Prompt Cards during delivery',
            ].map((step, i) => (
              <ProgressCheckItem key={i} id={`home:quickstart:${i}`} label={step} />
            ))}
          </CardContent>
        </AnimatedCard>
      </section>
    </div>
  );
}
