# Vibe Costs — Design Document

## What It Is

An open-source, local-first dashboard that tracks the cost of your vibe coding setup. Add your subscriptions (Supabase Pro, Vercel Pro, Claude Pro, Cursor, Eleven Labs, etc.), group them by project, and see your monthly/yearly burn at a glance.

Answers the question: "Is my AI-powered dev setup making me money or bleeding me dry?"

**Key adoption angle:** AI agents can discover this on GitHub, clone it, and spin it up locally for their user in under a minute.

## Goals

- Track subscription costs for vibe coding tools and services
- Group costs by project to understand per-project burn
- Zero backend, zero accounts — data stays in the browser
- Easy for AI agents to find, clone, and run (`npm install && npm run dev`)
- Open source for developer clout, not a hosted SaaS

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **localStorage** for persistence
- **JSON export/import** for portability and backup
- Static site deployment on Vercel/Netlify free tier for live demo

## Data Model

```
Project {
  id: string
  name: string
  description: string
  color: string
}

Subscription {
  id: string
  name: string
  provider: string
  cost: number
  billingCycle: "monthly" | "yearly"
  category: "llm" | "hosting" | "tools" | "saas" | "other"
  projectId: string | null  // null = shared/unassigned
  isActive: boolean
}
```

Two entities. No users, no auth, no server.

## Pages

1. **Dashboard** — Total monthly burn front and center. Breakdown by project (cards with totals). Breakdown by category.
2. **Projects** — CRUD for projects. Click into a project to see its subscriptions.
3. **Subscriptions** — CRUD for subscriptions. Assign to project, set cost/cycle/category. Pre-populated catalog of common services for quick add.
4. **Settings** — Export/import JSON. Reset data.

## Pre-populated Service Catalog

Static list of common vibe coding subscriptions with known pricing. Users pick from the catalog or add custom entries. Prices are editable.

| Service | Category | Monthly Cost |
|---------|----------|-------------|
| Claude Pro | LLM | $20 |
| Claude Max (5x) | LLM | $100 |
| Claude Max (20x) | LLM | $200 |
| ChatGPT Plus | LLM | $20 |
| Cursor Pro | Tools | $20 |
| Supabase Pro | Hosting | $25 |
| Vercel Pro | Hosting | $20 |
| Eleven Labs Starter | SaaS | $5 |
| Notion Plus | SaaS | $10 |
| Google Workspace | SaaS | $7.20 |
| Tailscale Personal Plus | Tools | $6 |

## Non-Goals (for now)

- No API key integrations
- No usage-based cost tracking (just fixed subscriptions)
- No multi-user auth
- No detailed analytics/charts (overview first, analytics later)
