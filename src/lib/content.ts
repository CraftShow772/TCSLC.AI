import fs from "node:fs/promises";
import path from "node:path";

export interface ContentFrontmatter {
  title: string;
  slug: string;
  [key: string]: string;
}

export interface ContentDocument {
  slug: string;
  body: string;
  frontmatter: ContentFrontmatter;
  filepath: string;
}

const CONTENT_DIRECTORY = path.join(process.cwd(), "src", "content");
const SUPPORTED_EXTENSIONS = [".mdx", ".md"];

interface ParsedFrontmatter {
  data: Record<string, string>;
  body: string;
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const normalized = raw.startsWith("\ufeff") ? raw.slice(1) : raw;
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!frontmatterMatch) {
    return { data: {}, body: normalized.trim() };
  }

  const frontmatterBlock = frontmatterMatch[1];
  const body = normalized.slice(frontmatterMatch[0].length).trim();
  const data: Record<string, string> = {};

  for (const line of frontmatterBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const [rawKey, ...rawValueParts] = trimmed.split(":");
    const key = rawKey.trim();
    const rawValue = rawValueParts.join(":").trim();
    const unquotedValue = rawValue.replace(/^"/, "").replace(/"$/, "");

    if (key) {
      data[key] = unquotedValue;
    }
  }

  return { data, body };
}

async function readDocumentFile(filepath: string): Promise<ContentDocument | null> {
  const fileContents = await fs.readFile(filepath, "utf8");
  const parsed = parseFrontmatter(fileContents);
  const { data, body } = parsed;
  const slug = (data.slug || path.parse(filepath).name).trim();
  const title = (data.title || slug).trim();

  if (!slug) {
    return null;
  }

  const frontmatter: ContentFrontmatter = {
    title,
    slug,
    ...data,
  };

  return {
    slug,
    body,
    frontmatter,
    filepath,
  };
}

async function listContentFiles(): Promise<string[]> {
  const files = await fs.readdir(CONTENT_DIRECTORY);
  return files
    .filter((file) => SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(CONTENT_DIRECTORY, file));
}

export async function getAllDocuments(): Promise<ContentDocument[]> {
  const files = await listContentFiles();
  const documents: ContentDocument[] = [];

  for (const filepath of files) {
    const document = await readDocumentFile(filepath);
    if (document) {
      documents.push(document);
    }
  }

  return documents.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

export async function getDocumentBySlug(slug: string): Promise<ContentDocument | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  for (const extension of SUPPORTED_EXTENSIONS) {
    const targetPath = path.join(CONTENT_DIRECTORY, `${normalizedSlug}${extension}`);

    try {
      const document = await readDocumentFile(targetPath);
      if (document) {
        return document;
      }
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  const documents = await getAllDocuments();
  return (
    documents.find((document) => document.slug.toLowerCase() === normalizedSlug) ?? null
  );
}

export function createSnippet(text: string, query: string, length = 200): string {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (!normalizedText) {
    return "";
  }

  const normalizedQuery = query.toLowerCase();
  const lowerText = normalizedText.toLowerCase();
  const index = lowerText.indexOf(normalizedQuery);

  if (index === -1) {
    return normalizedText.length > length
      ? `${normalizedText.slice(0, length).trimEnd()}…`
      : normalizedText;
  }

  const half = Math.floor((length - normalizedQuery.length) / 2);
  const start = Math.max(0, index - half);
  const end = Math.min(normalizedText.length, index + normalizedQuery.length + half);

  let snippet = normalizedText.slice(start, end).trim();
  if (start > 0) {
    snippet = `…${snippet}`;
  }
  if (end < normalizedText.length) {
    snippet = `${snippet}…`;
  }

  return snippet;
}
