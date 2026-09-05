import { NextRequest, NextResponse } from "next/server";

type BrainRequest = { message?: string; current_screen?: string; selected_item?: string };

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BrainRequest;
  if (!body.message?.trim()) return NextResponse.json({ error: "A message is required." }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      answer: `Focus on the most time-sensitive action in ${body.selected_item ?? body.current_screen ?? "your dashboard"}. Break it into one 25-minute step, then reassess.`,
      provider: "local-fallback"
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5-mini",
      instructions: "You are Brain, a concise personal operating-system assistant. Give a specific, calm next action. Never claim you completed an action.",
      input: `Screen: ${body.current_screen ?? "unknown"}\nSelected item: ${body.selected_item ?? "none"}\nUser: ${body.message}`,
      max_output_tokens: 300
    })
  });
  if (!response.ok) return NextResponse.json({ error: "The assistant is temporarily unavailable." }, { status: 502 });
  const result = await response.json() as { output_text?: string };
  return NextResponse.json({ answer: result.output_text ?? "I could not form a response.", provider: "openai" });
}
