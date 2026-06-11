import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

async function getCompanyId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', userId)
    .single();
  return data?.id || null;
}

// GET /payroll — employer payroll summary
router.get('/', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const companyId = await getCompanyId(req.auth!.userId);
  if (!companyId) {
    res.json({ success: true, data: { employees: [], totals: { total_monthly: 0, total_annual: 0, headcount: 0 } } });
    return;
  }

  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .order('full_name');

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  const payroll = (employees || []).map((emp) => {
    const gross = emp.salary || 0;
    const tax = Math.round(gross * 0.15);
    const net = gross - tax;
    return {
      id: emp.id,
      full_name: emp.full_name,
      role: emp.role,
      department: emp.department,
      employment_type: emp.employment_type,
      monthly_gross: gross,
      monthly_tax: tax,
      monthly_net: net,
      annual_gross: gross * 12,
    };
  });

  const totals = {
    total_monthly_gross: payroll.reduce((s, e) => s + e.monthly_gross, 0),
    total_monthly_net: payroll.reduce((s, e) => s + e.monthly_net, 0),
    total_annual: payroll.reduce((s, e) => s + e.annual_gross, 0),
    headcount: payroll.length,
  };

  res.json({ success: true, data: { employees: payroll, totals } });
});

export default router;
