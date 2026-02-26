'use client';

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/components/providers/progress-provider';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { state } = useProgress();
  const completedCount = Object.values(state.checked).filter(Boolean).length;

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">CC</span>
          <span className="truncate font-display text-lg">Masterclass</span>
        </Link>

        <nav className="ml-3 hidden flex-1 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                pathname === item.href && 'bg-muted text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex" aria-label="Search curriculum">
            <Search className="h-4 w-4" />
          </Link>
          <div className="hidden items-center rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground sm:flex">
            {completedCount} checks · {state.visited.length} pages
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background/95 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 md:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                  pathname === item.href && 'bg-muted text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
