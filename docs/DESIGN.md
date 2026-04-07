# eSIMSeeker — Complete Design Document & Cursor Build Guide

**Version:** 1.0 | **Author:** eSIMSeeker Design Team | **Status:** Ready for Development

> **How to use this in Cursor:** Save this file as `DESIGN.md` in your project root. Reference it with `@DESIGN.md` in your Cursor prompt to give the AI full context on every page, component, and design decision before generating any code.

---

## 1. Project Overview

eSIMSeeker is a minimalist, AI-powered eSIM comparison platform. Travellers describe their trip in a conversational chat interface, and the AI recommends the top 3 eSIM plans from a live catalogue of 500+ options across providers including Airalo, Holafly, Nomad, and eSIM Go. Revenue is generated exclusively through affiliate commissions. The design philosophy prioritises trust, simplicity, and conversion — in that order.

---

## 2. Design Principles

The entire site must adhere to four non-negotiable design principles. **Minimalism** means every element on screen must earn its place; if it doesn't guide the user toward a plan purchase, it should be removed. **Trust** means the site must look and feel like a credible, independent resource — not a spam affiliate farm. This is achieved through transparent affiliate disclosure, clean typography, and a professional "About Us" page. **Performance** means every page must load in under 1.2 seconds on a mobile connection, which dictates the use of Server Components, edge caching, and no heavy client-side JavaScript on SEO pages. **Conversion** means the path from landing to clicking an affiliate link must be as short as possible — ideally three interactions: destination input, data preference selection, plan click.

---

## 3. Brand Tokens (Tailwind Config)

Register these in `tailwind.config.ts` before writing any component code.

```typescript
// tailwind.config.ts
colors: {
  brand: {
    red:    '#C0392B',  // Primary CTA, logo mark
    navy:   '#0A192F',  // Headings, footer background
    teal:   '#20B2AA',  // Active states, AI highlights
    paper:  '#F8F9FA',  // Page backgrounds, light sections
    slate:  '#E2E8F0',  // Body text on dark backgrounds
    muted:  '#A0AEC0',  // Captions, labels
  }
}
```

---

## 4. Site Architecture

The site is organised into three functional zones, each with a distinct purpose.

| Zone | Purpose | Pages |
|---|---|---|
| **The Funnel** | Primary conversion path | `/`, `/wizard` |
| **The SEO Engine** | Organic traffic capture | `/destinations`, `/esim/[country]`, `/esim/[region]` |
| **Trust & Legal** | Legitimacy and compliance | `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/affiliate-disclosure` |

---

## 5. Page-by-Page Specifications

### 5.1 Homepage (`/`)

**Purpose:** Convert visitors into Wizard users. The homepage is not a brochure — it is a funnel entry point.

**Sections (in order):**

| # | Section | Component | Key Details |
|---|---|---|---|
| 1 | Navigation | `<Navbar>` | Logo left, nav links centre, `Find My eSIM` CTA button right (brand-red). Sticky on scroll. |
| 2 | Hero | `<Hero>` | H1: "Find the Perfect eSIM in 30 Seconds." Inline chat input. 3 quick-reply destination chips. Provider logo strip below. |
| 3 | How It Works | `<HowItWorks>` | 3-column layout. Steps: Chat → Compare → Connect. Icon + title + 2-line description per step. |
| 4 | Popular Destinations | `<DestinationGrid>` | 3×2 grid of country cards. Each card: flag, country name, plan count. Links to `/esim/[country]`. |
| 5 | Trust Banner | `<TrustBanner>` | Full-width light grey band. "Trusted by 10,000+ travellers." 5-star rating. One testimonial quote. |
| 6 | Footer | `<Footer>` | Dark navy. 4 columns: Logo+tagline, Nav links, Legal links, Newsletter signup. |

**Hero Component Detail:**
The chat input in the hero is not a full wizard — it is a single-field entry point. When the user types a destination and presses Enter (or clicks the send button), they are navigated to `/wizard?destination=[value]` with the destination pre-populated. The quick-reply chips (e.g., "Japan", "Thailand", "Europe") do the same thing on click.

---

### 5.2 AI Wizard (`/wizard`)

**Purpose:** The primary conversion engine. Guide the user to a plan purchase in under 60 seconds.

**Layout:** Split-screen on desktop (chat left, results right). Single-column stacked on mobile (results appear below chat after plans are found).

**Sections:**

