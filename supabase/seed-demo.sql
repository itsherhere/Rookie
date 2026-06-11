-- ═══════════════════════════════════════════════════════════════════════════
--  ROOKIE — Demo Seed SQL
--  Supabase → SQL Editor → New query → fill in Clerk IDs below → Run
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  -- ┌─────────────────────────────────────────────────────────────────────┐
  -- │  STEP 1: Paste your Clerk user IDs here                             │
  -- └─────────────────────────────────────────────────────────────────────┘
  v_employer_clerk_id   text := 'REPLACE_WITH_EMPLOYER_CLERK_ID';
  v_employee1_clerk_id  text := 'REPLACE_WITH_EMPLOYEE1_CLERK_ID';   -- Maya
  v_employee2_clerk_id  text := 'REPLACE_WITH_EMPLOYEE2_CLERK_ID';   -- Daniel

  -- Auto IDs
  v_employer_id   uuid;
  v_maya_uid      uuid;
  v_daniel_uid    uuid;
  v_company_id    uuid;
  v_job1_id       uuid;  -- Junior Frontend Developer
  v_job2_id       uuid;  -- Product Designer
  v_job3_id       uuid;  -- Marketing Coordinator
  v_job4_id       uuid;  -- HR Operations Assistant
  v_job5_id       uuid;  -- Backend Developer
  v_maya_app_id   uuid;
  v_daniel_app_id uuid;
  v_leo_app_id    uuid;
  v_maya_emp_id   uuid;
  v_daniel_emp_id uuid;
  v_pl1           uuid; v_pl2 uuid; v_pl3 uuid;
  v_pl4           uuid; v_pl5 uuid; v_pl6 uuid;
  i               integer;
  work_date       date;
  dow             integer;
