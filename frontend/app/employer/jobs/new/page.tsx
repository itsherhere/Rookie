'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SkillTag } from '@/components/shared/SkillTag';
import { X } from 'lucide-react';
import { ROUTES, JOB_TYPES, EXPERIENCE_LEVELS } from '@/constants';
import { parseSkills } from '@/lib/utils';
import type { Job } from '@/types';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm transition-colors';

export default function NewJobPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    skills: [] as string[],
    status: 'draft' as Job['status'],
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addSkill = () => {
    const newSkills = parseSkills(skillInput).filter((s) => !form.skills.includes(s));
    if (newSkills.length) {
      setForm((f) => ({ ...f, skills: [...f.skills, ...newSkills] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const handleSubmit = async (status: Job['status']) => {
    if (!form.title.trim()) {
      setError('Job title is required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const token = await getToken();
      await api.post('/jobs', { ...form, status }, token!);
      router.push(ROUTES.EMPLOYER.JOBS);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create job';
      setError(message);
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader title="Post a new job" description="Fill in the details to attract the right candidates." />

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
            Job title <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.title} onChange={set('title')} placeholder="Frontend Developer" className={inputClass} />
        </div>

        {/* Department + Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Department</label>
            <input type="text" value={form.department} onChange={set('department')} placeholder="Engineering" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={set('location')} placeholder="Remote / Tbilisi" className={inputClass} />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Job type</label>
          <select value={form.type} onChange={set('type')} className={inputClass}>
            <option value="">Select type</option>
            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Salary min (USD/yr)</label>
            <input type="number" value={form.salary_min} onChange={set('salary_min')} placeholder="60000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Salary max (USD/yr)</label>
            <input type="number" value={form.salary_max} onChange={set('salary_max')} placeholder="90000" className={inputClass} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Job description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Describe the role, responsibilities, and what success looks like..."
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Requirements</label>
          <textarea
            value={form.requirements}
            onChange={set('requirements')}
            placeholder="List the skills, experience, and qualifications needed..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Required skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="React, TypeScript, Node.js (comma separated)"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 bg-[#EEF0FF] hover:bg-[#5046E4] text-[#5046E4] hover:text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-1">
                  <SkillTag skill={skill} />
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-[#6B6888] hover:text-red-500 transition-colors ml-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving && <LoadingSpinner size="sm" />}
            Publish job
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-5 py-2.5 border border-[#E8E6F8] text-[#6B6888] hover:text-[#0F0F1A] rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
}
