import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownContent } from '@/components/sections/markdown-content';

export function SectionCard({
  title,
  description,
  tags,
  markdown,
}: {
  title: string;
  description?: string;
  tags?: string[];
  markdown: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <MarkdownContent markdown={markdown} />
      </CardContent>
    </Card>
  );
}
