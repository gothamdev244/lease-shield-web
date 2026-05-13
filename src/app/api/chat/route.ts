const AGENT_URL = process.env.AGENT_API_URL || "https://lease-shield-agent.fly.dev";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${AGENT_URL}/agents/lease-analyzer/${body.sessionId || "default"}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "chat",
        leaseText: body.leaseText,
        question: body.question,
        sessionId: body.sessionId,
      }),
    },
  );

  if (!res.ok) {
    return new Response(`Agent error: ${res.statusText}`, { status: res.status });
  }

  return new Response(res.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
