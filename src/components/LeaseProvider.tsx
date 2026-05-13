"use client";

import { useState, useMemo } from "react";
import { LeaseContext, type LeaseState } from "@/lib/store";
import type { AnalysisResult, Stage } from "@/lib/types";

export function LeaseProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LeaseState>({
    leaseText: "",
    stage: "pre-sign",
    state: "maharashtra",
    analysis: null,
    sessionId: `session-${Date.now()}`,
  });

  const store = useMemo(
    () => ({
      data,
      setLeaseText: (leaseText: string) =>
        setData((prev) => ({ ...prev, leaseText })),
      setStage: (stage: Stage) => setData((prev) => ({ ...prev, stage })),
      setState: (state: string) => setData((prev) => ({ ...prev, state })),
      setAnalysis: (analysis: AnalysisResult) =>
        setData((prev) => ({ ...prev, analysis })),
    }),
    [data],
  );

  return (
    <LeaseContext.Provider value={store}>{children}</LeaseContext.Provider>
  );
}
