# TCSLC.AI

A production-ready Next.js 14 + TypeScript experience for the Tallahassee Community Services Licensing Commission (TCSLC). The project delivers an AI-native redesign that fuses MDX content, local vector search, and a compliant conversational assistant.

## Features

- **Next.js 14 + App Router** with strict TypeScript configuration, Tailwind CSS, shadcn-inspired UI primitives, and Prettier/ESLint integration.
- **Content layer powered by MDX** for services, FAQs, documents, and fee tables—each surfaced in dedicated pages and indexed for grounding.
- **Conversational assistant** with a floating launcher, drawer UI, streaming responses, citations, guardrails, and intent-aware quick actions.
- **Intent router** that maps user utterances to renewals, tax payments, title transfers, and new business flows with actionable cards.
- **Portal wrappers** that stage requirements (e.g., MyEasyGov, MyFloridaLicense) and emit analytics before redirecting to external systems.
- **Smart checklists and document helper** components covering renewals, transfers, and startups with PDF upload/extraction stubs.
- **Compliance modules** including a "Why you’re seeing this" explainer, audit logging via SQLite/Prisma, and privacy/accessibility placeholders.
- **Locations hub** with office cards and wait-time integration stubs ready for partner APIs.
- **Analytics pipeline** logging assistant usage, intent resolutions, and portal exits through hardened API routes with rate limiting.
- **Production hardening** covering environment validation, CSP headers, strict CORS defaults, audit logging, and global error boundaries.

## Getting started

```bash
pnpm install
pnpm prisma generate
pnpm dev
```

The development server runs at [http://localhost:3000](http://localhost:3000). The assistant drawer appears in the lower-right corner.

## Project structure

```
content/             # MDX content powering services, FAQs, documents, and fees
prisma/              # Prisma schema for SQLite audit and analytics tables
src/app/             # App Router routes, API handlers, and layouts
src/components/      # UI primitives, assistant, checklists, compliance, and portal components
src/lib/             # Environment validation, Prisma client, intent router, vector search, guardrails, rate limiting
src/styles/          # Tailwind design tokens and global styles
```

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

- `DATABASE_URL` – SQLite connection string (defaults to `file:./prisma/data.db`).
- `NEXT_PUBLIC_SITE_URL` – Base URL used for security headers.
- `ANALYTICS_WRITE_KEY` – Optional key for downstream integrations.

## Tooling

- **Prisma** handles audit log and analytics event persistence.
- **Tailwind CSS** powers utility-first styling with custom design tokens.
- **next-mdx-remote** compiles MDX content for rich, maintainable knowledge bases.

## Deployment considerations

- Run `pnpm prisma migrate deploy` during deployment to ensure the SQLite schema is current.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin so CSP headers match your domain.
- Configure background jobs for wait-time ingestion and PDF extraction once partner APIs are available.
