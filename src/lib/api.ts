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

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.clauses) {
    throw new Error(
      data?.error || "Analysis failed. Please check your PDF and try again.",
    );
  }

  return data;
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
    const text = await res.text().catch(() => "");
    throw new Error(text || "Chat failed. Please try again.");
  }

  return res.body;
}
