import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllDocuments, getDocumentBySlug } from "../../../lib/content";

interface DocumentPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const documents = await getAllDocuments();
  return documents.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const document = await getDocumentBySlug(params.slug);

  if (!document) {
    return { title: "Document Not Found" };
  }

  return {
    title: `${document.frontmatter.title} | TCSLC`,
    description: document.frontmatter.description ?? undefined,
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const document = await getDocumentBySlug(params.slug);

  if (!document) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Resource
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {document.frontmatter.title}
        </h1>
      </header>
      <article className="prose prose-slate dark:prose-invert">
        <MDXRemote source={document.body} />
      </article>
    </div>
  );
}
