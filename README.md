# Rookie

**Rookie** is a full-stack HR and recruitment SaaS portfolio project built for startup teams. It combines a public hiring experience with role-based candidate, employer, and admin workspaces for recruitment and day-to-day HR operations.

## What it includes

### Candidate experience
- Browse published jobs and apply for roles
- Track application status across the hiring pipeline
- Manage profile, skills, resume, portfolio links, and job preferences
- View upcoming interviews and application activity
- Receive skill-based job match scores

### Employer experience
- Create and manage job postings
- Review applications and move candidates through hiring stages
- Schedule interviews
- Manage employees, attendance, leave requests, and payroll
- View recruiting and HR activity from a dedicated dashboard

### Admin experience
- Manage users, companies, jobs, and applications from dedicated admin views

## Tech stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Clerk
- Radix UI / shadcn
- GSAP

### Backend
- Node.js
- Express
- TypeScript
- Zod
- Swagger / OpenAPI
- Clerk token verification
- Express rate limiting
- Resend

### Data
- PostgreSQL
- Supabase

## Architecture

Rookie is split into separate frontend and backend applications:

```text
Rookie/
├── frontend/        Next.js application
├── backend/         Express REST API
├── supabase/        database / seed resources
└── DEMO_SEEDING.md  portfolio demo-data guide
```

The frontend authenticates users with Clerk and sends authenticated requests to the Express API. The backend verifies Clerk tokens, applies role-based authorization, validates input, and communicates with Supabase/PostgreSQL.

The application supports three primary roles:

```text
candidate  → profile, jobs, applications, interviews, messages
employer   → company, hiring pipeline, jobs, interviews, HR operations
admin      → platform-level management
```

## Match scoring

Rookie includes a custom skill-based matching service that compares a candidate's skills with the skills required by a job.

The score is calculated from the proportion of required skills that match and returns:

- match percentage
- matched skills
- missing skills
- a human-readable fit label

This keeps the matching logic transparent and easy to explain.

## API and backend safeguards

The backend includes:

- Bearer-token authentication with Clerk
- role-based authorization
- Zod request validation
- CORS restrictions
- rate limiting
- centralized error handling
- Swagger / OpenAPI documentation
- Supabase Row Level Security enabled at the database level

When running locally, Swagger UI is available through the backend API documentation route.

## Database model

The core schema covers:

- users
- companies
- candidate profiles
- jobs
- applications
- interviews
- messages
- employees
- attendance
- payroll
- leave requests

Foreign keys and cascading relationships are used to keep recruitment and HR data connected consistently.

## Local development

### 1. Clone the repository

```bash
git clone https://github.com/itsherhere/Rookie.git
cd Rookie
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

### 3. Backend

Open another terminal:

```bash
cd backend
npm install
cp .env.example .env.local
npm run dev
```

The backend uses environment variables for Clerk, Supabase, Resend, and the frontend origin. Never commit real credentials.

## Demo data

A dedicated demo seeding workflow is included for portfolio presentations.

See:

```text
DEMO_SEEDING.md
```

It can populate the project with realistic demo companies, jobs, applications, interviews, employees, attendance, leave, and payroll data.

## Project focus

This project was built to practice and demonstrate:

- full-stack application architecture
- authenticated multi-role products
- REST API design
- relational data modelling
- recruitment workflows
- HR operations
- validation and authorization
- reusable dashboard UI
- API documentation

## Author

**Sogand Hamidpour**  
Computer Science & AI student · Full-Stack Developer

GitHub: [@itsherhere](https://github.com/itsherhere)
