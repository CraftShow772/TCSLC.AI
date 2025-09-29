# TCSLC.AI

AI-native redesign of [tcslc.com](https://tcslc.com) built with Next.js 14, TailwindCSS 4, and shadcn-inspired UI components. The project combines a conversational assistant, intent routing, MDX-driven knowledge, and compliance automation to power production-ready experiences.

## Features

- **Next.js 14 App Router** with strict TypeScript, Turbopack dev/build scripts, and hardened security headers.
- **Tailwind + shadcn design system** providing reusable buttons, cards, and glass panels aligned to the TCSLC visual language.
- **MDX content layer** (Contentlayer) for prompts 1–10, wiring documentation directly into the assistant UI.
- **Assistant workspace** featuring streaming-style responses, intent confidence summaries, and analytics hooks.
- **Intent router** mapping natural language to workflows spanning portals, compliance, analytics, and delivery.
- **External portal wrappers** to safely launch third-party tools with telemetry and availability signals.
- **Smart checklists** that honor dependencies and auto-complete tasks using compliance and analytics context.
- **Compliance modules** modelling privacy scores, mitigations, and governance status with reusable helpers.
- **Locations hub** highlighting studio capabilities, availability, and routing into the assistant.
- **Analytics hooks & hardening** ensuring privacy-conscious telemetry plus global security headers, typed routes, and strict build settings.

## Getting started

```bash
pnpm install
pnpm dev
```

The `prepare` script builds the content layer, so installing dependencies or running `pnpm prepare` will generate typed MDX data.

Run linting and type checks:

```bash
pnpm lint
pnpm typecheck
```

## Project structure

- `src/app` – App Router pages, including the assistant-led homepage and `/locations` hub.
- `src/components` – UI primitives, assistant workspace, portal wrappers, checklists, and MDX helpers.
- `src/data` – Structured data for portals, checklists, and locations.
- `src/hooks` – Analytics provider and hooks.
- `src/lib` – Intent router, utility helpers.
- `src/modules/compliance` – Privacy and governance modules powering compliance snapshots.
- `content/` – MDX prompt documentation compiled via Contentlayer.

## Environment

- Node 20+
- pnpm 8+

No binary assets are committed; replace the placeholder favicon before production launch.
