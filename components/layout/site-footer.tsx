import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>Interactive curriculum site generated from canonical markdown in <code>../out_full</code>.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/references" className="hover:text-foreground">Trusted References</Link>
          <Link href="/search" className="hover:text-foreground">Search</Link>
          <Link href="/progress" className="hover:text-foreground">Progress</Link>
        </div>
      </div>
    </footer>
  );
}
