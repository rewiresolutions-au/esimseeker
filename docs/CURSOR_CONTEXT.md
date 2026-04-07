# eSIMSeeker — Brand Guidelines & Cursor Deployment Plan

> **How to use this file in Cursor:** Add this file to your project root as `CURSOR_CONTEXT.md` and reference it in your `.cursorrules` file. Cursor will use it as the authoritative context for all code generation, component naming, and architectural decisions.

---

## 1. Brand Identity

### 1.1 Core Identity

| Field | Value |
|---|---|
| **Brand Name** | eSIMSeeker |
| **Tagline** | Stay Connected. Anywhere. Instantly. |
| **Parent Brand** | SeatSeeke (sister product) |
| **Domain** | `esimseeker.com` |
| **Brand Positioning** | An AI-powered global connectivity consultant that guides travellers to the perfect eSIM plan through a low-friction conversational wizard. |

### 1.2 Colour Palette

All Tailwind CSS custom colours must be registered in `tailwind.config.ts` under the `colors` key.

| Role | Colour Name | Hex | Tailwind Key | Usage |
|---|---|---|---|---|
| **Primary Brand** | Terracotta Red | `#C0392B` | `brand-red` | Primary CTA buttons, logo mark, alerts. Shared with SeatSeeke for brand continuity. |
| **Primary UI** | Dark Navy | `#0A192F` | `brand-navy` | Main dark-mode background, header, footer. |
| **Accent** | Teal | `#20B2AA` | `brand-teal` | Active states, AI streaming highlights, success indicators, secondary buttons. |
| **Background** | Paper | `#F8F9FA` | `brand-paper` | Light-mode page backgrounds, chat bubbles. |
| **Text Primary** | White | `#FFFFFF` | — | Typography on dark backgrounds. |
| **Text Secondary** | Slate | `#E2E8F0` | — | Body text on dark backgrounds. |
| **Text Muted** | Cool Grey | `#A0AEC0` | — | Captions, labels, secondary metadata. |

### 1.3 Typography

- **Primary Font:** `Inter` (Google Fonts). Fallback: `Geist`, `system-ui`, `sans-serif`.
- **Heading Weight:** `font-bold` (700). Letter-spacing: `-0.5px` to `-1px`.
- **Body Weight:** `font-normal` (400). Line-height: `1.5` to `1.6`.
- **Monospace (code/data):** `JetBrains Mono` or `Fira Code`.

### 1.4 UI Component Rules

- **Component Library:** Shadcn/UI (built on Radix UI + Tailwind CSS).
- **Border Radius:** `rounded-lg` (8px) for cards and inputs. `rounded-full` for badges and pills.
- **Shadows:** `shadow-sm` for cards. No heavy drop shadows.
- **Spacing:** Use Tailwind's default 4px base scale. Prefer `gap-4`, `gap-6`, `p-4`, `p-6`.
- **Tone:** Soft, approachable, guided. The interface should feel like a knowledgeable travel companion, not a data grid.

### 1.5 Logo Usage Rules

- **Primary Logo:** Horizontal lockup — globe+SIM+wifi icon on the left, wordmark `esimseeker` on the right with `STAY CONNECTED` subtitle.
- **Icon Only:** Globe+SIM+wifi icon for favicons, app icons, and avatar contexts.
- **Minimum Size:** Never render the full logo below 120px wide.
- **Clear Space:** Maintain a minimum clear space equal to the height of the letter "e" in the wordmark on all sides.
- **Do Not:** Stretch, recolour, add drop shadows, or place on a busy background without a solid backing.

---

## 2. System Architecture

### 2.1 Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 15+ | Server Components for pSEO. Edge Runtime for API routes. |
| **Styling** | Tailwind CSS + Shadcn/UI | Latest | Custom brand tokens in `tailwind.config.ts`. |
| **AI SDK** | Vercel AI SDK | 4.0 | `useChat` hook for the wizard. Tool-calling for plan retrieval. |
| **LLM (Primary)** | GPT-4o-mini | — | Low-latency intent extraction and conversational flow. |
| **LLM (Secondary)** | Claude 3.5 Sonnet | — | High-quality recommendation copy generation. |
| **Database** | Supabase (PostgreSQL) | — | Relational data + pgvector for semantic search. |
| **Auth** | Supabase Auth | — | Email magic link + Google OAuth. |
| **Deployment** | Vercel Edge | — | Global sub-100ms latency. |

### 2.2 Project Structure

