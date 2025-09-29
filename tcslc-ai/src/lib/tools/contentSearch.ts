import { performance } from "perf_hooks";
import { Citation } from "../ai/types";

type ContentSearchArgs = { q: string };

type ContentSearchResult = { matches: Citation[]; took: number };

const knowledgeBase: Citation[] = [
  {
    title: "Leadership Labs",
    url: "https://www.tcslc.com/programs/leadership-labs",
    snippet: "Hands-on workshops that connect emerging leaders with mentors across the Treasure Coast.",
  },
  {
    title: "Community Impact Grants",
    url: "https://www.tcslc.com/impact/grants",
    snippet: "Micro-grants that help members pilot service ideas with measurable outcomes.",
  },
  {
    title: "Membership Guide",
    url: "https://www.tcslc.com/membership",
    snippet: "Everything you need to know about joining TCSLC and getting plugged into projects fast.",
  },
];

export async function runContentSearch(args: ContentSearchArgs): Promise<ContentSearchResult> {
  const query = args.q.trim().toLowerCase();
  const start = performance.now();
  const matches = knowledgeBase.filter((entry) => {
    const haystack = `${entry.title} ${entry.snippet ?? ""}`.toLowerCase();
    return query.split(/\s+/).every((token) => haystack.includes(token));
  });
  const took = Math.round(performance.now() - start);
  return { matches, took };
}
