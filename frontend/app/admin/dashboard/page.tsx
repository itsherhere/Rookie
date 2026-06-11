'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Users, Building2, Briefcase, FileText, ArrowRight } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
}

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<Stats>('/admin/stats', token!);
        setStats(res.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  }

  const cards = [
    { label: 'Total users', value: stats?.totalUsers || 0, icon: Users, href: '/admin/users' },
    { label: 'Companies', value: stats?.totalCompanies || 0, icon: Building2, href: '/admin/companies' },
    { label: 'Jobs posted', value: stats?.totalJobs || 0, icon: Briefcase, href: '/admin/companies' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: FileText, href: '/admin/users' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#0F0F1A]">Admin</h1>
        <p className="text-sm text-[#6B6888] mt-0.5">Platform overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-[#E8E6F8] rounded-xl p-6 hover:border-[#5046E4]/40 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-semibold text-[#5046E4] mb-1">{card.value.toLocaleString()}</p>
                <p className="text-sm text-[#6B6888]">{card.label}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#EEF0FF] rounded-lg flex items-center justify-center">
                  <card.icon size={18} className="text-[#5046E4]" />
                </div>
                <ArrowRight size={16} className="text-[#6B6888] group-hover:text-[#5046E4] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/companies" className="flex items-center justify-between bg-white border border-[#E8E6F8] rounded-xl p-5 hover:border-[#5046E4]/40 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EEF0FF] rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-[#5046E4]" />
            </div>
            <span className="text-sm font-medium text-[#0F0F1A]">All companies</span>
          </div>
          <ArrowRight size={16} className="text-[#6B6888] group-hover:text-[#5046E4] transition-colors" />
        </Link>
        <Link href="/admin/users" className="flex items-center justify-between bg-white border border-[#E8E6F8] rounded-xl p-5 hover:border-[#5046E4]/40 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EEF0FF] rounded-lg flex items-center justify-center">
              <Users size={16} className="text-[#5046E4]" />
            </div>
            <span className="text-sm font-medium text-[#0F0F1A]">All users</span>
          </div>
          <ArrowRight size={16} className="text-[#6B6888] group-hover:text-[#5046E4] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
