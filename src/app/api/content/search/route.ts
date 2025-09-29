import { NextResponse } from "next/server";

import { createSnippet, getAllDocuments } from "../../../../lib/content";

interface SearchResult {
  slug: string;
  title: string;
  snippet: string;
  score: number;
}

function scoreDocument(text: string, query: string): number {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return 0;
  }

  const haystack = text.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (!term) {
      continue;
    }

    let index = haystack.indexOf(term);
    while (index !== -1) {
      score += term.length;
      index = haystack.indexOf(term, index + term.length);
    }
  }

  return score;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ query: "", results: [] });
  }

  const documents = await getAllDocuments();
  const scoredResults: SearchResult[] = documents
    .map((document) => {
      const fullText = `${document.frontmatter.title}\n${document.body}`;
      const score = scoreDocument(fullText, query);
      return {
        slug: document.slug,
        title: document.frontmatter.title,
        snippet: createSnippet(document.body, query),
        score,
      } satisfies SearchResult;
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json({
    query,
    results: scoredResults.map(({ score, ...rest }) => rest),
  });
}
