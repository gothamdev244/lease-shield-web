"use client";

import { useState } from "react";
import {
  Scale,
  Shield,
  AlertTriangle,
  IndianRupee,
  Lock,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";
import type { Clause, ClauseCategory, Severity } from "@/lib/types";

const categoryConfig: Record<
  ClauseCategory,
  { icon: typeof Scale; label: string }
> = {
  "legal-violation": { icon: Scale, label: "Legal Violation" },
  "tenant-right": { icon: Shield, label: "Tenant Right" },
  "hidden-risk": { icon: AlertTriangle, label: "Hidden Risk" },
  "financial-trap": { icon: IndianRupee, label: "Financial Trap" },
  "lock-in-issue": { icon: Lock, label: "Lock-in Issue" },
  standard: { icon: CheckCircle, label: "Standard" },
};

const severityBorder: Record<Severity, string> = {
  high: "border-l-severity-high",
  medium: "border-l-severity-medium",
  low: "border-l-severity-low",
};

const severityBadge: Record<Severity, string> = {
  high: "bg-severity-high/10 text-severity-high",
  medium: "bg-severity-medium/10 text-severity-medium",
  low: "bg-severity-low/10 text-severity-low",
};

interface Props {
  clause: Clause;
  index: number;
}

export function ClauseCard({ clause, index }: Props) {
  const [copied, setCopied] = useState(false);
  const { icon: Icon, label } = categoryConfig[clause.category];

  async function copyAction() {
    await navigator.clipboard.writeText(clause.action);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`animate-fade-up rounded-2xl border border-hairline border-l-4 ${severityBorder[clause.severity]} bg-background p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {label}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${severityBadge[clause.severity]}`}
        >
          {clause.severity}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold text-ink">{clause.title}</h3>

      {/* Clause text */}
      <blockquote className="mb-3 rounded-xl bg-surface-soft p-3 font-mono text-xs leading-relaxed text-body">
        &ldquo;{clause.clauseText}&rdquo;
      </blockquote>

      {/* Explanation */}
      <p className="mb-3 text-sm leading-relaxed text-body">
        {clause.explanation}
      </p>

      {/* Law reference */}
      <span className="mb-3 inline-block rounded-full bg-surface-strong px-3 py-1 text-xs text-muted">
        {clause.lawReference}
      </span>

      {/* Action */}
      <div className="mt-3 rounded-xl border border-hairline-soft bg-surface-soft p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-ink">
            {clause.severity === "low" ? "Note" : "What you can do"}
          </span>
          <button
            onClick={copyAction}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-primary hover:bg-primary/5 transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-body">{clause.action}</p>
      </div>
    </div>
  );
}
