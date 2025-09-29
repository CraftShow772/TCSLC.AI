import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ReactElement } from "react";

import { mdxComponents } from "@/components/mdx/mdx-components";

export const CONTENT_TYPES = ["services", "faqs", "documents", "fees"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export interface ContentMeta {
  title: string;
  slug: string;
  summary: string;
  category?: string;
  tags?: string[];
  order?: number;
  lastUpdated?: string;
}

export interface ContentEntry extends ContentMeta {
  type: ContentType;
  body: string;
}

export interface CompiledContent extends ContentMeta {
  type: ContentType;
  component: ReactElement;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

async function getDirectoryEntries(type: ContentType): Promise<string[]> {
  const directory = path.join(CONTENT_DIR, type);
  const entries = await fs.readdir(directory);
  return entries.filter((entry) => entry.endsWith(".mdx"));
}

export async function getContentIndex(): Promise<ContentEntry[]> {
  const collections = await Promise.all(
    CONTENT_TYPES.map(async (type) => {
      const files = await getDirectoryEntries(type);
      const items = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(CONTENT_DIR, type, file);
          const raw = await fs.readFile(filePath, "utf-8");
          const parsed = matter(raw);
          const frontmatter = parsed.data as Partial<ContentMeta>;
          const slug = frontmatter.slug ?? file.replace(/\.mdx$/, "");
          return {
            type,
            slug,
            title: frontmatter.title ?? slug,
            summary: frontmatter.summary ?? "",
            category: frontmatter.category,
            tags: frontmatter.tags ?? [],
            order: frontmatter.order ?? 0,
            lastUpdated: frontmatter.lastUpdated,
            body: parsed.content.trim(),
          } satisfies ContentEntry;
        }),
      );
      return items;
    }),
  );

  return collections
    .flat()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
}

export async function getContentSummaries(type: ContentType): Promise<ContentMeta[]> {
  const index = await getContentIndex();
  return index.filter((entry) => entry.type === type).map(({ body, type: _type, ...meta }) => meta);
}

export async function getCompiledContent(type: ContentType, slug: string): Promise<CompiledContent> {
  const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<ContentMeta>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return {
    type,
    component: content,
    ...frontmatter,
    slug: frontmatter.slug ?? slug,
  } satisfies CompiledContent;
}

export async function getSearchDocuments(): Promise<ContentEntry[]> {
  return getContentIndex();
}
