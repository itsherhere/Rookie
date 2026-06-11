# Rookie — Demo Seed Setup

This guide explains how to populate the Rookie app with realistic demo data for portfolio presentations.

---

## What gets created

| Data | Details |
|------|---------|
| **Company** | NovaTech Studio — SaaS startup, 11–50 employees |
| **Jobs** | 5 published jobs (Frontend Dev, Product Designer, Marketing, HR Ops, Backend Dev) |
| **Applications** | 11 applications across all pipeline stages |
| **Pipeline** | applied(3) · reviewed(2) · shortlisted(2) · interview(1) · hired(2) · rejected(1) |
| **Employees** | Maya Chen (Product Designer) · Daniel Reed (Frontend Developer) |
| **Interviews** | 3 interviews (2 completed, 1 upcoming) |
| **Attendance** | 14 working days per employee |
| **Leave requests** | 4 requests with mixed statuses |
| **Payroll** | 2 months per employee (1 paid, 1 pending) |

---

## Step 1 — Create 3 Clerk accounts

Create these accounts in your Clerk dashboard or via the app's sign-up page:

| Account | Email | Role |
|---------|-------|------|
| Employer | `demo.employer@rookie.com` | employer |
| Employee 1 | `demo.employee1@rookie.com` | candidate |
| Employee 2 | `demo.employee2@rookie.com` | candidate |

**Important:** After creating each account, go through onboarding and select the correct role. This creates the user record in Supabase.

---

## Step 2 — Get Clerk User IDs

For each account, find the Clerk User ID:

**Option A — Clerk Dashboard:**
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your app → Users
3. Click each user → copy the `User ID` (starts with `user_`)

**Option B — From Supabase:**
```sql
SELECT email, clerk_user_id FROM users ORDER BY created_at;
```

---

## Step 3 — Add IDs to environment

### For the TypeScript script (recommended):

Add to `backend/.env.local`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DEMO_EMPLOYER_CLERK_ID=user_xxxxxxxxxxxxxxxx
DEMO_EMPLOYEE1_CLERK_ID=user_xxxxxxxxxxxxxxxx
DEMO_EMPLOYEE2_CLERK_ID=user_xxxxxxxxxxxxxxxx
```

### For the SQL file:

Open `supabase/seed-demo.sql` and replace the placeholders at the top:
```sql
v_employer_clerk_id   text := 'user_xxxxxxxxxxxxxxxx';
v_employee1_clerk_id  text := 'user_xxxxxxxxxxxxxxxx';
v_employee2_clerk_id  text := 'user_xxxxxxxxxxxxxxxx';
```

---

## Step 4 — Run the seed

### Option A: TypeScript script (recommended)

From the `backend` directory:
```bash
npm install   # if not already done
npx ts-node --transpile-only scripts/seed-demo.ts
```

### Option B: SQL in Supabase

1. Open Supabase → SQL Editor → New query
2. Paste the contents of `supabase/seed-demo.sql`
3. Fill in your Clerk IDs at the top
4. Click Run

---

## Step 5 — Login and explore

| Account | What to demonstrate |
|---------|---------------------|
| `demo.employer@rookie.com` | Dashboard with pipeline, active jobs, HR snapshot, upcoming interview |
| `demo.employee1@rookie.com` (Maya) | Applications with interview/hired status, profile completion |
| `demo.employee2@rookie.com` (Daniel) | Applications with hired status, upcoming interview |

---

## Resetting demo data

The seed is **idempotent** — running it multiple times is safe. It deletes the previous NovaTech Studio data before reinserting.

```bash
# Just run again
npx ts-node --transpile-only scripts/seed-demo.ts
```

Or in Supabase SQL Editor, run `seed-demo.sql` again with correct Clerk IDs.

---

## Notes

- **Fake pipeline users** (6 candidates with `demo.pipeline*@rookie.demo` emails) are created in the `users` table with placeholder Clerk IDs. They cannot sign in but populate the employer's hiring pipeline.
- The `companies` table has **no `location` column** — location is stored in job postings instead.
- Attendance uses `clock_in`/`clock_out` text fields (not timestamps).
- Payroll `month` field is stored as `YYYY-MM` text.

---

## Troubleshooting

**"Missing Clerk IDs" error:** Make sure all three `DEMO_*_CLERK_ID` vars are set in `.env.local`.

**"Duplicate key" errors:** Run the cleanup first, or run the seed again (it handles cleanup automatically).

**Applications/interviews not showing:** Check that users signed up and selected their roles before running the seed. The seed updates existing user records; it doesn't create Clerk auth accounts.
