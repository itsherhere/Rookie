// ─── Roles ───────────────────────────────────────────────────────────────────

export type Role = 'employer' | 'candidate' | 'admin';

// ─── Status Enums ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'hired';

export type InterviewStatus = 'pending' | 'accepted' | 'declined' | 'completed';
export type InterviewType = 'online' | 'onsite' | 'phone';
export type JobStatus = 'draft' | 'published' | 'closed';
export type EmployeeStatus = 'active' | 'on_leave' | 'resigned';
export type PayrollStatus = 'pending' | 'paid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'vacation' | 'personal';
export type AttendanceStatus = 'present' | 'absent' | 'late';

// ─── Database Models ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  clerk_user_id: string;
  role: Role;
  email: string;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  description?: string;
  created_at: string;
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  location?: string;
  current_role?: string;
  experience_level?: string;
  skills: string[];
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  bio?: string;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  requirements?: string;
  skills: string[];
  status: JobStatus;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  match_score?: number;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  employer_id: string;
  candidate_id: string;
  title: string;
  date: string;
  time: string;
  type: InterviewType;
  meeting_link?: string;
  status: InterviewStatus;
  created_at: string;
}

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
}

export interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  employment_type?: string;
  salary: number;
  start_date: string;
  status: EmployeeStatus;
  created_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  status: AttendanceStatus;
  created_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  month: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_pay: number;
  status: PayrollStatus;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason?: string;
  status: LeaveStatus;
  created_at: string;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Service Return Types ─────────────────────────────────────────────────────

export interface MatchScoreResult {
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  label: 'Strong fit' | 'Good fit' | 'Partial fit' | 'Low fit';
}

export interface PayrollCalculation {
  base_salary: number;
  bonus: number;
  deductions: number;
  net_pay: number;
}

// ─── Email Payload Types ──────────────────────────────────────────────────────

export interface ApplicationEmailPayload {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  employerEmail: string;
}

export interface InterviewEmailPayload {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
  meetingLink?: string;
}

export interface StatusUpdateEmailPayload {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  newStatus: ApplicationStatus;
}
