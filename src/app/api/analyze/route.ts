import { NextResponse } from "next/server";

export const maxDuration = 60;

const AGENT_URL = process.env.AGENT_API_URL || "https://lease-shield-agent.fly.dev";

export async function POST(req: Request) {
  const body = await req.json();

  let res: Response;
  try {
    res = await fetch(
      `${AGENT_URL}/agents/lease-analyzer/session-${Date.now()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "analyze",
          leaseText: body.leaseText,
          stage: body.stage,
          state: body.state,
        }),
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analysis server. Please try again." },
      { status: 502 },
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    const msg = data?.error?.message || data?.error || "Analysis failed. The server returned an unexpected response.";
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const result = data.result ?? data;

  if (!result?.clauses?.length) {
    return NextResponse.json(
      { error: "The document could not be analyzed as a lease agreement. Please upload a rental/lease agreement PDF." },
      { status: 422 },
    );
  }

  return NextResponse.json(result);
}
