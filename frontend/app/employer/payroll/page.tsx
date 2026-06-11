'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { DollarSign } from 'lucide-react';

interface PayrollEmployee {
  id: string;
  full_name: string;
  role: string;
  department?: string;
  employment_type?: string;
  monthly_gross: number;
  monthly_tax: number;
  monthly_net: number;
  annual_gross: number;
}

interface PayrollData {
  employees: PayrollEmployee[];
  totals: {
    total_monthly_gross: number;
    total_monthly_net: number;
    total_annual: number;
    headcount: number;
  };
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US');
}

export default function PayrollPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<PayrollData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<PayrollData>('/payroll', token!);
        setData(res.data || null);
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

  const employees = data?.employees || [];
  const totals = data?.totals;

  return (
    <div className="p-8">
      <PageHeader
        title="Payroll"
        description={`${totals?.headcount || 0} active employees · ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}
      />

      {/* Summary cards */}
      {totals && totals.headcount > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
            <p className="text-xs text-[#6B6888] mb-1">Monthly gross</p>
            <p className="text-2xl font-semibold text-[#5046E4]">{fmt(totals.total_monthly_gross)}</p>
          </div>
          <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
            <p className="text-xs text-[#6B6888] mb-1">Monthly net (after ~15% tax)</p>
            <p className="text-2xl font-semibold text-[#5046E4]">{fmt(totals.total_monthly_net)}</p>
          </div>
          <div className="bg-white border border-[#E8E6F8] rounded-xl p-5">
            <p className="text-xs text-[#6B6888] mb-1">Annual payroll</p>
            <p className="text-2xl font-semibold text-[#22D3EE]">{fmt(totals.total_annual)}</p>
          </div>
        </div>
      )}

      {employees.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No payroll data"
          description="Add employees with salary information to generate payroll reports."
        />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8] bg-[#F7F7FF]">
                {['Employee', 'Role', 'Type', 'Gross', 'Tax (est.)', 'Net'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0F0F1A]">{emp.full_name}</p>
                    {emp.department && <p className="text-xs text-[#6B6888] mt-0.5">{emp.department}</p>}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{emp.role}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888] capitalize">{emp.employment_type || '—'}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#0F0F1A]">{fmt(emp.monthly_gross)}</td>
                  <td className="px-5 py-4 text-sm text-red-500">−{fmt(emp.monthly_tax)}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{fmt(emp.monthly_net)}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-[#F7F7FF] border-t-2 border-[#E8E6F8]">
                <td colSpan={3} className="px-5 py-4 text-sm font-semibold text-[#0F0F1A]">Total</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#0F0F1A]">{fmt(totals?.total_monthly_gross || 0)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-red-500">
                  −{fmt((totals?.total_monthly_gross || 0) - (totals?.total_monthly_net || 0))}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{fmt(totals?.total_monthly_net || 0)}</td>
              </tr>
            </tbody>
          </table>
          <div className="px-5 py-3 bg-[#F7F7FF] border-t border-[#E8E6F8]">
            <p className="text-xs text-[#6B6888]">* Tax estimates are approximate (15% flat rate). Consult your accountant for accurate figures.</p>
          </div>
        </div>
      )}
    </div>
  );
}
