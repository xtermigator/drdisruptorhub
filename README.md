# Dr. Disruptor Super Brain

A private, touch-first personal command center built with Next.js, TypeScript, Tailwind CSS, and server-side integration boundaries for AI, sports, and Notion.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The demo runs without credentials and uses safe fallback data.

## Environment variables

See `.env.example`. Credentials are only read by server route handlers. Set `NEXT_PUBLIC_DEMO_MODE=false` and configure authentication before exposing a deployment publicly.

## Architecture

- `app/` contains the App Router shell and server-only API routes.
- `components/` contains independently embeddable feature modules.
- `lib/` contains typed domain models, sample/fallback data, and provider boundaries.
- `supabase/schema.sql` contains the initial relational data model and row-level-security policies.
