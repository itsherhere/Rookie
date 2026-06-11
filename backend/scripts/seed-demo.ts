/**
 * ROOKIE — Demo Seed Script
 * ─────────────────────────────────────────────────────────
 * Run: npx ts-node --transpile-only scripts/seed-demo.ts
 *
 * Required env vars in backend/.env.local:
 *   SUPABASE_URL=
 *   SUPABASE_SERVICE_ROLE_KEY=
 *   DEMO_EMPLOYER_CLERK_ID=      ← Clerk user ID of employer account
 *   DEMO_EMPLOYEE1_CLERK_ID=     ← Clerk user ID of Maya (candidate 1)
 *   DEMO_EMPLOYEE2_CLERK_ID=     ← Clerk user ID of Daniel (candidate 2)
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ─── Supabase client ──────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── Clerk IDs ────────────────────────────────────────────────────────────────

const EMPLOYER_CLERK_ID  = process.env.DEMO_EMPLOYER_CLERK_ID;
const EMPLOYEE1_CLERK_ID = process.env.DEMO_EMPLOYEE1_CLERK_ID;
const EMPLOYEE2_CLERK_ID = process.env.DEMO_EMPLOYEE2_CLERK_ID;

if (!EMPLOYER_CLERK_ID || !EMPLOYEE1_CLERK_ID || !EMPLOYEE2_CLERK_ID) {
  console.error('❌  Missing DEMO_*_CLERK_ID env vars. See DEMO_SEEDING.md');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
function daysFromNow(n: number): string {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}
function monthStr(offset = 0): string {
  const d = new Date(); d.setMonth(d.getMonth() - offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
async function q<T>(label: string, promise: Promise<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await promise;
  if (error) { console.error(`  ✗ ${label}:`, error.message); throw error; }
  console.log(`  ✓ ${label}`);
  return data as T;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  Rookie Demo Seed — starting…\n');

  // ── 1. CLEANUP previous demo data ──────────────────────────────────────────
  console.log('🗑   Cleaning up previous demo data…');

  // Find demo company
  const { data: existingCompany } = await supabase
    .from('companies').select('id').eq('name', 'NovaTech Studio').single();

  if (existingCompany) {
    const cid = existingCompany.id;

    // Get employee IDs
    const { data: emps } = await supabase.from('employees').select('id').eq('company_id', cid);
    const empIds = (emps || []).map(e => e.id);

    // Get job IDs
    const { data: jobRows } = await supabase.from('jobs').select('id').eq('company_id', cid);
    const jobIds = (jobRows || []).map(j => j.id);

    if (empIds.length) {
      await supabase.from('payroll').delete().in('employee_id', empIds);
      await supabase.from('attendance').delete().in('employee_id', empIds);
      await supabase.from('leave_requests').delete().in('employee_id', empIds);
    }
    if (jobIds.length) {
      // interviews cascade from applications which cascade from jobs
      await supabase.from('applications').delete().in('job_id', jobIds);
    }
    await supabase.from('employees').delete().eq('company_id', cid);
    await supabase.from('jobs').delete().eq('company_id', cid);
    await supabase.from('companies').delete().eq('id', cid);
  }

  // Cleanup demo pipeline fake users
  await supabase.from('users').delete().like('email', 'demo.pipeline%@rookie.demo');

  console.log('  ✓ Cleanup done\n');

  // ── 2. USERS ──────────────────────────────────────────────────────────────
  console.log('👥  Creating users…');

  // Employer
  const { data: existingEmployer } = await supabase
    .from('users').select('id').eq('clerk_user_id', EMPLOYER_CLERK_ID).single();

  let employerId: string;
  if (existingEmployer) {
    await supabase.from('users').update({ role: 'employer', email: 'demo.employer@rookie.com' }).eq('id', existingEmployer.id);
    employerId = existingEmployer.id;
    console.log('  ✓ Employer user (updated existing)');
  } else {
    const d = await q('Employer user', supabase.from('users')
      .insert({ clerk_user_id: EMPLOYER_CLERK_ID, role: 'employer', email: 'demo.employer@rookie.com' })
      .select('id').single());
    employerId = d.id;
  }

  // Employee 1 (Maya)
  const { data: existingEmp1 } = await supabase
    .from('users').select('id').eq('clerk_user_id', EMPLOYEE1_CLERK_ID).single();
  let maya_uid: string;
  if (existingEmp1) {
    await supabase.from('users').update({ role: 'candidate', email: 'demo.employee1@rookie.com' }).eq('id', existingEmp1.id);
    maya_uid = existingEmp1.id;
    console.log('  ✓ Maya user (updated existing)');
  } else {
    const d = await q('Maya user', supabase.from('users')
      .insert({ clerk_user_id: EMPLOYEE1_CLERK_ID, role: 'candidate', email: 'demo.employee1@rookie.com' })
      .select('id').single());
    maya_uid = d.id;
  }

  // Employee 2 (Daniel)
  const { data: existingEmp2 } = await supabase
    .from('users').select('id').eq('clerk_user_id', EMPLOYEE2_CLERK_ID).single();
  let daniel_uid: string;
  if (existingEmp2) {
    await supabase.from('users').update({ role: 'candidate', email: 'demo.employee2@rookie.com' }).eq('id', existingEmp2.id);
    daniel_uid = existingEmp2.id;
    console.log('  ✓ Daniel user (updated existing)');
  } else {
    const d = await q('Daniel user', supabase.from('users')
      .insert({ clerk_user_id: EMPLOYEE2_CLERK_ID, role: 'candidate', email: 'demo.employee2@rookie.com' })
      .select('id').single());
    daniel_uid = d.id;
  }

  // 6 fake pipeline candidates
  const pipelineUsers = await Promise.all([
    { email: 'demo.pipeline1@rookie.demo', name: 'Aisha Kovac' },
    { email: 'demo.pipeline2@rookie.demo', name: 'Leo Martinez' },
    { email: 'demo.pipeline3@rookie.demo', name: 'Priya Nair' },
    { email: 'demo.pipeline4@rookie.demo', name: 'Chris Wong' },
    { email: 'demo.pipeline5@rookie.demo', name: 'Sara Dubois' },
    { email: 'demo.pipeline6@rookie.demo', name: 'Tom Okafor' },
  ].map(async (u, i) => {
    const d = await q(`Pipeline user ${i + 1} (${u.name})`, supabase.from('users')
      .insert({ clerk_user_id: `demo_pipeline_${i + 1}_no_auth`, role: 'candidate', email: u.email })
      .select('id').single());
    return { id: d.id, ...u };
  }));

  console.log('');

  // ── 3. CANDIDATE PROFILES ────────────────────────────────────────────────
  console.log('📋  Creating candidate profiles…');

  await supabase.from('candidate_profiles').delete().in('user_id', [maya_uid, daniel_uid]);

  await q('Maya profile', supabase.from('candidate_profiles').insert({
    user_id: maya_uid,
    full_name: 'Maya Chen',
    current_title: 'Product Designer',
    experience_level: 'mid',
    location: 'Tbilisi, Georgia',
    bio: 'Product designer with 4 years of experience in SaaS and B2B tools. Passionate about design systems and data-heavy UIs.',
    skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'User Testing', 'Framer'],
    linkedin_url: 'https://linkedin.com/in/mayachen-demo',
    portfolio_url: 'https://maya-portfolio.example',
  }).select().single());

  await q('Daniel profile', supabase.from('candidate_profiles').insert({
    user_id: daniel_uid,
    full_name: 'Daniel Reed',
    current_title: 'Frontend Developer',
    experience_level: 'mid',
    location: 'Tbilisi, Georgia',
    bio: 'Frontend developer specializing in React and TypeScript. Loves clean code and fast UIs.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Git'],
    linkedin_url: 'https://linkedin.com/in/danielreed-demo',
  }).select().single());

  console.log('');

  // ── 4. COMPANY ───────────────────────────────────────────────────────────
  console.log('🏢  Creating company…');

  const company = await q('NovaTech Studio', supabase.from('companies').insert({
    owner_id: employerId,
    name: 'NovaTech Studio',
    industry: 'Software / SaaS',
    size: '11–50',
    website: 'https://novatech.example',
    description: 'NovaTech Studio is an early-stage SaaS company building workflow automation tools for modern teams. We are remote-friendly, fast-moving, and care deeply about craft.',
  }).select().single());

  const companyId = company.id;
  console.log('');

  // ── 5. JOBS ──────────────────────────────────────────────────────────────
  console.log('💼  Creating jobs…');

  const jobsData = [
    { title: 'Junior Frontend Developer', department: 'Engineering', location: 'Tbilisi / Remote', type: 'full_time', salary_min: 1200, salary_max: 1800, status: 'published',
      description: 'We are looking for a motivated junior frontend developer to join our product team. You will work closely with our senior engineers and designers to build and improve our SaaS platform.',
      requirements: '1+ years of experience with React or Vue. Understanding of HTML/CSS fundamentals. Ability to work in a fast-paced startup environment.',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'] },
    { title: 'Product Designer', department: 'Product', location: 'Remote', type: 'full_time', salary_min: 1500, salary_max: 2200, status: 'published',
      description: 'We need a talented Product Designer to own the design of our core product. You will define user flows, build prototypes, and maintain our design system.',
      requirements: '3+ years of product design experience. Strong Figma skills. Experience with B2B or SaaS products preferred.',
      skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'User Testing'] },
    { title: 'Marketing Coordinator', department: 'Marketing', location: 'Tbilisi', type: 'full_time', salary_min: 900, salary_max: 1300, status: 'published',
      description: 'Join our marketing team to help grow NovaTech\'s brand and pipeline. You will manage social media, content calendar, and support campaign execution.',
      requirements: 'Experience in content marketing or social media. Strong writing skills. Familiarity with marketing tools (Notion, HubSpot, etc.).',
      skills: ['Content Marketing', 'Social Media', 'Copywriting', 'HubSpot'] },
    { title: 'HR Operations Assistant', department: 'People', location: 'Hybrid', type: 'part_time', salary_min: 700, salary_max: 1000, status: 'published',
      description: 'Support our people operations as we scale. You will help with onboarding, HR admin, and employee experience initiatives.',
      requirements: 'Organized and detail-oriented. Experience with HR tools is a plus. Strong communication skills.',
      skills: ['HR Administration', 'Onboarding', 'Communication', 'Notion'] },
    { title: 'Backend Developer', department: 'Engineering', location: 'Remote', type: 'full_time', salary_min: 1800, salary_max: 2800, status: 'published',
      description: 'We are looking for an experienced backend developer to build and scale our API infrastructure. You will own core services and help design our data architecture.',
      requirements: '3+ years backend experience. Strong Node.js or Python skills. Experience with PostgreSQL and REST APIs.',
      skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'TypeScript', 'Docker'] },
  ];

  const jobs = await Promise.all(jobsData.map(async (j) => {
    const d = await q(j.title, supabase.from('jobs').insert({ ...j, company_id: companyId }).select().single());
    return d;
  }));

  // Map by title for easy reference
  const jobMap: Record<string, string> = {};
  jobs.forEach(j => { jobMap[j.title] = j.id; });
  console.log('');

  // ── 6. APPLICATIONS ──────────────────────────────────────────────────────
  console.log('📨  Creating applications…');

  // Maya → Product Designer → hired
  const mayaApp = await q('Maya → Product Designer (hired)', supabase.from('applications').insert({
    job_id: jobMap['Product Designer'],
    candidate_id: maya_uid,
    status: 'hired',
    match_score: 91,
    cover_letter: 'I have been following NovaTech\'s product philosophy for a while and would love to contribute to your design team. My background in design systems and B2B SaaS makes this a natural fit.',
  }).select().single());

  // Daniel → Junior Frontend Developer → hired
  const danielApp = await q('Daniel → Junior Frontend Developer (hired)', supabase.from('applications').insert({
    job_id: jobMap['Junior Frontend Developer'],
    candidate_id: daniel_uid,
    status: 'hired',
    match_score: 87,
    cover_letter: 'As a frontend developer passionate about clean UI and modern tooling, I am excited about the opportunity to join NovaTech\'s engineering team.',
  }).select().single());

  // Pipeline applications to populate the employer dashboard
  const pipelineApps = [
    { user: pipelineUsers[0], job: 'Marketing Coordinator',     status: 'applied',     score: 62 },
    { user: pipelineUsers[1], job: 'Backend Developer',          status: 'applied',     score: 55 },
    { user: pipelineUsers[2], job: 'Junior Frontend Developer',  status: 'applied',     score: 70 },
    { user: pipelineUsers[3], job: 'HR Operations Assistant',    status: 'reviewed',    score: 74 },
    { user: pipelineUsers[4], job: 'Backend Developer',          status: 'reviewed',    score: 81 },
    { user: pipelineUsers[5], job: 'Marketing Coordinator',      status: 'shortlisted', score: 78 },
    { user: pipelineUsers[0], job: 'Junior Frontend Developer',  status: 'shortlisted', score: 66 },
    { user: pipelineUsers[1], job: 'Product Designer',           status: 'interview',   score: 83 },
    { user: pipelineUsers[2], job: 'Backend Developer',          status: 'rejected',    score: 45 },
  ];

  const createdPipelineApps: Record<string, string> = {};
  await Promise.all(pipelineApps.map(async (pa, i) => {
    const jid = jobMap[pa.job];
    if (!jid) return;
    const d = await q(`Pipeline app ${i + 1} (${pa.user.name} → ${pa.job})`, supabase.from('applications').insert({
      job_id: jid,
      candidate_id: pa.user.id,
      status: pa.status,
      match_score: pa.score,
    }).select('id').single());
    if (pa.status === 'interview') {
      createdPipelineApps[pa.user.name] = d.id;
    }
  }));

  console.log('');

  // ── 7. INTERVIEWS ────────────────────────────────────────────────────────
  console.log('📅  Creating interviews…');

  await q('Maya — Product Designer interview (completed)', supabase.from('interviews').insert({
    application_id: mayaApp.id,
    employer_id: employerId,
    candidate_id: maya_uid,
    title: 'Portfolio Review — Product Designer',
    date: daysAgo(7),
    time: '14:00',
    type: 'online',
    meeting_link: 'https://meet.google.com/demo-maya',
    status: 'completed',
  }).select().single());

  await q('Daniel — Frontend Developer interview (completed)', supabase.from('interviews').insert({
    application_id: danielApp.id,
    employer_id: employerId,
    candidate_id: daniel_uid,
    title: 'Technical Interview — Frontend Developer',
    date: daysAgo(5),
    time: '10:00',
    type: 'online',
    meeting_link: 'https://meet.google.com/demo-daniel',
    status: 'completed',
  }).select().single());

  // Interview with pipeline candidate (Aisha — Marketing)
  const aishaInterviewApp = createdPipelineApps['Leo Martinez'];
  if (aishaInterviewApp) {
    await q('Leo — Backend Developer interview (pending)', supabase.from('interviews').insert({
      application_id: aishaInterviewApp,
      employer_id: employerId,
      candidate_id: pipelineUsers[1].id,
      title: 'Technical Interview — Backend Developer',
      date: daysFromNow(3),
      time: '11:00',
      type: 'online',
      meeting_link: 'https://meet.google.com/demo-leo',
      status: 'pending',
    }).select().single());
  }

  console.log('');

  // ── 8. EMPLOYEES ─────────────────────────────────────────────────────────
  console.log('👔  Creating employees…');

  const maya_emp = await q('Maya Chen (employee)', supabase.from('employees').insert({
    company_id: companyId,
    full_name: 'Maya Chen',
    email: 'demo.employee1@rookie.com',
    role: 'Product Designer',
    department: 'Product',
    employment_type: 'full_time',
    salary: 1900,
    start_date: daysAgo(90),
    status: 'active',
  }).select().single());

  const daniel_emp = await q('Daniel Reed (employee)', supabase.from('employees').insert({
    company_id: companyId,
    full_name: 'Daniel Reed',
    email: 'demo.employee2@rookie.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    employment_type: 'full_time',
    salary: 1600,
    start_date: daysAgo(60),
    status: 'active',
  }).select().single());

  const mayaEmpId = maya_emp.id;
  const danielEmpId = daniel_emp.id;
  console.log('');

  // ── 9. ATTENDANCE (last 14 working days) ─────────────────────────────────
  console.log('⏰  Creating attendance records…');

  let count = 0;
  for (let i = 1; i <= 20; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    if (count >= 14) break;
    count++;

    const dateStr = d.toISOString().split('T')[0];

    // Maya — mostly present, 1 late
    const mayaStatus = i === 8 ? 'late' : 'present';
    await supabase.from('attendance').upsert({
      employee_id: mayaEmpId,
      date: dateStr,
      clock_in: mayaStatus === 'late' ? '09:42' : '09:00',
      clock_out: '18:00',
      status: mayaStatus,
    }, { onConflict: 'employee_id,date' });

    // Daniel — mostly present, 1 absent, 1 late
    let danielStatus: 'present' | 'absent' | 'late' = 'present';
    if (i === 4) danielStatus = 'absent';
    else if (i === 10) danielStatus = 'late';

    await supabase.from('attendance').upsert({
      employee_id: danielEmpId,
      date: dateStr,
      clock_in: danielStatus === 'absent' ? null : danielStatus === 'late' ? '10:15' : '09:00',
      clock_out: danielStatus === 'absent' ? null : '18:00',
      status: danielStatus,
    }, { onConflict: 'employee_id,date' });
  }
  console.log('  ✓ Attendance records created');
  console.log('');

  // ── 10. LEAVE REQUESTS ────────────────────────────────────────────────────
  console.log('🏖️  Creating leave requests…');

  await q('Maya — vacation (approved)', supabase.from('leave_requests').insert({
    employee_id: mayaEmpId, type: 'vacation',
    start_date: daysFromNow(10), end_date: daysFromNow(14),
    reason: 'Annual leave — family vacation', status: 'approved',
  }).select().single());

  await q('Maya — sick (pending)', supabase.from('leave_requests').insert({
    employee_id: mayaEmpId, type: 'sick',
    start_date: daysAgo(2), end_date: daysAgo(1),
    reason: 'Feeling unwell', status: 'pending',
  }).select().single());

  await q('Daniel — personal (rejected)', supabase.from('leave_requests').insert({
    employee_id: danielEmpId, type: 'personal',
    start_date: daysFromNow(3), end_date: daysFromNow(4),
    reason: 'Personal appointment', status: 'rejected',
  }).select().single());

  await q('Daniel — personal (approved)', supabase.from('leave_requests').insert({
    employee_id: danielEmpId, type: 'personal',
    start_date: daysAgo(20), end_date: daysAgo(19),
    reason: 'Moving to new apartment', status: 'approved',
  }).select().single());

  console.log('');

  // ── 11. PAYROLL ───────────────────────────────────────────────────────────
  console.log('💰  Creating payroll records…');

  const prevMonth = monthStr(1);
  const currMonth = monthStr(0);

  await q(`Maya — ${prevMonth} (paid)`, supabase.from('payroll').upsert({
    employee_id: mayaEmpId, month: prevMonth,
    base_salary: 1900, bonus: 200, deductions: 190, net_pay: 1910, status: 'paid',
  }, { onConflict: 'employee_id,month' }).select().single());

  await q(`Maya — ${currMonth} (pending)`, supabase.from('payroll').upsert({
    employee_id: mayaEmpId, month: currMonth,
    base_salary: 1900, bonus: 0, deductions: 190, net_pay: 1710, status: 'pending',
  }, { onConflict: 'employee_id,month' }).select().single());

  await q(`Daniel — ${prevMonth} (paid)`, supabase.from('payroll').upsert({
    employee_id: danielEmpId, month: prevMonth,
    base_salary: 1600, bonus: 0, deductions: 160, net_pay: 1440, status: 'paid',
  }, { onConflict: 'employee_id,month' }).select().single());

  await q(`Daniel — ${currMonth} (pending)`, supabase.from('payroll').upsert({
    employee_id: danielEmpId, month: currMonth,
    base_salary: 1600, bonus: 0, deductions: 160, net_pay: 1440, status: 'pending',
  }, { onConflict: 'employee_id,month' }).select().single());

  console.log('');

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log('✅  Demo seed complete!\n');
  console.log('📊  Summary:');
  console.log('    • 1 company  : NovaTech Studio');
  console.log('    • 5 jobs     : published');
  console.log('    • 11 apps    : applied(3) reviewed(2) shortlisted(2) interview(1) hired(2) rejected(1)');
  console.log('    • 3 interviews');
  console.log('    • 2 employees: Maya Chen, Daniel Reed');
  console.log('    • 14 attendance records each');
  console.log('    • 4 leave requests');
  console.log('    • 4 payroll records');
  console.log('\n🔑  Login with:');
  console.log('    Employer  → demo.employer@rookie.com');
  console.log('    Candidate → demo.employee1@rookie.com (Maya)');
  console.log('    Candidate → demo.employee2@rookie.com (Daniel)\n');
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
});
