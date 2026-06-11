'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Briefcase, Users, Building2, Plus, ArrowRight,
  Calendar, MessageSquare, UserCheck, Clock, Umbrella, DollarSign,
} from 'lucide-react';
import { ROUTES } from '@/constants';

interface Stats {
  company: { id: string; name: string } | null;
  totalJobs: number;
  publishedJobs: number;
  totalApplications: number;
}

const quickLinks = [
  { label: 'Jobs', desc: 'Post and manage listings', href: ROUTES.EMPLOYER.JOBS, icon: Briefcase },
  { label: 'Applications', desc: 'Review candidates', href: ROUTES.EMPLOYER.APPLICATIONS, icon: Users },
  { label: 'Interviews', desc: 'Schedule & track', href: ROUTES.EMPLOYER.INTERVIEWS, icon: Calendar },
  { label: 'Messages', desc: 'Chat with candidates', href: ROUTES.EMPLOYER.MESSAGES, icon: MessageSquare },
  { label: 'Employees', desc: 'Manage your team', href: ROUTES.EMPLOYER.EMPLOYEES, icon: UserCheck },
  { label: 'Attendance', desc: 'Track hours', href: ROUTES.EMPLOYER.ATTENDANCE, icon: Clock },
  { label: 'Leave', desc: 'Approve requests', href: ROUTES.EMPLOYER.LEAVE, icon: Umbrella },
  { label: 'Payroll', desc: 'Preview salaries', href: ROUTES.EMPLOYER.PAYROLL, icon: DollarSign },
  { label: 'Company', desc: 'Edit profile', href: ROUTES.EMPLOYER.COMPANY, icon: Building2 },
];

export default function EmployerDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<Stats>('/employers/stats', token!);
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats?.company) {
    return (
      <div className="p-8">
        <div className="max-w-md bg-white border border-[#E8E6F8] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#EEF0FF] rounded-2xl mx-auto mb-5 flex items-center justify-center">
            <Building2 size={24} className="text-[#5046E4]" />
          </div>
          <h2 className="text-lg font-semibold text-[#0F0F1A] mb-2">Set up your company profile</h2>
          <p className="text-sm text-[#6B6888] mb-6 leading-relaxed">
            Before posting jobs, you need to create your company profile.
          </p>
          <Link
            href={ROUTES.EMPLOYER.COMPANY}
            className="inline-flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Create company profile <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#0F0F1A]">Overview</h1>
          <p className="text-sm text-[#6B6888] mt-0.5">{stats.company.name}</p>
        </div>
        <Link
          href={ROUTES.EMPLOYER.JOBS_NEW}
          className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Post a job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
          <p className="text-2xl font-semibold text-[#5046E4] mb-1">{stats.totalJobs}</p>
          <p className="text-xs text-[#6B6888]">Total jobs</p>
        </div>
        <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
          <p className="text-2xl font-semibold text-[#5046E4] mb-1">{stats.publishedJobs}</p>
          <p className="text-xs text-[#6B6888]">Published</p>
        </div>
        <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
          <p className="text-2xl font-semibold text-[#22D3EE] mb-1">{stats.totalApplications}</p>
          <p className="text-xs text-[#6B6888]">Applications</p>
        </div>
      </div>

      {/* All feature quick links */}
      <h2 className="text-sm font-semibold text-[#0F0F1A] mb-4">Quick access</h2>
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between bg-white border border-[#E8E6F8] rounded-xl p-4 hover:border-[#5046E4]/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#EEF0FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <link.icon size={15} className="text-[#5046E4]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F0F1A]">{link.label}</p>
                <p className="text-xs text-[#6B6888]">{link.desc}</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-[#6B6888] group-hover:text-[#5046E4] transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
