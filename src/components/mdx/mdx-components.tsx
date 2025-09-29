import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  a: ({ href = "#", children, ...props }) => (
    <Link
      href={href}
      className="text-primary underline-offset-4 hover:underline"
      {...props}
    >
      {children}
    </Link>
  ),
  h1: (props) => <h1 className="text-3xl font-semibold tracking-tight" {...props} />,
  h2: (props) => <h2 className="mt-8 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-6 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7 text-muted-foreground" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props) => <li className="leading-7 text-muted-foreground" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-primary/60 pl-4 text-muted-foreground"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mt-6 overflow-hidden rounded-lg border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="bg-muted px-4 py-2 text-left font-medium text-foreground" {...props} />
  ),
  td: (props) => <td className="px-4 py-2 align-top text-muted-foreground" {...props} />,
  code: (props) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props} />
  ),
};
