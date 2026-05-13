"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Sun, Moon } from "lucide-react";

export function Nav() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-hairline bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-ink font-semibold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Lease Shield
        </Link>
        <button
          onClick={toggle}
          className="rounded-full p-2 text-muted hover:bg-surface-strong transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}
