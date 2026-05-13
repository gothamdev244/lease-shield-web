"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Loader2, ChevronDown } from "lucide-react";
import { useLeaseStore } from "@/lib/store";
import { extractTextFromPdf } from "@/lib/pdf";
import { analyzeLeaseText } from "@/lib/api";
import { INDIAN_STATES, type Stage } from "@/lib/types";

export function FileUpload() {
  const router = useRouter();
  const store = useLeaseStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  async function onSubmit() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        setError("Could not extract text from this PDF. It may be scanned — try a text-based PDF.");
        setLoading(false);
        return;
      }
      store.setLeaseText(text);

      const result = await analyzeLeaseText(text, store.data.stage, store.data.state);
      store.setAnalysis(result);
      router.push("/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : file
              ? "border-semantic-up bg-semantic-up/5"
              : "border-hairline hover:border-primary/40"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-semantic-up" />
            <p className="text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-muted">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-muted-soft" />
            <p className="text-sm font-medium text-ink">
              Drop your lease PDF here
            </p>
            <p className="text-xs text-muted">or click to browse</p>
          </div>
        )}
      </div>

      {/* Stage selector */}
      <div className="flex gap-3">
        {(["pre-sign", "post-sign"] as Stage[]).map((s) => (
          <button
            key={s}
            onClick={() => store.setStage(s)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              store.data.stage === s
                ? "bg-primary text-on-primary"
                : "bg-surface-strong text-ink hover:bg-hairline"
            }`}
          >
            {s === "pre-sign" ? "I'm about to sign" : "I already signed"}
          </button>
        ))}
      </div>

      {/* State dropdown */}
      <div className="relative">
        <select
          value={store.data.state}
          onChange={(e) => store.setState(e.target.value)}
          className="w-full appearance-none rounded-xl border border-hairline bg-background px-4 py-3 pr-10 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {INDIAN_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      {error && (
        <p className="rounded-xl bg-semantic-down/10 px-4 py-3 text-sm text-semantic-down">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!file || loading}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-on-primary transition-colors hover:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your lease...
          </span>
        ) : (
          "Analyze My Lease"
        )}
      </button>
    </div>
  );
}
