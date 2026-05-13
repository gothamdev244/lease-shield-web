export type Stage = "pre-sign" | "post-sign";

export type ClauseCategory =
  | "legal-violation"
  | "tenant-right"
  | "hidden-risk"
  | "financial-trap"
  | "lock-in-issue"
  | "standard";

export type Severity = "high" | "medium" | "low";

export interface Clause {
  clauseText: string;
  category: ClauseCategory;
  title: string;
  explanation: string;
  lawReference: string;
  action: string;
  severity: Severity;
}

export interface AnalysisSummary {
  total: number;
  violations: number;
  risks: number;
  traps: number;
  safe: number;
}

export interface AnalysisResult {
  clauses: Clause[];
  summary: AnalysisSummary;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const INDIAN_STATES = [
  { value: "maharashtra", label: "Maharashtra" },
  { value: "karnataka", label: "Karnataka" },
  { value: "delhi", label: "Delhi" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "telangana", label: "Telangana" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "gujarat", label: "Gujarat" },
  { value: "kerala", label: "Kerala" },
  { value: "other", label: "Other State" },
] as const;
