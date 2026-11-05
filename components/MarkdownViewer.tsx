"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content || !content.trim()) {
    return (
      <div className="py-6 text-sm text-muted">
        No case study or README documentation has been added for this project
        yet.
      </div>
    );
  }

  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 border-b border-line pb-3 text-2xl font-semibold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 text-xl font-semibold text-accent-ink">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 text-lg font-semibold">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-base leading-[1.65] text-ink-soft">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed marker:text-accent">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-accent pl-4 italic text-ink-soft">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const className =
              child && typeof child === "object" && "props" in child
                ? (child.props as { className?: string }).className
                : undefined;
            const match = /language-(\w+)/.exec(className || "");

            return (
              <div className="my-5 overflow-hidden border border-line bg-paper-deep">
                {match ? (
                  <div className="border-b border-line px-4 py-1.5 font-mono text-meta uppercase text-muted">
                    {match[1]}
                  </div>
                ) : null}
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-ink">
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <code {...props}>{children}</code>;
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto border border-line">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-line font-mono text-meta uppercase text-muted">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-line">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-paper-raised">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-ink-soft">{children}</td>
          ),
          hr: () => <hr className="my-8 border-line" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
