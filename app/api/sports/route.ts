import { NextResponse } from "next/server";
import { fallbackGame } from "@/lib/data";

export async function GET() {
  const key = process.env.SPORTS_API_KEY;
  if (!key) return NextResponse.json({ game: fallbackGame, stale: true });
  // Provider adapters normalize remote responses into the stable UI contract.
  try {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/florida/schedule", { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error("Sports provider failed");
    const data = await response.json();
    return NextResponse.json({ raw: data, stale: false });
  } catch {
    return NextResponse.json({ game: fallbackGame, stale: true });
  }
}
