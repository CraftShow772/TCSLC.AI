import type { SearchResult } from "@/lib/vector-store";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: SearchResult[];
}
