// ─── Mock Data for Portfolio Demo ─────────────────────────────────────────────
// Enable with: NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local

export const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

import type {
  Company, Job, Application, Interview,
  Employee, Payroll, LeaveRequest, CandidateProfile,
} from '@/types';

// ─── Company ──────────────────────────────────────────────────────────────────

export const mockCompany: Company = {
  id: 'mock-company-1',
  owner_id: 'mock-owner-1',
  name: 'TechFlow Labs',
  industry: 'Software · SaaS',
  size: '11–50',
  website: 'https://techflow.io',
  description: 'We build developer tools that automate cloud infrastructure for scaling startups.',
  created_at: new Date(Date.now() - 90 * 864e5).toISOString(),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const mockJobs: Job[] = [
  {
    id: 'mock-job-1',
    company_id: 'mock-company-1',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'full_time',
    salary_min: 120000,
    salary_max: 160000,
    description: 'Lead UX across our core platform.',
    skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    status: 'published',
    created_at: new Date(Date.now() - 7 * 864e5).toISOString(),
    companies: { name: 'TechFlow Labs' },
  },
  {
    id: 'mock-job-2',
    company_id: 'mock-company-1',
    title: 'Full-Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'full_time',
    salary_min: 130000,
    salary_max: 180000,
    description: 'Build scalable backend services and responsive frontends.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    status: 'published',
    created_at: new Date(Date.now() - 14 * 864e5).toISOString(),
    companies: { name: 'TechFlow Labs' },
  },
  {
    id: 'mock-job-3',
    company_id: 'mock-company-1',
    title: 'Brand Designer',
    department: 'Marketing',
    location: 'Remote',
    type: 'full_time',
    salary_min: 90000,
    salary_max: 120000,
    description: 'Shape our visual identity across marketing and product.',
    skills: ['Illustrator', 'Brand Strategy', 'Motion Design', 'Figma'],
    status: 'published',
    created_at: new Date(Date.now() - 21 * 864e5).toISOString(),
    companies: { name: 'TechFlow Labs' },
  },
];

// ─── Applications ─────────────────────────────────────────────────────────────

export const mockApplications: Application[] = [
  {
    id: 'mock-app-1',
    job_id: 'mock-job-1',
    candidate_id: 'mock-cand-1',
    status: 'interview',
    match_score: 88,
    cover_letter: 'My background in design systems aligns perfectly with this role.',
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    jobs: { title: 'Senior Product Designer', location: 'Remote', companies: { name: 'Linear' } },
  },
  {
    id: 'mock-app-2',
    job_id: 'mock-job-2',
    candidate_id: 'mock-cand-1',
    status: 'shortlisted',
    match_score: 74,
    created_at: new Date(Date.now() - 4 * 864e5).toISOString(),
    jobs: { title: 'Full-Stack Engineer', location: 'San Francisco, CA', companies: { name: 'Vercel' } },
  },
  {
    id: 'mock-app-3',
    job_id: 'mock-job-3',
    candidate_id: 'mock-cand-1',
    status: 'applied',
    match_score: 65,
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
    jobs: { title: 'Brand Designer', location: 'Remote', companies: { name: 'Figma' } },
  },
  {
    id: 'mock-app-4',
    job_id: 'mock-job-1',
    candidate_id: 'mock-cand-1',
    status: 'rejected',
    match_score: 50,
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
    jobs: { title: 'Product Designer', location: 'Remote', companies: { name: 'Notion' } },
  },
  {
    id: 'mock-app-5',
    job_id: 'mock-job-2',
    candidate_id: 'mock-cand-1',
    status: 'hired',
    match_score: 95,
    created_at: new Date(Date.now() - 30 * 864e5).toISOString(),
    jobs: { title: 'Frontend Engineer', location: 'Remote', companies: { name: 'Stripe' } },
  },
];

// ─── Employer incoming applications (for employer dashboard) ──────────────────

export const mockIncomingApplications = [
  { id: 'ea-1', candidateName: 'Sara Hamidpur', jobTitle: 'Senior Product Designer', status: 'interview' as const, matchScore: 88, appliedAt: new Date(Date.now() - 2 * 864e5).toISOString() },
  { id: 'ea-2', candidateName: 'Hamid Pour',   jobTitle: 'Full-Stack Engineer',      status: 'shortlisted' as const, matchScore: 95, appliedAt: new Date(Date.now() - 3 * 864e5).toISOString() },
  { id: 'ea-3', candidateName: 'Ali Rezaei',   jobTitle: 'Brand Designer',           status: 'applied' as const,     matchScore: 71, appliedAt: new Date(Date.now() - 4 * 864e5).toISOString() },
  { id: 'ea-4', candidateName: 'Mina Karimi',  jobTitle: 'Senior Product Designer',  status: 'reviewed' as const,    matchScore: 62, appliedAt: new Date(Date.now() - 5 * 864e5).toISOString() },
];

// ─── Interviews ───────────────────────────────────────────────────────────────

export const mockInterviews: Interview[] = [
  {
    id: 'mock-int-1',
    application_id: 'mock-app-1',
    employer_id: 'mock-owner-1',
    candidate_id: 'mock-cand-1',
    title: 'Design Portfolio Review',
    date: new Date(Date.now() + 2 * 864e5).toISOString().split('T')[0],
    time: '14:00:00',
    type: 'online',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: 'mock-int-2',
    application_id: 'mock-app-2',
    employer_id: 'mock-owner-1',
    candidate_id: 'mock-cand-1',
    title: 'Technical Interview — Full-Stack',
    date: new Date(Date.now() + 5 * 864e5).toISOString().split('T')[0],
    time: '10:00:00',
    type: 'onsite',
    meeting_link: 'https://techflow.io/offices/sf',
    status: 'accepted',
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
];

// ─── Employees ────────────────────────────────────────────────────────────────

export const mockEmployees: Employee[] = [
  {
    id: 'mock-emp-1',
    company_id: 'mock-company-1',
    full_name: 'Hamid Pour',
    email: 'hamid@techflow.io',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    employment_type: 'full_time',
    salary: 9500,
    start_date: '2024-03-01',
    status: 'active',
    created_at: new Date(Date.now() - 120 * 864e5).toISOString(),
  },
  {
    id: 'mock-emp-2',
    company_id: 'mock-company-1',
    full_name: 'Sara Hamidpur',
    email: 'sara@techflow.io',
    role: 'Product Designer',
    department: 'Design',
    employment_type: 'full_time',
    salary: 7500,
    start_date: '2024-06-15',
    status: 'active',
    created_at: new Date(Date.now() - 60 * 864e5).toISOString(),
  },
];

// ─── Payroll ──────────────────────────────────────────────────────────────────

export const mockPayroll: Payroll[] = [
  { id: 'mock-pay-1', employee_id: 'mock-emp-1', month: '2026-05', base_salary: 9500, bonus: 1000, deductions: 850, net_pay: 9650, status: 'paid',    created_at: new Date().toISOString() },
  { id: 'mock-pay-2', employee_id: 'mock-emp-1', month: '2026-06', base_salary: 9500, bonus: 0,    deductions: 850, net_pay: 8650, status: 'pending', created_at: new Date().toISOString() },
  { id: 'mock-pay-3', employee_id: 'mock-emp-2', month: '2026-05', base_salary: 7500, bonus: 500,  deductions: 700, net_pay: 7300, status: 'paid',    created_at: new Date().toISOString() },
  { id: 'mock-pay-4', employee_id: 'mock-emp-2', month: '2026-06', base_salary: 7500, bonus: 0,    deductions: 700, net_pay: 6800, status: 'pending', created_at: new Date().toISOString() },
];

// ─── Leave requests ───────────────────────────────────────────────────────────

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'mock-lr-1', employee_id: 'mock-emp-1', type: 'vacation', start_date: new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0], end_date: new Date(Date.now() + 18 * 864e5).toISOString().split('T')[0], reason: 'Family trip', status: 'pending', created_at: new Date().toISOString() },
  { id: 'mock-lr-2', employee_id: 'mock-emp-2', type: 'personal', start_date: new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0],  end_date: new Date(Date.now() + 9 * 864e5).toISOString().split('T')[0],  reason: 'Moving apartment', status: 'approved', created_at: new Date().toISOString() },
];

// ─── Candidate profile ────────────────────────────────────────────────────────

export const mockCandidateProfile: CandidateProfile = {
  id: 'mock-cp-1',
  user_id: 'mock-cand-1',
  full_name: 'Sara Hamidpur',
  current_title: 'Product Designer',
  experience_level: 'mid',
  location: 'Remote',
  skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'User Testing'],
  bio: 'Product designer specializing in B2B SaaS.',
  linkedin_url: 'https://linkedin.com/in/sarahamidpur',
  created_at: new Date().toISOString(),
};

// ─── Employer stats ───────────────────────────────────────────────────────────

export const mockEmployerStats = {
  company: mockCompany,
  totalJobs: mockJobs.length,
  publishedJobs: mockJobs.filter(j => j.status === 'published').length,
  totalApplications: 12,
  totalInterviews: 3,
  totalEmployees: mockEmployees.length,
  pendingLeave: mockLeaveRequests.filter(l => l.status === 'pending').length,
  pendingPayroll: mockPayroll.filter(p => p.status === 'pending').length,
};
