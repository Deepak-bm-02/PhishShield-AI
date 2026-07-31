import * as React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { CommandPalette } from "./CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <Sidebar className="hidden md:flex fixed inset-y-0 z-40" />
      
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
