'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useRole } from '@/hooks/useRole';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/constants';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, isLoading } = useRole();

  useEffect(() => {
    if (!isLoading && role && role !== 'employer') {
      router.replace(role === 'candidate' ? ROUTES.CANDIDATE.DASHBOARD : ROUTES.SIGN_IN);
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (role && role !== 'employer') return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar role="employer" />
    <div className="ml-[220px] flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
