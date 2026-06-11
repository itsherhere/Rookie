import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateEmployeeSchema, UpdateEmployeeSchema } from '../schemas';

const router = Router();

async function getCompanyId(userId: string) {
  const { data } = await supabase.from('companies').select('id').eq('owner_id', userId).single();
  return data?.id || null;
}

router.get('/', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const companyId = await getCompanyId(req.auth!.userId);
  if (!companyId) { res.json({ success: true, data: [] }); return; }

  const { data, error } = await supabase.from('employees').select('*').eq('company_id', companyId).order('full_name');
  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

router.get('/:id', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const companyId = await getCompanyId(req.auth!.userId);
  if (!companyId) { res.status(403).json({ success: false, error: 'Unauthorized' }); return; }

  const { data, error } = await supabase.from('employees').select('*').eq('id', req.params.id).eq('company_id', companyId).single();
  if (error || !data) { res.status(404).json({ success: false, error: 'Employee not found' }); return; }
  res.json({ success: true, data });
});

router.post('/', requireAuth, requireRole('employer'), validate(CreateEmployeeSchema), async (req: Request, res: Response) => {
  const companyId = await getCompanyId(req.auth!.userId);
  if (!companyId) { res.status(400).json({ success: false, error: 'Create a company profile first' }); return; }

  const { full_name, email, role, department, employment_type, salary, start_date } = req.body;

  const { data, error } = await supabase
    .from('employees')
    .insert({ company_id: companyId, full_name, email, role, department: department || null, employment_type: employment_type || null, salary: salary || 0, start_date, status: 'active' })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.status(201).json({ success: true, data });
});

router.put('/:id', requireAuth, requireRole('employer'), validate(UpdateEmployeeSchema), async (req: Request, res: Response) => {
  const companyId = await getCompanyId(req.auth!.userId);
  if (!companyId) { res.status(403).json({ success: false, error: 'Unauthorized' }); return; }

  const { full_name, email, role, department, employment_type, salary, start_date, status } = req.body;

  const { data, error } = await supabase
    .from('employees')
    .update({ full_name, email, role, department: department || null, employment_type: employment_type || null, salary: salary || 0, start_date, status })
    .eq('id', req.params.id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ success: false, error: 'Employee not found' }); return; }
  res.json({ success: true, data });
});

export default router;
