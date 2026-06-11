# VisaPath AI

VisaPath AI is a full-stack SaaS platform for technology professionals who need to find, evaluate, and track visa-sponsored roles across the United Kingdom, Germany, Netherlands, Ireland, Sweden, Denmark, Norway, Finland, Switzerland, Austria, Belgium, France, Canada, and Australia.

The default candidate profile is optimized for Power Platform, Power BI, data analytics, Microsoft 365, Python automation, and ETL roles while remaining configurable for any user.

## Tech stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, shadcn-style UI primitives, React Query, Zustand, Framer Motion, Recharts, Auth.js
- **Backend:** NestJS, PostgreSQL, Prisma ORM, JWT auth, RBAC, DTO validation, rate limiting
- **AI and email:** OpenAI API, Resend
- **Deployment:** Docker Compose locally, Vercel for web, Railway/Render for API and PostgreSQL

## Repository structure

```txt
apps/
  api/                 NestJS API, Prisma schema, seed data, Dockerfile
  web/                 Next.js app router frontend, Auth.js, UI components
docker-compose.yml     Local full-stack runtime
package.json           npm workspace root
tsconfig.base.json     Shared TypeScript settings
.env.example           Required environment variables
```

## Core capabilities

- Visa-sponsored job search with filters for sponsorship, salary, country, remote mode, job type, and experience level
- Resume PDF upload and structured parsing for skills, certifications, experience, and education
- AI match scoring with matched skills, missing skills, and upskilling recommendations
- Kanban application tracker with Saved, Applied, Interview, Technical Round, Final Round, Offer, Rejected, and Visa Processing columns
- Automatic follow-up detection after 7 days without contact and generated recruiter email copy
- AI cover letter generation with personalized, ATS-optimized, concise, and detailed variants
- Sponsorship company database with visa programs, sponsorship history, hiring frequency, tech stack, and confidence score
- Analytics dashboard for applications by country/status, interview rate, response rate, offer rate, visa sponsorship success rate, and monthly activity
- Saved searches with daily/weekly scheduling metadata
- Email notification service boundary using Resend

## Local setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up postgres -d
   ```

4. Generate Prisma client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. Start both apps:

   ```bash
   npm run dev
   ```

Frontend: <http://localhost:3000>  
Backend: <http://localhost:4000/api>

## Docker Compose

Run the full stack:

```bash
docker compose up --build
```

The API container runs Prisma migrations before starting.

## API overview

All protected routes require:

```txt
Authorization: Bearer <jwt>
```

Important endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/companies/sponsors`
- `GET /api/countries`
- `POST /api/resumes`
- `POST /api/ai/match`
- `POST /api/ai/cover-letter`
- `POST /api/ai/recommendations`
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `GET /api/applications/follow-ups`
- `GET /api/analytics`
- `GET /api/notifications`
- `GET /api/saved-searches`
- `POST /api/saved-searches`

## Security controls

- JWT access tokens through NestJS Passport strategy
- Auth.js credentials integration on the web app
- Role metadata and RBAC guard
- Global DTO validation with whitelist/forbid unknown fields
- Rate limiting via `@nestjs/throttler`
- Helmet security headers and CORS allowlist
- PDF upload MIME and size validation
- Prisma ownership checks on user-owned resources
- Audit log model ready for write-event capture

## Deployment

### Vercel web

Set the project root to `apps/web` and configure:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_API_URL`
- `API_BASE_URL`

Build command:

```bash
npm run build
```

### Railway or Render API

Set the service root to `apps/api` or use `apps/api/Dockerfile`.

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `OPENAI_API_KEY` (optional)
- `RESEND_API_KEY` (optional)
- `RESEND_FROM` (optional)

Release command:

```bash
npm run prisma:deploy
```

Start command:

```bash
npm run start
```

## Production notes

- Replace demo job-source adapters with approved provider APIs or licensed scraping/data partners before production use.
- Use private object storage for uploaded resumes and store only signed URLs in `Resume.fileUrl`.
- Add background workers for scheduled saved searches and notification delivery.
- Connect audit logging to mutating controller paths where compliance requires full event history.
