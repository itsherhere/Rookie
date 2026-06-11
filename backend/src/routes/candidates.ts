import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { UpdateCandidateProfileSchema } from '../schemas';

const router = Router();

// GET /candidates/profile
router.get('/profile', requireAuth, requireRole('candidate'), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', req.auth!.userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.json({ success: true, data: data || null });
});

// PUT /candidates/profile
router.put('/profile', requireAuth, requireRole('candidate'), validate(UpdateCandidateProfileSchema), async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const { full_name, phone, location, current_title, experience_level, skills, bio, portfolio_url, linkedin_url } = req.body;

  const { data: existing } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  const profileData = {
    full_name,
    phone: phone || null,
    location: location || null,
    current_title: current_title || null,
    experience_level: experience_level || null,
    skills: skills || [],
    bio: bio || null,
    portfolio_url: portfolio_url || null,
    linkedin_url: linkedin_url || null,
  };

  const result = existing
    ? await supabase.from('candidate_profiles').update(profileData).eq('id', existing.id).select().single()
    : await supabase.from('candidate_profiles').insert({ user_id: userId, ...profileData }).select().single();

  if (result.error) {
    res.status(500).json({ success: false, error: result.error.message });
    return;
  }

  res.json({ success: true, data: result.data });
});

// GET /candidates/:id — employer views candidate
router.get('/:id', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', req.params.id)
    .single();

  if (error || !data) {
    res.status(404).json({ success: false, error: 'Candidate not found' });
    return;
  }

  res.json({ success: true, data });
});

export default router;
