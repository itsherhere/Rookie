import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateAttendanceSchema, UpdateAttendanceSchema } from '../schemas';

const router = Router();

router.get('/', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { employee_id } = req.query;
  let query = supabase.from('attendance').select('*, employees(full_name, role)').order('date', { ascending: false });
  if (employee_id) query = query.eq('employee_id', employee_id as string);

  const { data, error } = await query;
  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

router.post('/', requireAuth, requireRole('employer'), validate(CreateAttendanceSchema), async (req: Request, res: Response) => {
  const { employee_id, date, clock_in, clock_out, status } = req.body;

  const { data, error } = await supabase
    .from('attendance')
    .upsert({ employee_id, date, clock_in: clock_in || null, clock_out: clock_out || null, status }, { onConflict: 'employee_id,date' })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.status(201).json({ success: true, data });
});

router.put('/:id', requireAuth, requireRole('employer'), validate(UpdateAttendanceSchema), async (req: Request, res: Response) => {
  const { clock_in, clock_out, status } = req.body;

  const { data, error } = await supabase
    .from('attendance')
    .update({ clock_in: clock_in || null, clock_out: clock_out || null, status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

export default router;
