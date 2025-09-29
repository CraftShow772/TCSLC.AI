import { getSearchDocuments } from "@/lib/content";

export interface SearchResult {
  id: string;
  type: string;
  slug: string;
  title: string;
  summary: string;
  category?: string;
  score: number;
}

interface VectorDocument extends SearchResult {
  body: string;
  vector: number[];
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function embed(text: string): number[] {
  const counts = new Array(ALPHABET.length).fill(0) as number[];
  const normalized = text.toLowerCase();
  for (const char of normalized) {
    const index = ALPHABET.indexOf(char);
    if (index >= 0) {
      counts[index] += 1;
    }
  }
  const magnitude = Math.hypot(...counts);
  if (magnitude === 0) {
    return counts;
  }
  return counts.map((value) => value / magnitude);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let sum = 0;
  for (let index = 0; index < length; index += 1) {
    sum += a[index] * b[index];
  }
  return sum;
}

type GlobalIndex = {
  documents: VectorDocument[];
};

declare const globalThis: typeof global & { __vectorIndex?: GlobalIndex };

async function ensureIndex(): Promise<VectorDocument[]> {
  if (!globalThis.__vectorIndex) {
    const documents = await getSearchDocuments();
    globalThis.__vectorIndex = {
      documents: documents.map((doc) => ({
        id: `${doc.type}:${doc.slug}`,
        type: doc.type,
        slug: doc.slug,
        title: doc.title,
        summary: doc.summary,
        category: doc.category,
        body: doc.body,
        score: 0,
        vector: embed(`${doc.title} ${doc.summary} ${doc.body}`),
      })),
    };
  }
  return globalThis.__vectorIndex.documents;
}

export async function searchDocuments(query: string, limit = 3): Promise<SearchResult[]> {
  const documents = await ensureIndex();
  const queryVector = embed(query);
  return documents
    .map((doc) => ({ ...doc, score: cosineSimilarity(doc.vector, queryVector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ vector: _vector, body: _body, ...rest }) => rest);
}
