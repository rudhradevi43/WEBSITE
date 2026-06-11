# Deployment Guide

## Required Services

- PostgreSQL 15+ (Railway, Render, Supabase, Neon, or managed cloud Postgres)
- Backend host for the NestJS API (Railway or Render)
- Vercel project for the Next.js frontend
- Resend API key for transactional email
- OpenAI API key for AI matching, recommendations, and cover letters

## Backend Environment

Set these variables in Railway or Render:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
API_PORT=4000
FRONTEND_URL=https://your-vercel-domain.vercel.app
JWT_SECRET=<64+ random chars>
JWT_EXPIRES_IN=7d
PASSWORD_PEPPER=<64+ random chars>
UPLOAD_DIR=uploads
OPENAI_API_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=VisaPath AI <notifications@yourdomain.com>
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

Run migrations during deploy:

```bash
npm run prisma:migrate --workspace @visapath/api
```

## Frontend Environment

Set these variables in Vercel:

```bash
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=<64+ random chars>
NEXT_PUBLIC_API_URL=https://your-api-domain
```

## Docker Images

The repository includes production Dockerfiles for both applications and a local `docker-compose.yml` for API, web, and Postgres.

## Security Checklist

- Use HTTPS-only production domains
- Rotate secrets before first production launch
- Configure database backups
- Restrict CORS to production frontend origins
- Configure Resend domain authentication
- Use a private object store for uploaded resumes in production
- Enable host-level request logging and alerting
- Review audit logs for auth and application status changes

## Notes on Job Sources

The job search service uses adapter interfaces for LinkedIn, Indeed, EURES, UK sponsors, Job Bank Canada, SEEK Australia, and company career pages. Production deployments should use approved APIs or licensed data providers for sources whose terms prohibit scraping.
