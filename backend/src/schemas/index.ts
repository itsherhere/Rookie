import { z } from 'zod';

// ─── Shared ────────────────────────────────────────────────────────────────────
const uuid = z.string().uuid('Must be a valid UUID');
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format');
const timeStr = z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format');
const optionalUrl = z.string().url('Must be a valid URL').optional().or(z.literal(''));

// ─── Users ─────────────────────────────────────────────────────────────────────
export const CreateUserSchema = z.object({
  role: z.enum(['employer', 'candidate', 'admin']),
  email: z.string().email('Must be a valid email'),
});

// ─── Company ───────────────────────────────────────────────────────────────────
export const UpdateCompanySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  website: optionalUrl,
  description: z.string().max(2000).optional(),
  logo_url: optionalUrl,
  location: z.string().max(100).optional(),
});

// ─── Jobs ──────────────────────────────────────────────────────────────────────
// Base schema WITHOUT refine — so .partial() works on it
const JobBaseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().max(10000).optional(),
  location: z.string().max(100).optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']).optional(),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
  skills: z.array(z.string().max(50)).max(30).optional(),
  status: z.enum(['draft', 'published', 'closed']).optional(),
});

export const CreateJobSchema = JobBaseSchema;
export const UpdateJobSchema = JobBaseSchema.partial();
export const UpdateJobStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'closed']),
});

// ─── Applications ──────────────────────────────────────────────────────────────
export const CreateApplicationSchema = z.object({
  job_id: uuid,
  cover_letter: z.string().max(3000).optional(),
  resume_url: optionalUrl,
});

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired']),
});

// ─── Candidate Profile ─────────────────────────────────────────────────────────
export const UpdateCandidateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  current_title: z.string().max(100).optional(),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']).optional(),
  skills: z.array(z.string().max(50)).max(50).optional(),
  bio: z.string().max(2000).optional(),
  portfolio_url: optionalUrl,
  linkedin_url: optionalUrl,
});

// ─── Interviews ────────────────────────────────────────────────────────────────
export const CreateInterviewSchema = z.object({
  application_id: uuid,
  candidate_id: z.string().min(1, 'candidate_id is required'),
  title: z.string().min(2).max(200),
  date: dateStr,
  time: timeStr,
  type: z.enum(['online', 'onsite', 'phone']),
  meeting_link: optionalUrl,
});

export const RespondInterviewSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});

// ─── Messages ──────────────────────────────────────────────────────────────────
export const CreateMessageSchema = z.object({
  application_id: uuid,
  receiver_id: z.string().min(1, 'receiver_id is required'),
  body: z.string().min(1, 'Message cannot be empty').max(5000),
});

// ─── Employees ─────────────────────────────────────────────────────────────────
const EmployeeBaseSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email('Must be a valid email'),
  role: z.string().min(2).max(100),
  department: z.string().max(100).optional(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  salary: z.number().nonnegative().optional(),
  start_date: dateStr,
});

export const CreateEmployeeSchema = EmployeeBaseSchema;
export const UpdateEmployeeSchema = EmployeeBaseSchema.partial().extend({
  status: z.enum(['active', 'inactive']).optional(),
});

// ─── Attendance ────────────────────────────────────────────────────────────────
export const CreateAttendanceSchema = z.object({
  employee_id: uuid,
  date: dateStr,
  clock_in: timeStr.optional(),
  clock_out: timeStr.optional(),
  status: z.enum(['present', 'absent', 'late']),
});

export const UpdateAttendanceSchema = z.object({
  clock_in: timeStr.optional(),
  clock_out: timeStr.optional(),
  status: z.enum(['present', 'absent', 'late']),
});

// ─── Leave ─────────────────────────────────────────────────────────────────────
export const CreateLeaveSchema = z.object({
  employee_id: uuid,
  type: z.enum(['annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid']),
  start_date: dateStr,
  end_date: dateStr,
  reason: z.string().max(500).optional(),
});

export const RespondLeaveSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});