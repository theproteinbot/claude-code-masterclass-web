import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  tags?: string[];
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, description, tags = [], className, children }: Props) {
  return (
    <section className={cn('relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 shadow-soft backdrop-blur md:p-8', className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-[size:24px_24px] opacity-40" />
      <div className="max-w-4xl space-y-4">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl tracking-tight md:text-5xl">{title}</h1>
        {description ? <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p> : null}
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
