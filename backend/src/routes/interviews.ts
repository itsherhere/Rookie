import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { validate } from '../lib/validate';
import { CreateInterviewSchema, RespondInterviewSchema } from '../schemas';
import { sendInterviewInviteToCandidate } from '../services/email';

const router = Router();

// POST /interviews
router.post('/', requireAuth, requireRole('employer'), validate(CreateInterviewSchema), async (req: Request, res: Response) => {
  const { application_id, candidate_id, title, date, time, type, meeting_link } = req.body;

  const { data, error } = await supabase
    .from('interviews')
    .insert({ application_id, employer_id: req.auth!.userId, candidate_id, title, date, time, type, meeting_link: meeting_link || null, status: 'pending' })
    .select()
    .single();

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }

  await supabase.from('applications').update({ status: 'interview' }).eq('id', application_id);

  const [candidateUser, candidateProfile] = await Promise.all([
    supabase.from('users').select('email').eq('id', candidate_id).single(),
    supabase.from('candidate_profiles').select('full_name').eq('user_id', candidate_id).single(),
  ]);

  if (candidateUser.data?.email) {
    sendInterviewInviteToCandidate({
      candidateName: candidateProfile.data?.full_name || candidateUser.data.email,
      candidateEmail: candidateUser.data.email,
      jobTitle: title,
      interviewDate: date,
      interviewTime: time,
      interviewType: type,
      meetingLink: meeting_link,
    }).catch((err) => console.error('[Email error]', err));
  }

  res.status(201).json({ success: true, data });
});

// GET /interviews/employer
router.get('/employer', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, applications(id, jobs(title))')
    .eq('employer_id', req.auth!.userId)
    .order('date', { ascending: true });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }

  const withProfiles = await Promise.all(
    (data || []).map(async (i) => {
      const { data: profile } = await supabase.from('candidate_profiles').select('full_name').eq('user_id', i.candidate_id).single();
      return { ...i, candidate_name: profile?.full_name || 'Unknown' };
    })
  );

  res.json({ success: true, data: withProfiles });
});

// GET /interviews/employer/applications
router.get('/employer/applications', requireAuth, requireRole('employer'), async (req: Request, res: Response) => {
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', req.auth!.userId).single();
  if (!company) { res.json({ success: true, data: [] }); return; }

  const { data: jobs } = await supabase.from('jobs').select('id').eq('company_id', company.id);
  const jobIds = (jobs || []).map((j) => j.id);
  if (!jobIds.length) { res.json({ success: true, data: [] }); return; }

  const { data: apps } = await supabase
    .from('applications')
    .select('id, candidate_id, status, jobs(title)')
    .in('job_id', jobIds)
    .in('status', ['applied', 'reviewed', 'shortlisted', 'interview']);

  const withNames = await Promise.all(
    (apps || []).map(async (app) => {
      const { data: profile } = await supabase.from('candidate_profiles').select('full_name').eq('user_id', app.candidate_id).single();
      return { ...app, candidate_name: profile?.full_name || 'Unknown' };
    })
  );

  res.json({ success: true, data: withNames });
});

// GET /interviews/candidate
router.get('/candidate', requireAuth, requireRole('candidate'), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, applications(id, jobs(title, companies(name)))')
    .eq('candidate_id', req.auth!.userId)
    .order('date', { ascending: true });

  if (error) { res.status(500).json({ success: false, error: error.message }); return; }
  res.json({ success: true, data });
});

// PATCH /interviews/:id/respond
router.patch('/:id/respond', requireAuth, requireRole('candidate'), validate(RespondInterviewSchema), async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('interviews')
    .update({ status: req.body.status })
    .eq('id', req.params.id)
    .eq('candidate_id', req.auth!.userId)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ success: false, error: 'Interview not found' }); return; }
  res.json({ success: true, data });
});

export default router;
