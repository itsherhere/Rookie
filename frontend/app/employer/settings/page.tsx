'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Bell, Lock, Building2, Users, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team',          label: 'Team Access',   icon: Users },
  { id: 'security',      label: 'Security',      icon: Lock },
];

export default function EmployerSettingsPage() {
  const { user } = useUser();
  const [tab, setTab] = useState('notifications');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    newApplication: true,
    interviewReminder: true,
    leaveRequest: true,
    payrollDue: false,
    weeklyReport: true,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">Settings</h1>
        <p className="text-sm text-brand-muted mt-0.5">Manage your workspace preferences.</p>
      </div>

      {/* Account summary */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">
          {(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'E').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-text">{user?.fullName || 'Your Name'}</p>
          <p className="text-sm text-brand-muted truncate">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <a href="https://accounts.clerk.dev/user" target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">Edit account</Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-brand-border">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                  tab === t.id
                    ? 'text-accent border-accent'
                    : 'text-brand-muted border-transparent hover:text-brand-text'
                )}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {tab === 'notifications' && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-text mb-4">Email notifications</p>
              {[
                { key: 'newApplication' as const,    label: 'New application received',  desc: 'When a candidate applies to one of your jobs' },
                { key: 'interviewReminder' as const, label: 'Interview reminders',        desc: '24 hours before a scheduled interview' },
                { key: 'leaveRequest' as const,      label: 'Leave requests',             desc: 'When an employee submits a leave request' },
                { key: 'payrollDue' as const,        label: 'Payroll due reminders',      desc: 'When monthly payroll needs to be processed' },
                { key: 'weeklyReport' as const,      label: 'Weekly hiring report',       desc: 'Summary of applications and pipeline activity' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-brand-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{item.label}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className="relative flex-shrink-0 transition-colors rounded-full"
                    style={{ width: 40, height: 22, background: notifs[item.key] ? '#5046E4' : '#E8E6F8' }}
                  >
                    <span
                      className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                      style={{ transform: notifs[item.key] ? 'translateX(21px)' : 'translateX(3px)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-brand-text">Team members</p>
                  <p className="text-xs text-brand-muted mt-0.5">Invite colleagues to manage hiring and HR</p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  <Users size={14} className="mr-1.5" /> Invite member
                </Button>
              </div>
              <div className="border border-brand-border rounded-xl p-5 text-center">
                <Users size={24} className="mx-auto mb-2 text-brand-muted/40" />
                <p className="text-sm font-medium text-brand-text mb-0.5">Team access coming soon</p>
                <p className="text-xs text-brand-muted">You'll be able to invite team members to collaborate on hiring.</p>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4">
              <div className="py-3 border-b border-brand-border">
                <p className="text-sm font-medium text-brand-text">Password & authentication</p>
                <p className="text-xs text-brand-muted mt-0.5 mb-3">Managed by Clerk — click below to update</p>
                <a href="https://accounts.clerk.dev/user/security" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <Lock size={14} className="mr-1.5" /> Manage security
                  </Button>
                </a>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-red-500 flex items-center gap-2">
                  <Trash2 size={14} /> Delete account
                </p>
                <p className="text-xs text-brand-muted mt-0.5 mb-3">
                  Permanently delete your account, company, and all associated data.
                </p>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                  Delete account
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t border-brand-border">
            <Button onClick={handleSave} size="sm">
              {saved ? '✓ Saved' : <><Save size={14} className="mr-1.5" />Save changes</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}