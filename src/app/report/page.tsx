"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ReportSummary } from "@/components/ReportSummary";
import { ClauseCard } from "@/components/ClauseCard";
import { useLeaseStore } from "@/lib/store";

export default function ReportPage() {
  const router = useRouter();
  const { data } = useLeaseStore();

  if (!data.analysis) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-4 text-body">No analysis data found.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Upload a lease
        </Link>
      </main>
    );
  }

  const { clauses, summary } = data.analysis;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-lg font-semibold text-ink">Lease Analysis</h1>
        <div className="w-16" />
      </div>

      <div className="mb-6">
        <ReportSummary summary={summary} />
      </div>

      <div className="space-y-4">
        {clauses.map((clause, i) => (
          <ClauseCard key={i} clause={clause} index={i} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/chat")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-on-primary hover:bg-primary-active transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Chat about this lease
        </button>
      </div>
    </main>
  );
}
