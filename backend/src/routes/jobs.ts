import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateJobSchema, UpdateJobSchema, UpdateJobStatusSchema } from '../schemas';

const router = Router();

// GET /jobs/employer — employer's own jobs (must be before /:id)
router.get('/employer', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', userId).single();
  if (!company) { res.json({ success: true, data: [] }); return; }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

// GET /jobs/public — public job listings
router.get('/public', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, companies(name, logo_url, location)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

// GET /jobs/:id — single job (public)
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, companies(id, name, logo_url, location, website, description)')
    .eq('id', req.params.id)
    .single();

  if (error || !data) { res.status(404).json({ success: false, error: 'Job not found' }); return; }
  res.json({ success: true, data });
});

// POST /jobs
router.post('/', requireAuth, requireRole('employer'), validate(CreateJobSchema), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', userId).single();
  if (!company) {
    res.status(400).json({ success: false, error: 'Create a company profile first' });
    return;
  }

  const { title, description, location, type, salary_min, salary_max, skills, status } = req.body;

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      company_id: company.id,
      title,
      description: description || null,
      location: location || null,
      type: type || null,
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      skills: skills || [],
      status: status || 'draft',
    })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.status(201).json({ success: true, data });
});

// PUT /jobs/:id
router.put('/:id', requireAuth, requireRole('employer'), validate(UpdateJobSchema), async (req: Request, res: Response) => {
  const { title, description, location, type, salary_min, salary_max, skills, status } = req.body;

  const { data, error } = await supabase
    .from('jobs')
    .update({ title, description, location, type, salary_min, salary_max, skills, status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ success: false, error: 'Job not found' }); return; }
  res.json({ success: true, data });
});

// PATCH /jobs/:id/status
router.patch('/:id/status', requireAuth, requireRole('employer'), validate(UpdateJobStatusSchema), async (req: Request, res: Response) => {
  const { status } = req.body;

  const { data, error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ success: false, error: 'Job not found' }); return; }
  res.json({ success: true, data });
});

export default router;