```
esimseeker/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # Homepage with hero + wizard CTA
│   │   └── esim/
│   │       └── [country]/
│   │           └── page.tsx          # pSEO country landing pages
│   ├── (app)/
│   │   └── wizard/
│   │       └── page.tsx              # Main AI Wizard split-screen UI
│   └── api/
│       ├── chat/route.ts             # Vercel AI SDK streaming endpoint
│       ├── plans/route.ts            # Plan retrieval + affiliate link generation
│       └── cron/sync-plans/route.ts  # Scheduled eSIM Go API sync
├── components/
│   ├── wizard/
│   │   ├── ChatPanel.tsx             # Left panel: chat interface
│   │   ├── ResultsPanel.tsx          # Right panel: live plan results
│   │   └── PlanCard.tsx              # Individual plan result card
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   └── CountryGrid.tsx
│   └── ui/                           # Shadcn/UI components
├── lib/
│   ├── esim-go.ts                    # eSIM Go REST API wrapper
│   ├── affiliate.ts                  # Affiliate link generator middleware
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── ai/
│       ├── system-prompt.ts          # AI wizard system prompt
│       └── tools.ts                  # get_plans() tool definition
├── public/
│   ├── logo.svg                      # Primary horizontal logo
│   ├── icon.svg                      # Square icon for favicon
│   └── brand/                        # Brand assets folder
├── tailwind.config.ts
├── .env.local
└── CURSOR_CONTEXT.md                 # This file
```

---

## 3. AI Wizard: System Prompt & Tool Definitions

### 3.1 System Prompt (`lib/ai/system-prompt.ts`)

```typescript
export const SYSTEM_PROMPT = `
You are the eSIMSeeker AI — a friendly, knowledgeable travel connectivity consultant.
Your goal is to help travellers find the perfect eSIM plan through a short, friendly conversation.

RULES:
1. Ask only ONE question at a time. Never overwhelm the user.
2. Your first message is always: "Where are you flying to? 🌍"
3. Extract the following information through natural conversation:
   - destination (ISO country code or region)
   - duration_days (integer)
   - data_persona: "Budget" | "Balanced" | "Heavy" | "Unlimited"
   - device_compatibility: "iPhone" | "Android" | "Other"
   - needs_voice: boolean
4. Once ALL fields are populated, call the get_plans() tool immediately.
5. Do NOT show the raw JSON to the user. Present results conversationally.
6. After showing results, ask: "Would you like me to compare these plans?"

TONE: Warm, concise, expert. Like a well-travelled friend, not a call centre script.
`;
```

### 3.2 Intent Schema & Tool Definition (`lib/ai/tools.ts`)

```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const getPlans = tool({
  description: 'Retrieve eSIM plans matching the user intent. Call this once all intent fields are populated.',
  parameters: z.object({
    destination: z.string().describe('ISO 3166-1 alpha-2 country code, e.g. "JP" for Japan'),
    duration_days: z.number().int().min(1).max(365),
    data_persona: z.enum(['Budget', 'Balanced', 'Heavy', 'Unlimited']),
    device_compatibility: z.enum(['iPhone', 'Android', 'Other']),
    needs_voice: z.boolean(),
  }),
  execute: async (params) => {
    // Call the /api/plans endpoint with the extracted params
    const res = await fetch(`/api/plans?${new URLSearchParams(params as any)}`);
    return res.json();
  },
});
```

---

## 4. Database Schema (Supabase)

Run these SQL migrations in the Supabase SQL Editor in order.

### Migration 001: Enable pgvector

```sql
create extension if not exists vector;
```

### Migration 002: Core Tables

```sql
-- Countries
create table countries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  iso_code    char(2) unique not null,
  region      text,
  created_at  timestamptz default now()
);

-- Providers
create table providers (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  base_commission_pct numeric(5,2),
  affiliate_platform  text,  -- 'impact' | 'direct'
  affiliate_base_url  text,
  created_at          timestamptz default now()
);

-- Plans
create table plans (
  id              uuid primary key default gen_random_uuid(),
  provider_id     uuid references providers(id),
  country_iso     char(2) references countries(iso_code),
  data_gb         numeric(6,2),
  validity_days   int,
  price_usd       numeric(8,2),
  supports_voice  boolean default false,
  network_type    text,  -- '4G' | '5G' | '4G/5G'
  buy_url         text,
  last_synced_at  timestamptz default now(),
  created_at      timestamptz default now()
);

-- Plan Embeddings (pgvector)
create table plan_embeddings (
  plan_id   uuid primary key references plans(id) on delete cascade,
  embedding vector(1536)
);

create index on plan_embeddings using ivfflat (embedding vector_cosine_ops);
```

### Migration 003: Row Level Security

```sql
alter table plans enable row level security;
create policy "Public read access" on plans for select using (true);

alter table plan_embeddings enable row level security;
create policy "Public read access" on plan_embeddings for select using (true);
```