BEGIN

  IF v_employer_clerk_id = 'REPLACE_WITH_EMPLOYER_CLERK_ID' THEN
    RAISE EXCEPTION 'Please fill in the Clerk user IDs at the top of the script.';
  END IF;

  -- ── CLEANUP ──────────────────────────────────────────────────────────────
  RAISE NOTICE 'Cleaning up previous demo data…';
  DECLARE v_prev_cid uuid; v_prev_empids uuid[];
  BEGIN
    SELECT id INTO v_prev_cid FROM companies WHERE name = 'NovaTech Studio' LIMIT 1;
    IF v_prev_cid IS NOT NULL THEN
      SELECT ARRAY_AGG(id) INTO v_prev_empids FROM employees WHERE company_id = v_prev_cid;
      IF v_prev_empids IS NOT NULL THEN
        DELETE FROM payroll       WHERE employee_id = ANY(v_prev_empids);
        DELETE FROM attendance    WHERE employee_id = ANY(v_prev_empids);
        DELETE FROM leave_requests WHERE employee_id = ANY(v_prev_empids);
        DELETE FROM employees     WHERE company_id = v_prev_cid;
      END IF;
      DELETE FROM jobs      WHERE company_id = v_prev_cid; -- cascades interviews/applications
      DELETE FROM companies WHERE id = v_prev_cid;
    END IF;
    DELETE FROM users WHERE email LIKE 'demo.pipeline%@rookie.demo';
  END;

  -- ── USERS ────────────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating users…';

  -- Employer
  IF EXISTS (SELECT 1 FROM users WHERE clerk_user_id = v_employer_clerk_id) THEN
    UPDATE users SET role='employer', email='demo.employer@rookie.com' WHERE clerk_user_id = v_employer_clerk_id;
  ELSE
    INSERT INTO users (clerk_user_id, role, email) VALUES (v_employer_clerk_id, 'employer', 'demo.employer@rookie.com');
  END IF;
  SELECT id INTO v_employer_id FROM users WHERE clerk_user_id = v_employer_clerk_id;

  -- Maya
  IF EXISTS (SELECT 1 FROM users WHERE clerk_user_id = v_employee1_clerk_id) THEN
    UPDATE users SET role='candidate', email='demo.employee1@rookie.com' WHERE clerk_user_id = v_employee1_clerk_id;
  ELSE
    INSERT INTO users (clerk_user_id, role, email) VALUES (v_employee1_clerk_id, 'candidate', 'demo.employee1@rookie.com');
  END IF;
  SELECT id INTO v_maya_uid FROM users WHERE clerk_user_id = v_employee1_clerk_id;

  -- Daniel
  IF EXISTS (SELECT 1 FROM users WHERE clerk_user_id = v_employee2_clerk_id) THEN
    UPDATE users SET role='candidate', email='demo.employee2@rookie.com' WHERE clerk_user_id = v_employee2_clerk_id;
  ELSE
    INSERT INTO users (clerk_user_id, role, email) VALUES (v_employee2_clerk_id, 'candidate', 'demo.employee2@rookie.com');
  END IF;
  SELECT id INTO v_daniel_uid FROM users WHERE clerk_user_id = v_employee2_clerk_id;

  -- Pipeline fake users
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_1_no_auth', 'candidate', 'demo.pipeline1@rookie.demo') RETURNING id INTO v_pl1;
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_2_no_auth', 'candidate', 'demo.pipeline2@rookie.demo') RETURNING id INTO v_pl2;
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_3_no_auth', 'candidate', 'demo.pipeline3@rookie.demo') RETURNING id INTO v_pl3;
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_4_no_auth', 'candidate', 'demo.pipeline4@rookie.demo') RETURNING id INTO v_pl4;
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_5_no_auth', 'candidate', 'demo.pipeline5@rookie.demo') RETURNING id INTO v_pl5;
  INSERT INTO users (clerk_user_id, role, email) VALUES ('demo_pipeline_6_no_auth', 'candidate', 'demo.pipeline6@rookie.demo') RETURNING id INTO v_pl6;

  -- ── CANDIDATE PROFILES ───────────────────────────────────────────────────
  DELETE FROM candidate_profiles WHERE user_id IN (v_maya_uid, v_daniel_uid);

  INSERT INTO candidate_profiles (user_id, full_name, current_title, experience_level, location, bio, skills, linkedin_url, portfolio_url)
  VALUES (v_maya_uid, 'Maya Chen', 'Product Designer', 'mid', 'Tbilisi, Georgia',
    'Product designer with 4 years of experience in SaaS and B2B tools.',
    ARRAY['Figma','UX Research','Design Systems','Prototyping','User Testing','Framer'],
    'https://linkedin.com/in/mayachen-demo', 'https://maya-portfolio.example');

  INSERT INTO candidate_profiles (user_id, full_name, current_title, experience_level, location, bio, skills, linkedin_url)
  VALUES (v_daniel_uid, 'Daniel Reed', 'Frontend Developer', 'mid', 'Tbilisi, Georgia',
    'Frontend developer specializing in React and TypeScript.',
    ARRAY['React','TypeScript','Next.js','Tailwind CSS','Node.js','Git'],
    'https://linkedin.com/in/danielreed-demo');

  -- ── COMPANY ──────────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating company…';
  INSERT INTO companies (owner_id, name, industry, size, website, description)
  VALUES (v_employer_id, 'NovaTech Studio', 'Software / SaaS', '11–50',
    'https://novatech.example',
    'NovaTech Studio is an early-stage SaaS company building workflow automation tools for modern teams.')
  RETURNING id INTO v_company_id;

  -- ── JOBS ─────────────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating jobs…';
  INSERT INTO jobs (company_id, title, department, location, type, salary_min, salary_max, description, requirements, skills, status)
  VALUES (v_company_id, 'Junior Frontend Developer', 'Engineering', 'Tbilisi / Remote', 'full_time', 1200, 1800,
    'We are looking for a motivated junior frontend developer to join our product team.',
    '1+ years React experience. Understanding of HTML/CSS. Ability to work in a startup.',
    ARRAY['React','JavaScript','HTML','CSS','Git'], 'published')
  RETURNING id INTO v_job1_id;

  INSERT INTO jobs (company_id, title, department, location, type, salary_min, salary_max, description, requirements, skills, status)
  VALUES (v_company_id, 'Product Designer', 'Product', 'Remote', 'full_time', 1500, 2200,
    'Own the design of our core product. Define user flows, build prototypes, maintain our design system.',
    '3+ years product design. Strong Figma skills. B2B or SaaS experience preferred.',
    ARRAY['Figma','UX Research','Design Systems','Prototyping','User Testing'], 'published')
  RETURNING id INTO v_job2_id;

  INSERT INTO jobs (company_id, title, department, location, type, salary_min, salary_max, description, requirements, skills, status)
  VALUES (v_company_id, 'Marketing Coordinator', 'Marketing', 'Tbilisi', 'full_time', 900, 1300,
    'Manage social media, content calendar, and support campaign execution.',
    'Experience in content marketing or social media. Strong writing skills.',
    ARRAY['Content Marketing','Social Media','Copywriting','HubSpot'], 'published')
  RETURNING id INTO v_job3_id;

  INSERT INTO jobs (company_id, title, department, location, type, salary_min, salary_max, description, requirements, skills, status)
  VALUES (v_company_id, 'HR Operations Assistant', 'People', 'Hybrid', 'part_time', 700, 1000,
    'Support people operations as we scale. Onboarding, HR admin, and employee experience.',
    'Organized and detail-oriented. HR tools experience a plus.',
    ARRAY['HR Administration','Onboarding','Communication','Notion'], 'published')
  RETURNING id INTO v_job4_id;

  INSERT INTO jobs (company_id, title, department, location, type, salary_min, salary_max, description, requirements, skills, status)
  VALUES (v_company_id, 'Backend Developer', 'Engineering', 'Remote', 'full_time', 1800, 2800,
    'Build and scale our API infrastructure. Own core services and help design our data architecture.',
    '3+ years backend experience. Node.js or Python. PostgreSQL and REST APIs.',
    ARRAY['Node.js','PostgreSQL','REST APIs','TypeScript','Docker'], 'published')
  RETURNING id INTO v_job5_id;

  -- ── APPLICATIONS ─────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating applications…';

  -- Maya hired
  INSERT INTO applications (job_id, candidate_id, status, match_score, cover_letter)
  VALUES (v_job2_id, v_maya_uid, 'hired', 91,
    'I have been following NovaTech''s product philosophy and would love to contribute to your design team.')
  RETURNING id INTO v_maya_app_id;

  -- Daniel hired
  INSERT INTO applications (job_id, candidate_id, status, match_score, cover_letter)
  VALUES (v_job1_id, v_daniel_uid, 'hired', 87,
    'As a frontend developer passionate about clean UI and modern tooling, I am excited to join NovaTech.')
  RETURNING id INTO v_daniel_app_id;

  -- Pipeline: applied (3)
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job3_id, v_pl1, 'applied', 62);
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job5_id, v_pl2, 'applied', 55);
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job1_id, v_pl3, 'applied', 70);
  -- Pipeline: reviewed (2)
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job4_id, v_pl4, 'reviewed', 74);
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job5_id, v_pl5, 'reviewed', 81);
  -- Pipeline: shortlisted (2)
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job3_id, v_pl6, 'shortlisted', 78);
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job1_id, v_pl1, 'shortlisted', 66);
  -- Pipeline: interview (1) → save ID for interview record
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job5_id, v_pl2, 'interview', 83) RETURNING id INTO v_leo_app_id;
  -- Pipeline: rejected (1)
  INSERT INTO applications (job_id, candidate_id, status, match_score) VALUES (v_job5_id, v_pl3, 'rejected', 45);

  -- ── INTERVIEWS ───────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating interviews…';

  INSERT INTO interviews (application_id, employer_id, candidate_id, title, date, time, type, meeting_link, status)
  VALUES (v_maya_app_id, v_employer_id, v_maya_uid, 'Portfolio Review — Product Designer',
    CURRENT_DATE - 7, '14:00', 'online', 'https://meet.google.com/demo-maya', 'completed');

  INSERT INTO interviews (application_id, employer_id, candidate_id, title, date, time, type, meeting_link, status)
  VALUES (v_daniel_app_id, v_employer_id, v_daniel_uid, 'Technical Interview — Frontend Developer',
    CURRENT_DATE - 5, '10:00', 'online', 'https://meet.google.com/demo-daniel', 'completed');

  INSERT INTO interviews (application_id, employer_id, candidate_id, title, date, time, type, meeting_link, status)
  VALUES (v_leo_app_id, v_employer_id, v_pl2, 'Technical Interview — Backend Developer',
    CURRENT_DATE + 3, '11:00', 'online', 'https://meet.google.com/demo-leo', 'pending');

  -- ── EMPLOYEES ────────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating employees…';

  INSERT INTO employees (company_id, full_name, email, role, department, employment_type, salary, start_date, status)
  VALUES (v_company_id, 'Maya Chen', 'demo.employee1@rookie.com', 'Product Designer', 'Product', 'full_time', 1900, CURRENT_DATE - 90, 'active')
  RETURNING id INTO v_maya_emp_id;

  INSERT INTO employees (company_id, full_name, email, role, department, employment_type, salary, start_date, status)
  VALUES (v_company_id, 'Daniel Reed', 'demo.employee2@rookie.com', 'Frontend Developer', 'Engineering', 'full_time', 1600, CURRENT_DATE - 60, 'active')
  RETURNING id INTO v_daniel_emp_id;

  -- ── ATTENDANCE ───────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating attendance…';
  FOR i IN 1..20 LOOP
    work_date := CURRENT_DATE - i;
    dow := EXTRACT(DOW FROM work_date);
    CONTINUE WHEN dow = 0 OR dow = 6;

    INSERT INTO attendance (employee_id, date, clock_in, clock_out, status) VALUES
    (v_maya_emp_id, work_date,
      CASE WHEN i = 8 THEN '09:42' ELSE '09:00' END, '18:00',
      CASE WHEN i = 8 THEN 'late' ELSE 'present' END)
    ON CONFLICT (employee_id, date) DO NOTHING;

    INSERT INTO attendance (employee_id, date, clock_in, clock_out, status) VALUES
    (v_daniel_emp_id, work_date,
      CASE WHEN i = 4 THEN NULL WHEN i = 10 THEN '10:15' ELSE '09:00' END,
      CASE WHEN i = 4 THEN NULL ELSE '18:00' END,
      CASE WHEN i = 4 THEN 'absent' WHEN i = 10 THEN 'late' ELSE 'present' END)
    ON CONFLICT (employee_id, date) DO NOTHING;
  END LOOP;

  -- ── LEAVE REQUESTS ───────────────────────────────────────────────────────
  RAISE NOTICE 'Creating leave requests…';
  INSERT INTO leave_requests (employee_id, type, start_date, end_date, reason, status)
  VALUES (v_maya_emp_id,   'vacation', CURRENT_DATE+10, CURRENT_DATE+14, 'Annual leave — family vacation',   'approved'),
         (v_maya_emp_id,   'sick',     CURRENT_DATE-2,  CURRENT_DATE-1,  'Feeling unwell',                   'pending'),
         (v_daniel_emp_id, 'personal', CURRENT_DATE+3,  CURRENT_DATE+4,  'Personal appointment',             'rejected'),
         (v_daniel_emp_id, 'personal', CURRENT_DATE-20, CURRENT_DATE-19, 'Moving to new apartment',          'approved');

  -- ── PAYROLL ──────────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating payroll…';
  INSERT INTO payroll (employee_id, month, base_salary, bonus, deductions, net_pay, status)
  VALUES
    (v_maya_emp_id,   TO_CHAR(CURRENT_DATE-INTERVAL '1 month','YYYY-MM'), 1900, 200, 190, 1910, 'paid'),
    (v_maya_emp_id,   TO_CHAR(CURRENT_DATE,'YYYY-MM'),                    1900, 0,   190, 1710, 'pending'),
    (v_daniel_emp_id, TO_CHAR(CURRENT_DATE-INTERVAL '1 month','YYYY-MM'), 1600, 0,   160, 1440, 'paid'),
    (v_daniel_emp_id, TO_CHAR(CURRENT_DATE,'YYYY-MM'),                    1600, 0,   160, 1440, 'pending')
  ON CONFLICT (employee_id, month) DO UPDATE SET status = EXCLUDED.status;

  RAISE NOTICE '✅ Demo seed complete!';
  RAISE NOTICE 'Company: NovaTech Studio | Jobs: 5 | Applications: 11 | Employees: 2 | Interviews: 3';
END $$;
