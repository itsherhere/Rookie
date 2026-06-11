import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateMessageSchema } from '../schemas';

const router = Router();

// GET /messages/threads
router.get('/threads', requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const { data, error } = await supabase
    .from('messages')
    .select('*, applications(id, jobs(title, companies(name)))')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }

  const threadsMap: Record<string, unknown> = {};
  for (const msg of data || []) {
    if (!threadsMap[msg.application_id]) {
      threadsMap[msg.application_id] = {
        application_id: msg.application_id,
        application: msg.applications,
        last_message: msg.body,
        last_message_at: msg.created_at,
      };
    }
  }

  res.json({ success: true, data: Object.values(threadsMap) });
});

// GET /messages/thread/:applicationId
router.get('/thread/:applicationId', requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('application_id', req.params.applicationId)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

// POST /messages
router.post('/', requireAuth, validate(CreateMessageSchema), async (req: Request, res: Response) => {
  const { application_id, receiver_id, body } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .insert({ application_id, sender_id: req.auth!.userId, receiver_id, body })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.status(201).json({ success: true, data });
});

export default router;
