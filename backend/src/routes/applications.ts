import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateApplicationSchema, UpdateApplicationStatusSchema } from '../schemas';
import { calculateMatchScore } from '../services/matchScore';
import { sendApplicationReceivedToCandidate, sendNewApplicationToEmployer, sendStatusUpdateToCandidate } from '../services/email';

const router = Router();

async function getProfile(userId: string) {
  const { data } = await supabase.from('candidate_profiles').select('full_name, current_title, skills, bio, resume_url, location, linkedin_url, portfolio_url, experience_level').eq('user_id', userId).single();
  return data || null;
}

// POST /applications
router.post('/', requireAuth, requireRole('candidate'), validate(CreateApplicationSchema), async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const { job_id, cover_letter, resume_url } = req.body;

  const { data: job, error: jobError } = await supabase.from('jobs').select('*, companies(id, name, owner_id)').eq('id', job_id).eq('status', 'published').single();
  if (jobError || !job) { res.status(404).json({ success: false, error: 'Job not found or not accepting applications' }); return; }

  const { data: candidateProfile } = await supabase.from('candidate_profiles').select('full_name, skills').eq('user_id', userId).single();
  const matchResult = calculateMatchScore(job.skills || [], candidateProfile?.skills || []);

  const { data: application, error: appError } = await supabase.from('applications').insert({ job_id, candidate_id: userId, cover_letter: cover_letter || null, match_score: matchResult.score, status: 'applied' }).select().single();
  if (appError) {
    if (appError.code === '23505') { res.status(400).json({ success: false, error: 'You have already applied to this job' }); return; }
    res.status(500).json({ success: false, error: appError.message }); return;
  }

  if (resume_url) await supabase.from('candidate_profiles').upsert({ user_id: userId, resume_url }, { onConflict: 'user_id' });

  const company = job.companies as { name: string; owner_id: string };
  const [candidateUser, employerUser] = await Promise.all([
    supabase.from('users').select('email').eq('id', userId).single(),
    supabase.from('users').select('email').eq('id', company.owner_id).single(),
  ]);

  const candidateName = candidateProfile?.full_name || candidateUser.data?.email || 'A candidate';
  Promise.all([
    sendApplicationReceivedToCandidate({ candidateName, candidateEmail: candidateUser.data?.email || '', jobTitle: job.title, companyName: company.name, employerEmail: employerUser.data?.email || '' }),
    sendNewApplicationToEmployer({ candidateName, candidateEmail: candidateUser.data?.email || '', jobTitle: job.title, companyName: company.name, employerEmail: employerUser.data?.email || '' }),
  ]).catch((err) => console.error('[Email error]', err));

  res.status(201).json({ success: true, data: { ...application, match: matchResult } });
});

// GET /applications/my/list
router.get('/my/list', requireAuth, requireRole('candidate'), async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('applications').select('*, jobs(id, title, location, type, companies(name, logo_url))').eq('candidate_id', req.auth!.userId).order('created_at', { ascending: false });
  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

// GET /applications/employer/all
router.get('/employer/all', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', req.auth!.userId).single();
  if (!company) { res.json({ success: true, data: [] }); return; }

  const { data: jobs } = await supabase.from('jobs').select('id').eq('company_id', company.id);
  const jobIds = (jobs || []).map((j) => j.id);
  if (!jobIds.length) { res.json({ success: true, data: [] }); return; }

  const { data: apps, error } = await supabase.from('applications').select('*, jobs(title)').in('job_id', jobIds).order('created_at', { ascending: false });
  if (error) { res.status(500).json({ success: false, error: error.message }); return; }

  const appsWithProfiles = await Promise.all((apps || []).map(async (app) => ({ ...app, candidate_profiles: await getProfile(app.candidate_id) })));
  res.json({ success: true, data: appsWithProfiles });
});

// GET /applications/job/:jobId
router.get('/job/:jobId', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data: apps, error } = await supabase.from('applications').select('*').eq('job_id', req.params.jobId).order('match_score', { ascending: false });
  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  const appsWithProfiles = await Promise.all((apps || []).map(async (app) => ({ ...app, candidate_profiles: await getProfile(app.candidate_id) })));
  res.json({ success: true, data: appsWithProfiles });
});

// GET /applications/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { data: app, error } = await supabase.from('applications').select('*, jobs(title, company_id, skills)').eq('id', req.params.id).single();
  if (error || !app) { res.status(404).json({ success: false, error: 'Application not found' }); return; }
  res.json({ success: true, data: { ...app, candidate_profiles: await getProfile(app.candidate_id) } });
});

// PATCH /applications/:id/status
router.patch('/:id/status', requireAuth, requireRole('employer'), validate(UpdateApplicationStatusSchema), async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('applications').update({ status: req.body.status }).eq('id', req.params.id).select('*, jobs(title)').single();
  if (error || !data) { res.status(500).json({ success: false, error: 'Update failed' }); return; }

  const [candidateUser, candidateProfile] = await Promise.all([
    supabase.from('users').select('email').eq('id', data.candidate_id).single(),
    supabase.from('candidate_profiles').select('full_name').eq('user_id', data.candidate_id).single(),
  ]);

  if (candidateUser.data?.email) {
    sendStatusUpdateToCandidate({ candidateName: candidateProfile.data?.full_name || candidateUser.data.email, candidateEmail: candidateUser.data.email, jobTitle: (data.jobs as any)?.title || 'the position', newStatus: req.body.status }).catch(console.error);
  }

  res.json({ success: true, data });
});

export default router;
