'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Briefcase, Users, Calendar,
  MessageSquare, UserCheck, Clock, Umbrella,
  DollarSign, Building2, User, FileText,
  Settings, BarChart3, Bookmark, Star,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import type { NavSection } from '@/types';

const navConfig: Record<'employer' | 'candidate' | 'admin', NavSection[]> = {
  employer: [
    {
      label: 'HIRING',
      items: [
        { label: 'Overview',     href: ROUTES.EMPLOYER.DASHBOARD,    icon: LayoutDashboard },
        { label: 'Jobs',         href: ROUTES.EMPLOYER.JOBS,         icon: Briefcase },
        { label: 'Applications', href: ROUTES.EMPLOYER.APPLICATIONS, icon: Users },
        { label: 'Interviews',   href: ROUTES.EMPLOYER.INTERVIEWS,   icon: Calendar },
        { label: 'Messages',     href: ROUTES.EMPLOYER.MESSAGES,     icon: MessageSquare },
      ],
    },
    {
      label: 'TEAM',
      items: [
        { label: 'Employees',  href: ROUTES.EMPLOYER.EMPLOYEES,  icon: UserCheck },
        { label: 'Attendance', href: ROUTES.EMPLOYER.ATTENDANCE, icon: Clock },
        { label: 'Leave',      href: ROUTES.EMPLOYER.LEAVE,      icon: Umbrella },
        { label: 'Payroll',    href: ROUTES.EMPLOYER.PAYROLL,    icon: DollarSign },
      ],
    },
    {
      label: 'WORKSPACE',
      items: [
        { label: 'Company',  href: ROUTES.EMPLOYER.COMPANY, icon: Building2 },
        { label: 'Settings', href: '/employer/settings',    icon: Settings },
      ],
    },
  ],
  candidate: [
    {
      label: 'JOB SEARCH',
      items: [
        { label: 'Overview',     href: ROUTES.CANDIDATE.DASHBOARD,    icon: LayoutDashboard },
        { label: 'Job Matches',  href: '/candidate/jobs',             icon: Star },
        { label: 'Applications', href: ROUTES.CANDIDATE.APPLICATIONS, icon: FileText },
        { label: 'Interviews',   href: ROUTES.CANDIDATE.INTERVIEWS,   icon: Calendar },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { label: 'My Profile', href: ROUTES.CANDIDATE.PROFILE,   icon: User },
        { label: 'Messages',   href: ROUTES.CANDIDATE.MESSAGES,  icon: MessageSquare },
        { label: 'Settings',   href: ROUTES.CANDIDATE.SETTINGS,  icon: Settings },
      ],
    },
  ],
  admin: [
    {
      items: [
        { label: 'Overview',     href: ROUTES.ADMIN.DASHBOARD,    icon: LayoutDashboard },
        { label: 'Companies',    href: ROUTES.ADMIN.COMPANIES,    icon: Building2 },
        { label: 'Users',        href: ROUTES.ADMIN.USERS,        icon: Users },
        { label: 'Jobs',         href: ROUTES.ADMIN.JOBS,         icon: Briefcase },
        { label: 'Applications', href: ROUTES.ADMIN.APPLICATIONS, icon: FileText },
        { label: 'Reports',      href: '/admin/reports',          icon: BarChart3 },
      ],
    },
  ],
};

interface SidebarProps {
  role: 'employer' | 'candidate' | 'admin';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const sections = navConfig[role];

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar bg-sidebar flex flex-col z-30">

      {/* Logo */}
      <div className="px-5 py-[18px] border-b border-sidebar-border">
      <Link href={role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}>
          <div className="w-7 h-7 bg-accent rounded-[7px] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[13px] font-bold">R</span>
          </div>
          <span className="text-white text-[15px] font-semibold">Rookie</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest uppercase text-sidebar-icon select-none">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon as LucideIcon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-[7px] rounded-md text-[13px] transition-colors',
                      active
                        ? 'bg-sidebar-active text-white font-medium'
                        : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
                    )}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.75}
                      className={cn('flex-shrink-0', active ? 'text-accent' : 'text-sidebar-icon')}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-xs text-sidebar-text">Account</span>
      </div>
    </aside>
  );
}
