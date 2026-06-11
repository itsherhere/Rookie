import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rookie API',
      version: '1.0.0',
      description:
        'HR OS for startup teams. Manage hiring, candidates, employees, attendance, leave, and payroll in one API.',
      contact: { name: 'Rookie', url: 'https://rookie.so' },
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Local development' },
      { url: 'https://rookie-api.railway.app', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk JWT token — get it from `await getToken()` in the frontend.',
        },
      },
      schemas: {
        // ─── Common ──────────────────────────────────────────────────────────
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Something went wrong' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation failed' },
            details: {
              type: 'object',
              example: { email: ['Invalid email'], role: ['Required'] },
            },
          },
        },
        // ─── Users ───────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user_2abc...' },
            email: { type: 'string', example: 'alex@nova.co' },
            role: { type: 'string', enum: ['employer', 'candidate', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Company ─────────────────────────────────────────────────────────
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Nova Labs' },
            industry: { type: 'string', example: 'Fintech' },
            size: { type: 'string', example: '10-50' },
            website: { type: 'string', example: 'https://nova.co' },
            description: { type: 'string' },
            location: { type: 'string', example: 'Tehran, Iran' },
          },
        },
        // ─── Job ─────────────────────────────────────────────────────────────
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Senior Frontend Developer' },
            description: { type: 'string' },
            location: { type: 'string', example: 'Remote' },
            type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'] },
            salary_min: { type: 'number', example: 3000 },
            salary_max: { type: 'number', example: 5000 },
            skills: { type: 'array', items: { type: 'string' }, example: ['React', 'TypeScript', 'Node.js'] },
            status: { type: 'string', enum: ['draft', 'published', 'closed'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Application ─────────────────────────────────────────────────────
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            job_id: { type: 'string', format: 'uuid' },
            candidate_id: { type: 'string' },
            cover_letter: { type: 'string' },
            match_score: { type: 'number', example: 75 },
            status: {
              type: 'string',
              enum: ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'],
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Employee ─────────────────────────────────────────────────────────
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            full_name: { type: 'string', example: 'Sogand Ahmadi' },
            email: { type: 'string', example: 'sogand@nova.co' },
            role: { type: 'string', example: 'Frontend Developer' },
            department: { type: 'string', example: 'Engineering' },
            employment_type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
            salary: { type: 'number', example: 4000 },
            start_date: { type: 'string', format: 'date', example: '2024-01-15' },
            status: { type: 'string', enum: ['active', 'inactive'] },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Service health check' },
      { name: 'Users', description: 'User creation and profile' },
      { name: 'Employers', description: 'Company profile and stats' },
      { name: 'Jobs', description: 'Job listings management' },
      { name: 'Applications', description: 'Candidate applications' },
      { name: 'Candidates', description: 'Candidate profiles' },
      { name: 'Interviews', description: 'Interview scheduling' },
      { name: 'Messages', description: 'Candidate messaging' },
      { name: 'Employees', description: 'Employee management' },
      { name: 'Attendance', description: 'Attendance tracking' },
      { name: 'Leave', description: 'Leave requests' },
      { name: 'Payroll', description: 'Payroll preview' },
      { name: 'Admin', description: 'Platform administration' },
    ],
    paths: {
      // ─── Health ────────────────────────────────────────────────────────────
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          security: [],
          responses: {
            200: {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  example: { status: 'ok', db: 'connected', uptime: '2h 14m 3s', environment: 'production', responseTime: '43ms' },
                },
              },
            },
            503: { description: 'Service degraded (DB unreachable)' },
          },
        },
      },
      // ─── Users ─────────────────────────────────────────────────────────────
      '/api/users': {
        post: {
          tags: ['Users'],
          summary: 'Create user after onboarding',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role', 'email'],
                  properties: {
                    role: { type: 'string', enum: ['employer', 'candidate', 'admin'] },
                    email: { type: 'string', format: 'email' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created' },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          },
        },
      },
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get current authenticated user',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'User not found' },
          },
        },
      },
      // ─── Employers ─────────────────────────────────────────────────────────
      '/api/employers/stats': {
        get: {
          tags: ['Employers'],
          summary: 'Get employer dashboard stats',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Stats',
              content: {
                'application/json': {
                  example: { success: true, data: { company: { id: 'uuid', name: 'Nova Labs' }, totalJobs: 5, publishedJobs: 3, totalApplications: 48 } },
                },
              },
            },
          },
        },
      },
      '/api/employers/company': {
        get: { tags: ['Employers'], summary: 'Get company profile', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Company profile' } } },
        put: {
          tags: ['Employers'],
          summary: 'Create or update company profile',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Company' },
                example: { name: 'Nova Labs', industry: 'Fintech', size: '10-50', website: 'https://nova.co', description: 'We build payment infrastructure.' },
              },
            },
          },
          responses: { 200: { description: 'Company updated' }, 400: { description: 'Validation error' } },
        },
      },
      // ─── Jobs ──────────────────────────────────────────────────────────────
      '/api/jobs/public': {
        get: { tags: ['Jobs'], summary: 'Get all published jobs (public)', security: [], responses: { 200: { description: 'List of published jobs' } } },
      },
      '/api/jobs/employer': {
        get: { tags: ['Jobs'], summary: "Get employer's own jobs", security: [{ BearerAuth: [] }], responses: { 200: { description: 'List of jobs' } } },
      },
      '/api/jobs': {
        post: {
          tags: ['Jobs'],
          summary: 'Create a new job listing',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
                example: { title: 'Senior Frontend Developer', location: 'Remote', type: 'full-time', salary_min: 3000, salary_max: 5000, skills: ['React', 'TypeScript'], status: 'published' },
              },
            },
          },
          responses: { 201: { description: 'Job created' }, 400: { description: 'Validation error' } },
        },
      },
      '/api/jobs/{id}': {
        get: { tags: ['Jobs'], summary: 'Get job by ID', security: [], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'Job detail' }, 404: { description: 'Not found' } } },
        put: { tags: ['Jobs'], summary: 'Update job', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      },
      '/api/jobs/{id}/status': {
        patch: {
          tags: ['Jobs'],
          summary: 'Update job status',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { example: { status: 'published' } } } },
          responses: { 200: { description: 'Status updated' } },
        },
      },
      // ─── Applications ──────────────────────────────────────────────────────
      '/api/applications': {
        post: {
          tags: ['Applications'],
          summary: 'Submit a job application',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { job_id: 'uuid', cover_letter: 'I am excited to apply...' } } },
          },
          responses: { 201: { description: 'Application submitted with match score' }, 400: { description: 'Already applied or validation error' } },
        },
      },
      '/api/applications/my/list': {
        get: { tags: ['Applications'], summary: "Get candidate's own applications", security: [{ BearerAuth: [] }], responses: { 200: { description: 'Applications list with job info' } } },
      },
      '/api/applications/employer/all': {
        get: { tags: ['Applications'], summary: "Get all applications across employer's jobs", security: [{ BearerAuth: [] }], responses: { 200: { description: 'All applications with candidate profiles' } } },
      },
      '/api/applications/{id}/status': {
        patch: {
          tags: ['Applications'],
          summary: 'Update application status',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { example: { status: 'shortlisted' } } } },
          responses: { 200: { description: 'Status updated, email sent to candidate' } },
        },
      },
      // ─── Interviews ────────────────────────────────────────────────────────
      '/api/interviews': {
        post: {
          tags: ['Interviews'],
          summary: 'Schedule an interview',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { application_id: 'uuid', candidate_id: 'user_abc', title: 'Frontend Round 1', date: '2024-03-15', time: '14:00', type: 'online', meeting_link: 'https://meet.google.com/abc' } } },
          },
          responses: { 201: { description: 'Interview scheduled, email sent to candidate' } },
        },
      },
      '/api/interviews/employer': {
        get: { tags: ['Interviews'], summary: "Get employer's scheduled interviews", security: [{ BearerAuth: [] }], responses: { 200: { description: 'Interview list with candidate names' } } },
      },
      '/api/interviews/candidate': {
        get: { tags: ['Interviews'], summary: "Get candidate's interview invitations", security: [{ BearerAuth: [] }], responses: { 200: { description: 'Interview invites' } } },
      },
      '/api/interviews/{id}/respond': {
        patch: {
          tags: ['Interviews'],
          summary: 'Accept or decline an interview',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { example: { status: 'accepted' } } } },
          responses: { 200: { description: 'Response recorded' } },
        },
      },
      // ─── Employees ─────────────────────────────────────────────────────────
      '/api/employees': {
        get: { tags: ['Employees'], summary: "Get all employees", security: [{ BearerAuth: [] }], responses: { 200: { description: 'Employee list' } } },
        post: {
          tags: ['Employees'],
          summary: 'Add an employee',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' }, example: { full_name: 'Sogand Ahmadi', email: 'sogand@nova.co', role: 'Frontend Developer', department: 'Engineering', employment_type: 'full-time', salary: 4000, start_date: '2024-01-15' } } },
          },
          responses: { 201: { description: 'Employee added' }, 400: { description: 'Validation error' } },
        },
      },
      // ─── Payroll ───────────────────────────────────────────────────────────
      '/api/payroll': {
        get: {
          tags: ['Payroll'],
          summary: 'Get monthly payroll summary',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Payroll breakdown with gross, tax, and net per employee',
              content: {
                'application/json': {
                  example: { success: true, data: { employees: [{ full_name: 'Sogand', monthly_gross: 4000, monthly_tax: 600, monthly_net: 3400, annual_gross: 48000 }], totals: { total_monthly_gross: 4000, total_monthly_net: 3400, total_annual: 48000, headcount: 1 } } },
                },
              },
            },
          },
        },
      },
      // ─── Admin ─────────────────────────────────────────────────────────────
      '/api/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Platform-wide stats (admin only)',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Platform stats',
              content: { 'application/json': { example: { success: true, data: { totalUsers: 142, totalCompanies: 28, totalJobs: 95, totalApplications: 631 } } } },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
