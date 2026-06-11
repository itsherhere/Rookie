'use client';

import { UserButton } from '@clerk/nextjs';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-14 border-b border-brand-border bg-brand-surface flex items-center justify-between px-6">
      {title && (
        <p className="text-sm font-medium text-brand-muted">{title}</p>
      )}
      <div className="ml-auto">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
