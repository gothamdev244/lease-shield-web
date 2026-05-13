"use client";

import { Shield } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-normal tracking-tight text-ink sm:text-5xl" style={{ letterSpacing: "-1.3px" }}>
          Know your rights
          <br />
          before you sign.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-body leading-relaxed">
          Upload your rental agreement and get clause-by-clause legal analysis
          powered by Indian rental law.
        </p>
      </div>
      <FileUpload />
    </main>
  );
}
