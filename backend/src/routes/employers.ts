import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { UpdateCompanySchema } from '../schemas';

const router = Router();

// GET /employers/stats
router.get('/stats', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('owner_id', userId)
    .single();

  if (!company) {
    res.json({ success: true, data: { company: null, totalJobs: 0, publishedJobs: 0, totalApplications: 0, totalInterviews: 0, totalEmployees: 0, pendingLeave: 0, pendingPayroll: 0 } });
    return;
  }

  const [jobsRes, publishedRes] = await Promise.all([
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'published'),
  ]);

  const { data: jobs } = await supabase.from('jobs').select('id').eq('company_id', company.id);
  const jobIds = (jobs || []).map((j) => j.id);

  let totalApplications = 0;
  if (jobIds.length > 0) {
    const appRes = await supabase.from('applications').select('id', { count: 'exact', head: true }).in('job_id', jobIds);
    totalApplications = appRes.count || 0;
  }

  const { count: totalEmployees } = await supabase
    .from('employees')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .eq('status', 'active');

  const { data: empRows } = await supabase.from('employees').select('id').eq('company_id', company.id);
  const empIds = (empRows || []).map((e) => e.id);

  let pendingLeave = 0;
  let pendingPayroll = 0;
  if (empIds.length > 0) {
    const [leaveRes, payrollRes] = await Promise.all([
      supabase.from('leave_requests').select('id', { count: 'exact', head: true }).in('employee_id', empIds).eq('status', 'pending'),
      supabase.from('payroll').select('id', { count: 'exact', head: true }).in('employee_id', empIds).eq('status', 'pending'),
    ]);
    pendingLeave = leaveRes.count || 0;
    pendingPayroll = payrollRes.count || 0;
  }

  const { count: totalInterviews } = await supabase
    .from('interviews')
    .select('id', { count: 'exact', head: true })
    .eq('employer_id', userId)
    .in('status', ['pending', 'accepted']);

  res.json({
    success: true,
    data: {
      company,
      totalJobs: jobsRes.count || 0,
      publishedJobs: publishedRes.count || 0,
      totalApplications,
      totalInterviews: totalInterviews || 0,
      totalEmployees: totalEmployees || 0,
      pendingLeave,
      pendingPayroll,
    },
  });
});

// GET /employers/company
router.get('/company', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.json({ success: true, data: data || null });
});

// PUT /employers/company — location removed (not in DB schema)
router.put('/company', requireAuth, requireRole('employer'), validate(UpdateCompanySchema), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  const { name, industry, size, website, description, logo_url } = req.body;

  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', userId)
    .single();

  const companyData = {
    name,
    industry: industry || null,
    size: size || null,
    website: website || null,
    description: description || null,
    logo_url: logo_url || null,
  };

  let result;
  if (existing) {
    result = await supabase.from('companies').update(companyData).eq('id', existing.id).select().single();
  } else {
    result = await supabase.from('companies').insert({ ...companyData, owner_id: userId }).select().single();
  }

  if (result.error) {
    res.status(500).json({ success: false, error: result.error.message });
    return;
  }

  res.json({ success: true, data: result.data });
});

export default router;
