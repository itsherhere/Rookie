import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /admin/stats — platform-wide stats
router.get('/stats', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  const [users, companies, jobs, applications] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers: users.count || 0,
      totalCompanies: companies.count || 0,
      totalJobs: jobs.count || 0,
      totalApplications: applications.count || 0,
    },
  });
});

// GET /admin/companies — all companies
router.get('/companies', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*, users!owner_id(email)')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.json({ success: true, data });
});

// GET /admin/users — all users
router.get('/users', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.json({ success: true, data });
});

export default router;
