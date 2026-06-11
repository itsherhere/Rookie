'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Check } from 'lucide-react';
import type { Company } from '@/types';
import { COMPANY_SIZES, ROUTES } from '@/constants';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Media', 'Consulting', 'Real Estate', 'Other',
];

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm transition-colors';

export default function CompanyPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    description: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<Company>('/employers/company', token!);
        if (res.data) {
          setForm({
            name: res.data.name || '',
            website: res.data.website || '',
            industry: res.data.industry || '',
            size: res.data.size || '',
            description: res.data.description || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Company name is required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const token = await getToken();
      await api.put('/employers/company', form, token!);
      setSaved(true);
      setTimeout(() => router.push(ROUTES.EMPLOYER.DASHBOARD), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setError(message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Company profile"
        description="This information is shown on your job listings."
      />

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
            Company name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Nova Labs"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={set('website')}
            placeholder="https://novalabs.com"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Industry</label>
            <select value={form.industry} onChange={set('industry')} className={inputClass}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Company size</label>
            <select value={form.size} onChange={set('size')} className={inputClass}>
              <option value="">Select size</option>
              {COMPANY_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">About the company</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Tell candidates about your mission, culture, and what makes your company special..."
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          {saving && <LoadingSpinner size="sm" />}
          {saved && <Check size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved! Redirecting...' : 'Save company profile'}
        </button>
      </form>
    </div>
  );
}