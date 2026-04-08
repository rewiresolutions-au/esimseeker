# eSIMSeeker Cursor Bundle

Welcome to the complete design and specification bundle for **eSIMSeeker** — an AI-powered eSIM comparison platform.

This package contains everything you need to build the site from scratch using Cursor.

## What's Inside

1. **`.cursorrules`**
   - The master instruction file for Cursor. It defines the tech stack, coding standards, and architectural rules.
   - **Action:** Drop this into the root of your project folder.

2. **`docs/`**
   - `DESIGN.md` & `.pdf`: The comprehensive site architecture, component library, brand tokens, and SEO rules.
   - `CHAT_SPEC.md` & `.pdf`: The detailed logic, UI states, and conversational flow for the AI Wizard interface.
   - `CURSOR_CONTEXT.md` & `.pdf`: The deployment plan, database schema, AI prompt, and 6-week sprint roadmap.
   - **Action:** Add these files to your project and reference them in Cursor (e.g., `@DESIGN.md`).

3. **`wireframes/`**
   - 10 detailed UX wireframes covering every page and AI chat state (desktop and mobile).
   - **Action:** Keep these handy and drag them into Cursor's chat window when asking it to build a specific component.

4. **`brand/`**
   - The official eSIMSeeker logo set (Primary, Dark Mode, and Icon).
   - The Brand Guidelines Reference Sheet (colours, typography, usage).
   - **Action:** Add the logos to your `public/` folder.

## Getting Started in Cursor

1. Create a new Next.js project.
2. Copy all files from this bundle into your project directory.
3. Open Cursor's Chat panel and type:
   > `@DESIGN.md Let's start by setting up the Tailwind config and building the <Navbar> and <Footer> components.`
4. For the AI Wizard, type:
   > `@CHAT_SPEC.md @DESIGN.md I need to build the ChatPanel and PlanCard components. Here is the wireframe for reference.` (Attach `wireframe_chat_02_results_and_comparison.png`).

Happy building!
