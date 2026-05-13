import type { AnalysisResult, Stage } from "./types";

const API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:3583";

export async function analyzeLeaseText(
  leaseText: string,
  stage: Stage,
  state: string,
): Promise<AnalysisResult> {
  const res = await fetch(`${API_URL}/agents/lease-analyzer/session-${Date.now()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "analyze",
      leaseText,
      stage,
      state,
    }),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.statusText}`);
  }

  return res.json();
}

export async function chatAboutLease(
  leaseText: string,
  question: string,
  sessionId: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const res = await fetch(`${API_URL}/agents/lease-analyzer/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "chat",
      leaseText,
      question,
      sessionId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat failed: ${res.statusText}`);
  }

  return res.body;
}
