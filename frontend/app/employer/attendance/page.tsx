'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Clock, Plus, X } from 'lucide-react';
import type { Employee } from '@/types';

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm transition-colors';

interface AttendanceRecord {
  id: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  status: string;
  employees: { full_name: string; role: string };
}

export default function AttendancePage() {
  const { getToken } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', date: new Date().toISOString().split('T')[0],
    clock_in: '', clock_out: '', status: 'present',
  });

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const [attRes, empRes] = await Promise.all([
          api.get<AttendanceRecord[]>('/attendance', token!),
          api.get<Employee[]>('/employees', token!),
        ]);
        setRecords(attRes.data || []);
        setEmployees(empRes.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const res = await api.post<AttendanceRecord>('/attendance', form, token!);
      if (res.data) setRecords((prev) => [res.data!, ...prev]);
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-8">
      <PageHeader title="Attendance" description={`${records.length} records`} action={
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add record
        </button>
      } />

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#0F0F1A]">Add attendance record</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6B6888] hover:text-[#0F0F1A]"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Employee</label>
                <select value={form.employee_id} onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))} className={inputClass}>
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Clock in</label>
                  <input type="time" value={form.clock_in} onChange={(e) => setForm((f) => ({ ...f, clock_in: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Clock out</label>
                  <input type="time" value={form.clock_out} onChange={(e) => setForm((f) => ({ ...f, clock_out: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inputClass}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <button type="submit" disabled={saving} className="w-full py-2.5 bg-[#5046E4] hover:bg-[#3D34C4] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <LoadingSpinner size="sm" />}
                {saving ? 'Saving...' : 'Save record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState icon={Clock} title="No attendance records" description="Add attendance records for your team members." />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                {['Employee', 'Date', 'Clock in', 'Clock out', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0F0F1A]">{r.employees?.full_name}</p>
                    <p className="text-xs text-[#6B6888]">{r.employees?.role}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{r.clock_in || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{r.clock_out || '—'}</td>
                  <td className="px-5 py-4"><StatusBadge status={r.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
