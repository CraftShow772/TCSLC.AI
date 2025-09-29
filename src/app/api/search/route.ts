import { NextResponse } from "next/server";

import { searchDocuments } from "@/lib/vector-store";
import { recordAuditLog } from "@/lib/audit";
import { getRateLimitWindow, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (!rateLimit(`search:${ip}`)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(getRateLimitWindow() / 1000) } },
    );
  }

  const { query } = await request.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ message: "Missing query" }, { status: 400 });
  }

  const results = await searchDocuments(query, 5);
  await recordAuditLog({
    actor: ip,
    action: "vector_search",
    resource: "knowledge-base",
    detail: { query, results: results.map((result) => result.id) },
  });

  return NextResponse.json({ results });
}
