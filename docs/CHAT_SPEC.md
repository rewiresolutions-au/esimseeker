# eSIMSeeker: AI Chat Interface Specification

**Version:** 1.1 | **Author:** eSIMSeeker Design Team | **Status:** Ready for Development

> **How to use this in Cursor:** This document specifically details the logic, UI states, and conversational flow for the AI Wizard interface (`/wizard`). Use this alongside the `DESIGN.md` file to build the chat component.

---

## 1. Overview

The AI Chat Interface is the core conversion engine of eSIMSeeker. It handles two primary types of user inputs:
1. **Trip Statements:** Natural language intent (e.g., "I'm going to India for 2 weeks and need a data only sim").
2. **Knowledge Questions:** General inquiries (e.g., "What's the difference between Holafly and Airalo?").

The interface must seamlessly transition between extracting intent parameters, answering questions, and rendering dynamic UI components (like Plan Cards) directly inside the chat flow.

---

## 2. Chat UI States

The chat interface transitions through four distinct visual states. Reference the generated wireframes in the `/wireframes` folder.

### 2.1 Welcome / Empty State
**Wireframe Reference:** `wireframe_chat_01_welcome_and_conversation.png` (Left Panel)

- **Layout:** Centred content.
- **Elements:**
  - AI Avatar Icon (Robot face).
  - H1 Greeting: "Hi, I'm your eSIM Assistant".
  - Subtext explaining capabilities.
  - 4 Suggestion Chips (2x2 grid): Mix of trip statements and knowledge questions.
  - Bottom sticky input bar with a send button.

### 2.2 Mid-Conversation (Intent Extraction)
**Wireframe Reference:** `wireframe_chat_01_welcome_and_conversation.png` (Right Panel)

- **Layout:** Standard chat history (AI left, User right).
- **Elements:**
  - AI asks clarifying questions to fill missing parameters (Destination, Duration, Data Need).
  - **Quick-Reply Chips:** Rendered below the AI's question to speed up input (e.g., "Light", "Moderate", "Heavy").
  - **Context Tracker:** A slim bar above the text input showing the extraction progress (e.g., `✓ India`, `✓ 14 days`, `○ Data usage`).

### 2.3 Plan Results Reveal
**Wireframe Reference:** `wireframe_chat_02_results_and_comparison.png` (Left Panel)

- **Trigger:** Fires automatically when all required intent parameters are collected.
- **Elements:**
  - AI Bubble: "Here are your top 3 matches..."
  - **Inline Plan Cards:** The top 3 plans are rendered as rich UI cards *directly inside the chat feed*, not in a separate panel.
  - Each card includes: Provider Logo, Data/Duration/Price, an AI-generated "Why this fits you" sentence, and a primary affiliate CTA button.
  - **Follow-up Chips:** "Compare top 2", "Start new search".

### 2.4 Knowledge Question Response
**Wireframe Reference:** `wireframe_chat_02_results_and_comparison.png` (Right Panel)

- **Trigger:** Fires when the user asks a comparison or technical question.
- **Elements:**
  - **Structured UI inside Chat:** If the user asks to compare providers, the AI generates a clean Markdown table rendered inside the chat bubble.
  - **Contextual CTAs:** Chips below the answer prompting the user to transition to a trip search (e.g., "Find Holafly plans for my trip").

---

## 3. Mobile Layout Specifics
**Wireframe Reference:** `wireframe_chat_03_mobile.png`

The mobile experience must feel like a native messaging app (e.g., iMessage or WhatsApp).

- **Sticky Input:** The text input bar is permanently pinned to the bottom of the screen above the keyboard.
- **Horizontal Scroll:** Quick-reply chips and suggestion chips use horizontal scrolling (`overflow-x-auto`) to save vertical space.
- **Full-Width Cards:** Plan result cards span the full width of the screen, stacking vertically.
- **Context Tracker:** Reduced to a very slim, horizontally scrolling pill bar just above the text input.

---

## 4. Conversation Flow Logic

**Wireframe Reference:** `wireframe_chat_04_flow_diagram.png`

The AI operates on a state machine logic:

1. **User Input Received**
2. **Intent Routing:** The LLM determines if the input is a *Trip Statement* or a *Knowledge Question*.
3. **If Trip Statement:**
   - Run Intent Extraction (Destination, Duration, Data).
   - Are all fields populated?
     - **No:** Ask clarifying question + generate quick-reply chips.
     - **Yes:** Trigger `get_plans()` tool call → Render Plan Cards inline.
4. **If Knowledge Question:**
   - Generate structured response (text/table).
   - Ask follow-up question to steer user back to a Trip Statement (e.g., "Where are you travelling to?").

---

## 5. Technical Implementation Notes for Cursor

- **Framework:** Use `vercel/ai` SDK (v3/v4) with `useChat`.
- **Tool Calling:** The transition to State 3 (Results Reveal) happens when the LLM triggers a tool call (e.g., `get_plans({ destination: 'IN', duration: 14 })`).
- **Custom UI Rendering:** Use the `components` prop in your Markdown renderer (e.g., `react-markdown`) or the AI SDK's `render` capabilities to map specific LLM outputs (like tables or tool results) to custom React components (like `<PlanCard />`).
- **Context Tracker:** Maintain the extracted intent state in a React Context or Zustand store, separate from the chat history array, to power the visual tracker pill bar.
