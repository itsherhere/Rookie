import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateLeaveSchema, RespondLeaveSchema } from '../schemas';

const router = Router();

router.get('/', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', req.auth!.userId).single();
  if (!company) { res.json({ success: true, data: [] }); return; }

  const { data: employees } = await supabase.from('employees').select('id').eq('company_id', company.id);
  const empIds = (employees || []).map((e) => e.id);
  if (!empIds.length) { res.json({ success: true, data: [] }); return; }

  const { data, error } = await supabase
    .from('leave_requests')
    .select('*, employees(full_name, role)')
    .in('employee_id', empIds)
    .order('created_at', { ascending: false });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

router.post('/', requireAuth, validate(CreateLeaveSchema), async (req: Request, res: Response) => {
  const { employee_id, type, start_date, end_date, reason } = req.body;

  const { data, error } = await supabase
    .from('leave_requests')
    .insert({ employee_id, type, start_date, end_date, reason: reason || null, status: 'pending' })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.status(201).json({ success: true, data });
});

router.patch('/:id/respond', requireAuth, requireRole('employer'), validate(RespondLeaveSchema), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('leave_requests')
    .update({ status: req.body.status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

export default router;