| # | Section | Component | Key Details |
|---|---|---|---|
| 1 | Minimal Nav | `<WizardNav>` | Logo only on left. "Back to Home" text link on right. No other distractions. |
| 2 | Chat Panel | `<ChatPanel>` | Scrollable chat history. AI bubbles left-aligned (light grey bg). User bubbles right-aligned (navy bg, white text). Quick-reply chips after each AI question. Text input + send button at bottom. |
| 3 | Results Panel | `<ResultsPanel>` | Appears once AI has extracted destination + duration + data preference. Shows top 3 `<PlanCard>` components. "See all X plans" link below. |
| 4 | Trust Bar | `<TrustBar>` | Slim full-width footer bar. Affiliate disclosure text. Info icon linking to `/affiliate-disclosure`. |

**PlanCard Component Detail:**

```
┌─────────────────────────────────────────────┐
│ [Provider Logo]  Plan Name        [Badge]   │
│ ─────────────────────────────────────────── │
│ 10 GB Data  │  14 Days  │  $18.00           │
│ ─────────────────────────────────────────── │
│ ✦ Why this fits you: Perfect for moderate   │
│   data use in Japan for 2 weeks.            │
│ ─────────────────────────────────────────── │
│          [ Get This Plan → ]                │
└─────────────────────────────────────────────┘
```

Badges: `Best Value` (dark navy bg), `Best Speed` (teal bg), `Most Data` (grey bg).

---

### 5.3 Country Landing Page (`/esim/[country]`)

**Purpose:** Rank for "[Country] eSIM" keywords. Convert organic search traffic into Wizard users or direct affiliate clicks.

**Sections:**

| # | Section | Component | Key Details |
|---|---|---|---|
| 1 | Nav | `<Navbar>` | Same as homepage. |
| 2 | Page Hero | `<PageHero>` | Breadcrumb. H1: "Best eSIM Plans for [Country] ([Year])". Subheadline with plan count. 3 stat badges: plan count, lowest price, network type. CTA: "Let AI Pick My Plan". |
| 3 | Filter Bar | `<FilterBar>` | Dropdowns: Duration, Data, Provider, Sort By. Reset Filters link. |
| 4 | Comparison Table | `<PlanTable>` | Columns: Provider, Data, Duration, Price, Network, Rating, Action. Sortable. "Best Value" badge on top row. "View Plan" button (affiliate link) in Action column. |
| 5 | AI Upsell Banner | `<AIBanner>` | Light terracotta-tinted band. Robot icon. "Not sure? Let our AI recommend." CTA: "Chat with AI" → `/wizard?destination=[country]`. |
| 6 | SEO Content | `<SEOContent>` | Two-column text. Left: "About eSIMs in [Country]" (3 paragraphs). Right: "How to Activate Your eSIM in [Country]" (numbered steps). |
| 7 | Footer | `<Footer>` | Same as homepage. |

**Rendering Strategy:**
- Top 50 countries: `generateStaticParams` (pre-rendered at build time).
- Remaining 150+ countries: `dynamicParams = true`, `revalidate = 86400` (on-demand + 24h cache).

---

### 5.4 Destinations Hub (`/destinations`)

**Purpose:** SEO directory page and internal linking hub.

**Sections:**

| # | Section | Component | Key Details |
|---|---|---|---|
| 1 | Nav | `<Navbar>` | Same as homepage. |
| 2 | Page Hero | `<PageHero>` | H1: "eSIM Plans for Every Destination". Country search input. |
| 3 | Region Filter Tabs | `<RegionTabs>` | Pills: All, Asia, Europe, Americas, Middle East, Africa, Oceania. Active pill: navy fill. |
| 4 | Country Grid | `<CountryGrid>` | 4-column grid. Each card: flag, country name, plan count. "Load All Countries" button. |
| 5 | Popular Regions | `<RegionCards>` | 3-column. Region name, short description, "Browse Plans" link. |
| 6 | Footer | `<Footer>` | Same as homepage. |

---

### 5.5 About Us (`/about`)

**Purpose:** Establish credibility and satisfy Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) requirements.

**Sections:**

| # | Section | Key Details |
|---|---|---|
| 1 | Page Hero | H1: "Built by Travellers, for Travellers." Origin story subheadline. |
| 2 | Our Mission | Two-column: team/travel photo left, 3 paragraphs of mission text right. |
| 3 | Affiliate Disclosure | Full-width light grey band. Handshake icon. Transparent explanation of the commission model. "Affiliate Disclosure" badge. |
| 4 | How We Rank Plans | 3-column criteria cards: Real-Time Pricing, Network Coverage Data, User Reviews. |
| 5 | The Team | 3-column grid of team member cards (avatar, name, title). |
| 6 | Footer | Same as homepage. |

---

### 5.6 Contact (`/contact`)

**Purpose:** Provide a legitimate support channel and satisfy Google's trust signals.

**Layout:** Two-column. Contact form on the left, contact info blocks on the right.

