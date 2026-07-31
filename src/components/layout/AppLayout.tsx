import * as React from 'react';
import Link from 'next/link';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:flex flex-col gap-4">
        <div className="font-bold text-xl text-primary mb-8">PhishShield AI</div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="text-neutral hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5">Dashboard</Link>
          <Link href="/scanner" className="text-neutral hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5">Security Scanner</Link>
          <Link href="/history" className="text-neutral hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5">Threat History</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-background flex items-center px-8 justify-between">
          <div className="md:hidden font-bold text-primary">PhishShield AI</div>
          <div className="flex-1" />
          <div className="text-sm text-neutral">Demo Mode Available</div>
        </header>
        
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
