import type { AnalysisResult, Stage } from "./types";

export async function analyzeLeaseText(
  leaseText: string,
  stage: Stage,
  state: string,
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaseText, stage, state }),
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
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaseText, question, sessionId }),
  });

  if (!res.ok) {
    throw new Error(`Chat failed: ${res.statusText}`);
  }

  return res.body;
}
