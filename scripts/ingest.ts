import fs from "node:fs/promises";
import path from "node:path";

import { getAllDocuments } from "../src/lib/content";

interface IngestChunk {
  slug: string;
  title: string;
  heading: string | null;
  content: string;
}

function splitIntoChunks(body: string): IngestChunk[] {
  const lines = body.split(/\r?\n/);
  const chunks: IngestChunk[] = [];
  let currentHeading: string | null = null;
  let buffer: string[] = [];

  const pushChunk = () => {
    if (buffer.length === 0) {
      return;
    }

    const content = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (content) {
      chunks.push({
        slug: "",
        title: "",
        heading: currentHeading,
        content,
      });
    }

    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      pushChunk();
      currentHeading = headingMatch[2].trim();
      continue;
    }

    buffer.push(line.trim());
  }

  pushChunk();

  return chunks;
}

async function main() {
  const documents = await getAllDocuments();
  const chunks: IngestChunk[] = [];

  for (const document of documents) {
    const documentChunks = splitIntoChunks(document.body).map((chunk) => ({
      ...chunk,
      slug: document.slug,
      title: document.frontmatter.title,
    }));

    if (documentChunks.length === 0) {
      chunks.push({
        slug: document.slug,
        title: document.frontmatter.title,
        heading: null,
        content: document.body.replace(/\s+/g, " ").trim(),
      });
    } else {
      chunks.push(...documentChunks);
    }
  }

  const outputDirectory = path.join(process.cwd(), ".cache", "ingest");
  const outputFile = path.join(outputDirectory, "content.json");

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(chunks, null, 2), "utf8");

  console.log(`Wrote ${chunks.length} content chunks to ${path.relative(process.cwd(), outputFile)}`);
}

main().catch((error) => {
  console.error("Failed to ingest content", error);
  process.exit(1);
});
