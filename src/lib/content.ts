import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";

export type ContentMeta = {
  title: string;
  slug: string;
  excerpt?: string;
};

export type ContentEntry = {
  meta: ContentMeta;
  content: ReactElement;
};

const CONTENT_DIRECTORY = path.join(process.cwd(), "src/content");
const EXCERPT_LENGTH = 160;

function createExcerpt(markdown: string): string | undefined {
  const normalized = markdown.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return undefined;
  }

  if (normalized.length <= EXCERPT_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
}

async function getContentFileNames(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIRECTORY);
    return files.filter((fileName) => fileName.endsWith(".mdx"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function getContentList(): Promise<ContentMeta[]> {
  const fileNames = await getContentFileNames();

  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const raw = await fs.readFile(path.join(CONTENT_DIRECTORY, fileName), "utf8");
      const { data, content } = matter(raw);

      const title = typeof data.title === "string" ? data.title : fileName.replace(/\.mdx$/, "");
      const slug = typeof data.slug === "string" ? data.slug : fileName.replace(/\.mdx$/, "");

      return {
        title,
        slug,
        excerpt: createExcerpt(content),
      } satisfies ContentMeta;
    })
  );

  return entries.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getContentBySlug(slug: string): Promise<ContentEntry> {
  const filePath = path.join(CONTENT_DIRECTORY, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(source);

  const compiled = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
  });

  const title = typeof data.title === "string" ? data.title : slug;
  const canonicalSlug = typeof data.slug === "string" ? data.slug : slug;

  return {
    meta: {
      title,
      slug: canonicalSlug,
      excerpt: createExcerpt(content),
    },
    content: compiled.content,
  };
}
