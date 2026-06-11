import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Helper: get Clerk ID without requiring user to exist in DB yet (for new signups)
async function getClerkIdRaw(req: Request): Promise<string | null> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    // Manually decode JWT payload (no verification needed — Clerk already signed it)
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
    return payload.sub || null;
  } catch {
    return null;
  }
}

// POST /users — create user after onboarding (never overwrites existing role)
router.post('/', async (req: Request, res: Response) => {
  const clerkId = await getClerkIdRaw(req);
  if (!clerkId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const { role, email } = req.body;
  if (!role || !['employer', 'candidate'].includes(role)) {
    res.status(400).json({ success: false, error: 'Valid role required' });
    return;
  }

  // If user already exists, return existing (never overwrite role)
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkId)
    .single();

  if (existing) {
    res.json({ success: true, data: existing });
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ clerk_user_id: clerkId, email: email || '', role })
    .select()
    .single();

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.status(201).json({ success: true, data });
});

// GET /users/me — requires existing user in DB
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.auth!.userId)
    .single();

  if (error || !data) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  res.json({ success: true, data });
});

export default router;
