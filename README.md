# TCSLC.AI

AI-native redesign of tcslc.com built with Next.js 15, TypeScript, Tailwind CSS, and mdx-powered content.

## Getting started

```bash
pnpm install
pnpm dev
```

## Project structure

- `src/app` – App Router routes, layouts, and global styles.
- `src/lib/content.ts` – Utilities for loading MDX content from `src/content`.
- `src/content` – Source directory for MDX insights (keep `.mdx` files here).
- `public` – Static assets served at the root path.

## Available scripts

- `pnpm dev` – Start the Next.js development server with Turbopack.
- `pnpm build` – Create an optimized production build.
- `pnpm start` – Run the production server.
- `pnpm lint` – Lint all files with ESLint.
