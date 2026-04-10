"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlanCard } from "@/components/wizard/PlanCard";
import {
  DATA_PERSONA_CHIPS,
  deriveIntent,
  intentProgress,
  nextAssistantPrompt,
  type ChatMessage,
} from "@/lib/ai/wizard-state";
import type { Plan, WizardIntent } from "@/lib/types/plans";

type ChatPanelProps = {
  initialDestination?: string;
  onResultsChange?: (plans: Plan[]) => void;
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const destinationSuggestions = ["Japan", "Thailand", "Europe", "United States"];

export const ChatPanel = ({ initialDestination, onResultsChange }: ChatPanelProps) => {
  const [intent, setIntent] = useState<WizardIntent>(
    initialDestination ? { destination: initialDestination.toLowerCase().replace(/\s+/g, "-") } : {},
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content: initialDestination
        ? `Great choice. I can help with ${initialDestination}. How long is your trip?`
        : "Hi, I am your eSIM Assistant. Where are you flying to?",
    },
  ]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const progress = useMemo(() => intentProgress(intent), [intent]);
  const showInlineCards = plans.length > 0;

  useEffect(() => {
    onResultsChange?.(plans);
  }, [plans, onResultsChange]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, plans]);

  const pushAssistant = (content: string) => {
    setMessages((prev) => [...prev, { id: createId(), role: "assistant", content }]);
  };

  const submitUserMessage = async (rawValue: string) => {
    const trimmed = rawValue.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: createId(), role: "user", content: trimmed }]);
    const nextIntent = deriveIntent(intent, trimmed);
    setIntent(nextIntent);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-8).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        pushAssistant("I hit a temporary issue fetching plans. Please try again.");
        return;
      }

      const payload = (await response.json()) as {
        reply?: string;
        plans?: Plan[];
        intent?: WizardIntent;
      };

      const mergedIntent = {
        ...nextIntent,
        ...(payload.intent ?? {}),
      };
      setIntent(mergedIntent);

      if (payload.plans && payload.plans.length > 0) {
        setPlans(payload.plans);
      } else if (!(payload.intent?.destination && payload.intent?.durationDays && payload.intent?.dataPersona)) {
        setPlans([]);
      }

      if (payload.reply) {
        pushAssistant(payload.reply);
      } else {
        pushAssistant(nextAssistantPrompt(mergedIntent));
      }
    } catch {
      pushAssistant("I hit a network issue. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full min-h-[68vh] flex-col rounded-2xl border border-brand-navy/10 bg-white">
      <div className="border-b border-brand-navy/10 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {progress.map((step) => (
            <span
              key={step.label}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                step.done ? "bg-brand-teal/15 text-brand-teal" : "bg-brand-paper text-brand-navy/60"
              }`}
            >
              {step.done ? "✓ " : "○ "}
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              message.role === "assistant"
                ? "bg-brand-paper text-brand-navy"
                : "ml-auto bg-brand-navy text-white"
            }`}
          >
            {message.content}
          </div>
        ))}

        {/* Mobile uses inline result cards in chat flow. */}
        {showInlineCards ? (
          <div className="space-y-3 lg:hidden">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : null}
        <div ref={messageEndRef} />
      </div>

      <div className="border-t border-brand-navy/10 bg-white px-4 py-3">
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {!intent.destination
            ? destinationSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    void submitUserMessage(item);
                  }}
                  className="whitespace-nowrap rounded-full border border-brand-navy/15 px-3 py-1 text-xs text-brand-navy"
                >
                  {item}
                </button>
              ))
            : !intent.dataPersona
              ? DATA_PERSONA_CHIPS.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      void submitUserMessage(item);
                    }}
                    className="whitespace-nowrap rounded-full border border-brand-navy/15 px-3 py-1 text-xs text-brand-navy"
                  >
                    {item}
                  </button>
                ))
              : ["Compare top 2", "Start new search"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item.includes("Start")) {
                        setIntent({});
                        setPlans([]);
                        setMessages([
                          {
                            id: createId(),
                            role: "assistant",
                            content: "New search started. Where are you flying to next?",
                          },
                        ]);
                      }
                    }}
                    className="whitespace-nowrap rounded-full border border-brand-navy/15 px-3 py-1 text-xs text-brand-navy"
                  >
                    {item}
                  </button>
                ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void submitUserMessage(input);
              }
            }}
            placeholder="Tell me about your trip"
            className="h-11 flex-1 rounded-lg border border-brand-navy/20 px-3 text-sm"
          />
          <button
            onClick={() => {
              void submitUserMessage(input);
            }}
            disabled={isLoading}
            className="inline-flex h-11 items-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white"
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
};
