import { NextResponse } from "next/server";
import { classifyIntent } from "../../../../lib/intents";

export async function POST(request: Request) {
  let query = "";

  try {
    const body = await request.json();
    if (typeof body?.query === "string") {
      query = body.query;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Query text is required." },
      { status: 400 }
    );
  }

  const result = classifyIntent(query);

  return NextResponse.json({
    query,
    ...result
  });
}
