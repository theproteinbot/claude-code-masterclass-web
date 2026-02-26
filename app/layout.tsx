import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ProgressProvider } from '@/components/providers/progress-provider';
import { SiteShell } from '@/components/layout/site-shell';

export const metadata: Metadata = {
  title: 'Claude Code Masterclass',
  description: 'Interactive curriculum site generated from completed masterclass markdown artifacts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ProgressProvider>
            <SiteShell>{children}</SiteShell>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
