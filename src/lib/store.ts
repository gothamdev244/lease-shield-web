"use client";

import { createContext, useContext } from "react";
import type { AnalysisResult, Stage } from "./types";

export interface LeaseState {
  leaseText: string;
  stage: Stage;
  state: string;
  analysis: AnalysisResult | null;
  sessionId: string;
}

export interface LeaseStore {
  data: LeaseState;
  setLeaseText: (text: string) => void;
  setStage: (stage: Stage) => void;
  setState: (state: string) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
}

export const LeaseContext = createContext<LeaseStore | null>(null);

export function useLeaseStore(): LeaseStore {
  const ctx = useContext(LeaseContext);
  if (!ctx) throw new Error("useLeaseStore must be used within LeaseProvider");
  return ctx;
}
