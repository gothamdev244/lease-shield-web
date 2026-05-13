"use client";

import { Scale, AlertTriangle, IndianRupee, CheckCircle } from "lucide-react";
import type { AnalysisSummary } from "@/lib/types";

interface Props {
  summary: AnalysisSummary;
}

export function ReportSummary({ summary }: Props) {
  const items = [
    { icon: Scale, label: "violations", count: summary.violations, color: "text-severity-high" },
    { icon: AlertTriangle, label: "risks", count: summary.risks, color: "text-severity-medium" },
    { icon: IndianRupee, label: "traps", count: summary.traps, color: "text-primary" },
    { icon: CheckCircle, label: "safe", count: summary.safe, color: "text-semantic-up" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-soft p-4 text-sm">
      <span className="font-semibold text-ink">{summary.total} clauses analyzed</span>
      <span className="text-hairline">|</span>
      {items.map(({ icon: Icon, label, count, color }) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="font-medium text-ink">{count}</span>
          <span className="text-muted">{label}</span>
        </span>
      ))}
    </div>
  );
}
