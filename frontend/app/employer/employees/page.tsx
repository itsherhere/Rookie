'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { UserCheck, Plus, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Employee } from '@/types';

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm transition-colors';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

export default function EmployeesPage() {
  const { getToken } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '', email: '', role: '', department: '',
    employment_type: 'full-time', salary: '', start_date: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<Employee[]>('/employees', token!);
        setEmployees(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.role || !form.start_date) {
      setError('Full name, email, role and start date are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = await getToken();
      const res = await api.post<Employee>('/employees', form, token!);
      if (res.data) setEmployees((prev) => [...prev, res.data!]);
      setShowForm(false);
      setForm({ full_name: '', email: '', role: '', department: '', employment_type: 'full-time', salary: '', start_date: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-8">
      <PageHeader
        title="Employees"
        description={`${employees.length} team ${employees.length === 1 ? 'member' : 'members'}`}
        action={
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add employee
          </button>
        }
      />

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#0F0F1A]">Add employee</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6B6888] hover:text-[#0F0F1A]"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Full name *</label>
                <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Maya Chen" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="maya@company.com" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Role *</label>
                  <input type="text" value={form.role} onChange={set('role')} placeholder="Frontend Dev" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Department</label>
                  <input type="text" value={form.department} onChange={set('department')} placeholder="Engineering" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Type</label>
                  <select value={form.employment_type} onChange={set('employment_type')} className={inputClass}>
                    {EMPLOYMENT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Monthly salary</label>
                  <input type="number" value={form.salary} onChange={set('salary')} placeholder="3000" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Start date *</label>
                <input type="date" value={form.start_date} onChange={set('start_date')} className={inputClass} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={saving} className="w-full py-2.5 bg-[#5046E4] hover:bg-[#3D34C4] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <LoadingSpinner size="sm" />}
                {saving ? 'Adding...' : 'Add employee'}
              </button>
            </form>
          </div>
        </div>
      )}

      {employees.length === 0 ? (
        <EmptyState icon={UserCheck} title="No employees yet" description="Add your first team member to get started." />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                {['Name', 'Role', 'Department', 'Type', 'Start date', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0F0F1A]">{emp.full_name}</p>
                    <p className="text-xs text-[#6B6888]">{emp.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{emp.role}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{emp.department || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888] capitalize">{emp.employment_type || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{formatDate(emp.start_date)}</td>
                  <td className="px-5 py-4"><StatusBadge status={emp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
