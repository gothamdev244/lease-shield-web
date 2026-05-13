"use client";

import { Nav } from "./Nav";
import { LeaseProvider } from "./LeaseProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LeaseProvider>
      <Nav />
      {children}
    </LeaseProvider>
  );
}