---

## 5. Affiliate Link Generator (`lib/affiliate.ts`)

```typescript
const AFFILIATE_TOKENS: Record<string, string> = {
  airalo:  'esimseeker_airalo_ref',
  nomad:   'esimseeker_nomad_ref',
  holafly: 'esimseeker_holafly_ref',
};

export function buildAffiliateUrl(baseUrl: string, provider: string): string {
  const token = AFFILIATE_TOKENS[provider.toLowerCase()];
  if (!token) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set('ref', token);
  return url.toString();
}
```

---

## 6. Programmatic SEO (pSEO) Engine

### 6.1 Route Configuration (`app/(marketing)/esim/[country]/page.tsx`)

```typescript
import { createServerClient } from '@/lib/supabase/server';

export async function generateStaticParams() {
  const supabase = createServerClient();
  // Pre-render the top 50 countries at build time
  const { data } = await supabase
    .from('countries')
    .select('iso_code')
    .order('traffic_rank', { ascending: true })
    .limit(50);
  return data?.map(c => ({ country: c.iso_code.toLowerCase() })) ?? [];
}

// Remaining 150+ countries are generated on-demand and edge-cached
export const dynamicParams = true;
export const revalidate = 86400; // Re-validate every 24 hours
```

### 6.2 Target URL Patterns

| Pattern | Example | Intent |
|---|---|---|
| `/esim/[country]` | `/esim/japan` | Primary country page |
| `/esim/[country]-for-[activity]` | `/esim/japan-for-digital-nomads` | Activity-specific |
| `/esim/[country]-for-[duration]` | `/esim/thailand-for-30-days` | Duration-specific |
| `/esim/[region]` | `/esim/europe` | Regional multi-country |

---

## 7. Environment Variables (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# eSIM Go API
ESIM_GO_API_KEY=
ESIM_GO_BASE_URL=https://api.esim-go.com/v2.3

# Affiliate
IMPACT_API_KEY=
IMPACT_ACCOUNT_SID=

# App
NEXT_PUBLIC_SITE_URL=https://esimseeker.com
CRON_SECRET=
```

---

## 8. Six-Week Deployment Roadmap

### Phase 1 — Foundation (Weeks 1–2)

| # | Task | File(s) |
|---|---|---|
| 1 | Initialise Next.js 15 project with Tailwind CSS + Shadcn/UI | `package.json`, `tailwind.config.ts` |
| 2 | Register brand colour tokens in Tailwind config | `tailwind.config.ts` |
| 3 | Set up Supabase project and run all 3 SQL migrations | Supabase Dashboard |
| 4 | Build eSIM Go API wrapper | `lib/esim-go.ts` |
| 5 | Build affiliate link generator middleware | `lib/affiliate.ts` |
| 6 | Create cron job to sync plans daily | `app/api/cron/sync-plans/route.ts` |

### Phase 2 — The AI Wizard (Weeks 3–4)

| # | Task | File(s) |
|---|---|---|
| 7 | Configure Vercel AI SDK `useChat` hook | `app/(app)/wizard/page.tsx` |
| 8 | Write the system prompt and tool definitions | `lib/ai/system-prompt.ts`, `lib/ai/tools.ts` |
| 9 | Build the streaming chat API route | `app/api/chat/route.ts` |
| 10 | Build the Split-Screen UI (ChatPanel + ResultsPanel) | `components/wizard/` |
| 11 | Build the PlanCard component with affiliate CTA | `components/wizard/PlanCard.tsx` |
| 12 | Implement smooth card-slides-into-chat animation | `components/wizard/ChatPanel.tsx` |

### Phase 3 — pSEO & Launch (Weeks 5–6)

| # | Task | File(s) |
|---|---|---|
| 13 | Build dynamic country page template | `app/(marketing)/esim/[country]/page.tsx` |
| 14 | Implement `generateStaticParams` for top 50 countries | Same as above |
| 15 | Build internal linking component to SeatSeeke | `components/marketing/SeatSeekerLink.tsx` |
| 16 | Configure Vercel deployment settings and Edge Runtime | `vercel.json` |
| 17 | Run Lighthouse performance audit (target: 95+ score) | — |
| 18 | Production launch to `esimseeker.com` | — |

---

## 9. Key Performance Targets

| Metric | Target |
|---|---|
| **Wizard CTR to affiliate** | ≥ 15% |
| **Page Load (LCP)** | < 1.2s on Edge |
| **Lighthouse Score** | ≥ 95 |
| **pSEO Pages at Launch** | 200+ country routes |
| **Plan Catalogue Size** | 500+ plans across all providers |
| **Time to First Byte (TTFB)** | < 100ms globally via Vercel Edge |
