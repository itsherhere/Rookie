'use client';

import { Bell, Search } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export function DashboardHeader() {
  return (
    <header className="h-[60px] bg-brand-surface border-b border-brand-border flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
        <input
          placeholder="Search jobs, candidates, messages..."
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-brand-border bg-brand-bg text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
        />
      </div>

      <div className="flex items-center gap-2.5 ml-auto">
        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg border border-brand-border bg-brand-surface flex items-center justify-center hover:bg-brand-bg transition-colors">
          <Bell size={16} className="text-brand-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-white" />
        </button>

        {/* Clerk user button */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
