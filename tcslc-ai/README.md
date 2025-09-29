# TC SLC AI Redesign

An AI-native redesign of [tcslc.com](https://tcslc.com) built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui patterns.

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `pnpm dev` – Start the local development server.
- `pnpm build` – Build the production bundle.
- `pnpm start` – Start the production server.
- `pnpm lint` – Lint the codebase using ESLint.
- `pnpm typecheck` – Run TypeScript for static type checking.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS + shadcn/ui components
- pnpm for fast dependency management

## Project Structure

```
src/
  app/        # App Router routes and layout
  components/ # Shared UI building blocks
  lib/        # Configuration and utilities
```

## Deployment

The project is configured for automated CI with GitHub Actions to lint, type-check, and build on every push and pull request.

---

Crafted with a focus on accessibility, performance, and intelligent user journeys for the TC SLC community.
