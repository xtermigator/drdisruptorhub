import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.NOTION_API_KEY) return NextResponse.json({ error: "Notion sync is not configured." }, { status: 503 });
  // This route is the server-only boundary for future database-specific mappers.
  return NextResponse.json({ imported: 0, updated: 0, synced_at: new Date().toISOString() });
}
