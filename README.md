# VisaPath AI

VisaPath AI is a full-stack SaaS platform for technology professionals who want to find, evaluate, and track visa-sponsored opportunities across Europe, North America, and Australia.

The product includes:

- Visa-sponsored job search and filtering
- AI resume parsing and match scoring
- Kanban application tracking
- Follow-up reminders and generated recruiter emails
- Cover letter generation
- Sponsorship company intelligence
- Saved searches and notifications
- Executive analytics dashboards

## Stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, shadcn/ui-style components, React Query, Zustand, NextAuth/Auth.js, Recharts, Framer Motion
- **Backend:** NestJS, PostgreSQL, Prisma ORM, JWT auth, RBAC, throttling, DTO validation
- **AI/Integrations:** OpenAI, Resend, PDF parsing
- **Deployment:** Docker, Vercel frontend, Railway/Render backend

## Quick Start

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

The frontend runs on `http://localhost:3000` and the API runs on `http://localhost:4000`.

## Docker

```bash
docker compose up --build
```

## Repository Layout

```text
apps/
  api/     NestJS API, Prisma schema, services, workers
  web/     Next.js application
packages/
  shared/  Shared country, visa, skill, and DTO types
```

## Production Configuration

See `docs/deployment.md` for deployment, secrets, database, and operational guidance.
