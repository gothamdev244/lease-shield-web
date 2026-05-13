import { NextResponse } from "next/server";

export const maxDuration = 60;

const AGENT_URL = process.env.AGENT_API_URL || "https://lease-shield-agent.fly.dev";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
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

  if (!res.ok) {
    return NextResponse.json(
      { error: `Agent error: ${res.statusText}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data.result ?? data);
}
