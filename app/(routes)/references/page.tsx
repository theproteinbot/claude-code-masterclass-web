import { getReferenceEntries } from '@/lib/content';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownContent } from '@/components/sections/markdown-content';

export default function ReferencesPage() {
  const { doc, entries } = getReferenceEntries();
  const grouped = entries.reduce((map, entry) => {
    const key = entry.group;
    const list = map.get(key) ?? [];
    list.push(entry);
    map.set(key, list);
    return map;
  }, new Map<string, (typeof entries)[number][]>());
  const byGroup = Array.from(grouped.entries());

  return (
    <div className="space-y-6">
      <PageHero eyebrow="Trusted Sources" title="Reference Pack" description={doc.summary} tags={['Primary docs first', 'Vendor docs', 'Protocol specs', 'Engineering references']} />

      {byGroup.map(([group, groupEntries]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{group}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {groupEntries.map((entry) => (
              <a key={entry.id} href={entry.url} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/40">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{entry.label}</Badge>
                  {entry.subgroup ? <Badge className="bg-card">{entry.subgroup}</Badge> : null}
                </div>
                <p className="mb-2 break-all text-sm font-medium text-foreground">{entry.url}</p>
                {entry.whyTrusted ? <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Why trusted:</span> {entry.whyTrusted}</p> : null}
                {entry.usedFor ? <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">Used for:</span> {entry.usedFor}</p> : null}
              </a>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Canonical Reference Markdown</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownContent markdown={doc.raw} className="max-h-[560px] overflow-auto pr-2 text-xs" />
        </CardContent>
      </Card>
    </div>
  );
}