**Form Fields:** Name, Email, Subject (dropdown), Message (textarea), Submit button.

**Contact Info Blocks:** Email address, Response time, Coverage note.

**Below form:** FAQ shortcut banner linking to `/faq`.

---

### 5.7 FAQ (`/faq`)

**Purpose:** Reduce support load and capture "eSIM how to" search queries.

**Sections:** Page hero with search input. Category filter pills (All, eSIM Basics, Compatibility, Activation, Billing). Accordion list of 20+ questions. "Still have questions?" CTA block at the bottom.

---

## 6. Component Library

All components use Shadcn/UI as the base. The following custom components must be built.

| Component | File Path | Description |
|---|---|---|
| `<Navbar>` | `components/layout/Navbar.tsx` | Sticky top navigation with logo, links, and CTA. |
| `<WizardNav>` | `components/layout/WizardNav.tsx` | Minimal nav for the Wizard page. |
| `<Footer>` | `components/layout/Footer.tsx` | Dark navy footer with 4-column layout. |
| `<Hero>` | `components/marketing/Hero.tsx` | Homepage hero with inline chat input. |
| `<ChatPanel>` | `components/wizard/ChatPanel.tsx` | Scrollable chat interface with AI/user bubbles. |
| `<ResultsPanel>` | `components/wizard/ResultsPanel.tsx` | Live results panel with plan cards. |
| `<PlanCard>` | `components/wizard/PlanCard.tsx` | Individual plan result card with affiliate CTA. |
| `<PlanTable>` | `components/plans/PlanTable.tsx` | Sortable comparison table for country pages. |
| `<FilterBar>` | `components/plans/FilterBar.tsx` | Filter dropdowns for country pages. |
| `<AIBanner>` | `components/marketing/AIBanner.tsx` | AI upsell banner for country pages. |
| `<TrustBanner>` | `components/marketing/TrustBanner.tsx` | Social proof banner for homepage. |
| `<TrustBar>` | `components/wizard/TrustBar.tsx` | Slim affiliate disclosure bar. |
| `<CountryGrid>` | `components/destinations/CountryGrid.tsx` | Filterable grid of country cards. |
| `<RegionTabs>` | `components/destinations/RegionTabs.tsx` | Region filter pill tabs. |
| `<PageHero>` | `components/layout/PageHero.tsx` | Reusable slim text-only page hero with breadcrumb. |
| `<SEOContent>` | `components/seo/SEOContent.tsx` | Two-column SEO text block for country pages. |
| `<FAQAccordion>` | `components/faq/FAQAccordion.tsx` | Searchable, categorised accordion FAQ list. |

---

## 7. Mobile Responsiveness Rules

| Breakpoint | Layout Change |
|---|---|
| `sm` (640px) | Single column. Nav collapses to hamburger menu. |
| `md` (768px) | Two-column layouts activate (e.g., About page mission section). |
| `lg` (1024px) | Wizard split-screen activates. 3-column grids activate. |
| `xl` (1280px) | Max content width capped at `max-w-7xl` with `mx-auto`. |

**Mobile-Specific Wizard Behaviour:** On mobile, the Results Panel renders below the Chat Panel (not side-by-side). When the AI triggers plan results, the page auto-scrolls down to the Results Panel.

---

## 8. SEO Requirements

Every page must include the following metadata, generated dynamically for country pages.

```typescript
// Example for country pages
export async function generateMetadata({ params }) {
  return {
    title: `Best eSIM Plans for ${country.name} (${year}) — eSIMSeeker`,
    description: `Compare ${planCount} eSIM data plans for ${country.name} from Airalo, Holafly, Nomad and more. From $${lowestPrice}. Updated daily.`,
    openGraph: { ... },
    alternates: { canonical: `https://esimseeker.com/esim/${params.country}` },
  };
}
```

Additionally, every country page must include a `JSON-LD` structured data block of type `ItemList` listing the top 5 plans. This enables rich results in Google Search.

---

## 9. Wireframe Reference Index

The following wireframe images are located in the `/wireframes` directory of this project and correspond directly to the page specifications above.

| Wireframe File | Page | URL |
|---|---|---|
| `wireframe_01_homepage.png` | Homepage | `/` |
| `wireframe_02_wizard.png` | AI Wizard | `/wizard` |
| `wireframe_03_country_page.png` | Country Landing Page | `/esim/[country]` |
| `wireframe_04_destinations.png` | Destinations Hub | `/destinations` |
| `wireframe_05_about.png` | About Us | `/about` |
| `wireframe_06_contact_faq.png` | Contact + FAQ (combined) | `/contact`, `/faq` |
