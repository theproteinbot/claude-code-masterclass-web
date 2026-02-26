'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  markdown: string;
  className?: string;
};

export function MarkdownContent({ markdown, className }: Props) {
  return (
    <div className={['prose-doc', className].filter(Boolean).join(' ')}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            const external = /^https?:\/\//.test(href);
            if (external) {
              return (
                <a href={href} target="_blank" rel="noreferrer" className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  {children}
                </a>
              );
            }
            return (
              <Link href={href} className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                {children}
              </Link>
            );
          },
          h1: ({ children }) => <h1 className="mt-6 text-3xl">{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          h4: ({ children }) => <h4 className="mt-5 text-lg">{children}</h4>,
          p: ({ children }) => <p>{children}</p>,
          code: ({ children, className }) => {
            if (String(className).includes('language-')) return <code className={className}>{children}</code>;
            return <code>{children}</code>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
