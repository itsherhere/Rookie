// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = 'Rookie';
export const APP_TAGLINE = 'HR OS for startup teams';
export const APP_DESCRIPTION = 'Hire, manage, and grow your first team.';

// ─── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  DEMO: '/demo',
  CASE_STUDY: '/case-study',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ONBOARDING: '/onboarding',
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    COMPANY: '/employer/company',
    JOBS: '/employer/jobs',
    JOBS_NEW: '/employer/jobs/new',
    JOB: (id: string) => `/employer/jobs/${id}`,
    APPLICATIONS: '/employer/applications',
    APPLICATION: (id: string) => `/employer/applications/${id}`,
    INTERVIEWS: '/employer/interviews',
    MESSAGES: '/employer/messages',
    EMPLOYEES: '/employer/employees',
    ATTENDANCE: '/employer/attendance',
    LEAVE: '/employer/leave',
    PAYROLL: '/employer/payroll',
  },
  CANDIDATE: {
    DASHBOARD: '/candidate/dashboard',
    PROFILE: '/candidate/profile',
    APPLICATIONS: '/candidate/applications',
    INTERVIEWS: '/candidate/interviews',
    MESSAGES: '/candidate/messages',
    SETTINGS: '/candidate/settings',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    COMPANIES: '/admin/companies',
    USERS: '/admin/users',
    JOBS: '/admin/jobs',
    APPLICATIONS: '/admin/applications',
  },
  PUBLIC_JOB: (id: string) => `/jobs/${id}`,
  APPLY: (id: string) => `/jobs/${id}/apply`,
  APPLY_SUCCESS: '/apply/success',
} as const;

// ─── Application Pipeline ─────────────────────────────────────────────────────

export const APPLICATION_STATUSES = [
  'applied',
  'reviewed',
  'shortlisted',
  'interview',
  'rejected',
  'hired',
] as const;

export const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  rejected: 'Rejected',
  hired: 'Hired',
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
  draft: 'Draft',
  published: 'Published',
  closed: 'Closed',
  active: 'Active',
  on_leave: 'On Leave',
  resigned: 'Resigned',
  paid: 'Paid',
  approved: 'Approved',
};

// ─── Job Options ──────────────────────────────────────────────────────────────

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0–2 years)' },
  { value: 'mid', label: 'Mid (2–5 years)' },
  { value: 'senior', label: 'Senior (5+ years)' },
  { value: 'lead', label: 'Lead / Principal' },
] as const;

export const INTERVIEW_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'onsite', label: 'On-site' },
  { value: 'phone', label: 'Phone' },
] as const;

export const LEAVE_TYPES = [
  { value: 'sick', label: 'Sick leave' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'personal', label: 'Personal' },
] as const;

export const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
] as const;

export const COMPANY_SIZES = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '500+', label: '500+ employees' },
] as const;
