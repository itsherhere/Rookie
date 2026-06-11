'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Bell, Lock, Palette, Globe, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy',       label: 'Privacy',       icon: Lock },
  { id: 'preferences',   label: 'Preferences',   icon: Palette },
];

export default function CandidateSettingsPage() {
  const { user } = useUser();
  const [tab, setTab] = useState('notifications');
  const [emailNotifs, setEmailNotifs] = useState({
    applications: true,
    interviews: true,
    messages: true,
    jobMatches: false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">Settings</h1>
        <p className="text-sm text-brand-muted mt-0.5">Manage your account preferences and notifications.</p>
      </div>

      {/* Profile summary */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">
          {(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}
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
            <div className="space-y-4">
              <p className="text-sm font-medium text-brand-text mb-4">Email notifications</p>
              {[
                { key: 'applications' as const, label: 'Application status updates',    desc: 'When your application status changes' },
                { key: 'interviews' as const,   label: 'Interview invitations',         desc: 'When an employer schedules an interview' },
                { key: 'messages' as const,     label: 'New messages',                  desc: 'When you receive a message from an employer' },
                { key: 'jobMatches' as const,   label: 'New job matches',               desc: 'Weekly digest of jobs matching your profile' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{item.label}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className={cn(
                      'w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0',
                      emailNotifs[item.key] ? 'bg-accent' : 'bg-brand-border'
                    )}
                    style={{ height: '22px' }}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                      emailNotifs[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-4">
              <div className="py-3 border-b border-brand-border">
                <p className="text-sm font-medium text-brand-text">Profile visibility</p>
                <p className="text-xs text-brand-muted mt-0.5 mb-3">Control who can see your profile</p>
                <div className="flex gap-3">
                  {['Public', 'Recruiters only', 'Private'].map(opt => (
                    <button key={opt} className="px-4 py-2 rounded-lg text-sm border border-brand-border hover:border-accent hover:text-accent transition-colors text-brand-muted">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-brand-text">Open to work</p>
                <p className="text-xs text-brand-muted mt-0.5">Show recruiters you're actively looking</p>
              </div>
            </div>
          )}

          {tab === 'preferences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-brand-border">
                <div>
                  <p className="text-sm font-medium text-brand-text flex items-center gap-2"><Globe size={14} />Language</p>
                  <p className="text-xs text-brand-muted mt-0.5">Interface language</p>
                </div>
                <select className="text-sm border border-brand-border rounded-lg px-3 py-1.5 bg-brand-bg text-brand-text focus:outline-none focus:border-accent">
                  <option>English</option>
                  <option>فارسی</option>
                </select>
              </div>
              <div className="py-3 border-b border-brand-border">
                <p className="text-sm font-medium text-danger-text flex items-center gap-2"><Trash2 size={14} />Delete account</p>
                <p className="text-xs text-brand-muted mt-0.5 mb-3">Permanently delete your account and all data</p>
                <Button variant="outline" size="sm" className="text-danger-text border-danger-text hover:bg-danger-light">
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