"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PlanCard } from "@/components/wizard/PlanCard";
import {
  DATA_PERSONA_CHIPS,
  deriveIntent,
  intentProgress,
  type ChatMessage,
} from "@/lib/ai/wizard-state";
import { COUNTRIES } from "@/lib/data/countries";
import type { Plan, WizardIntent } from "@/lib/types/plans";

type ChatPanelProps = {
  initialDestination?: string;
  onResultsChange?: (plans: Plan[]) => void;
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const destinationSuggestions = ["Japan", "Thailand", "Europe", "United States"];

const TIMEFRAME_CHIPS = ["3 days", "7 days", "14 days", "30 days"] as const;

type NdjsonEvent =
  | { type: "text"; delta: string }
  | { type: "done"; text: string; plans: Plan[]; intent: WizardIntent }
  | { type: "error"; message: string };

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
  const [streamPreview, setStreamPreview] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const destinationLabel = useMemo(() => {
    if (!intent.destination) return undefined;
    return COUNTRIES.find((c) => c.slug === intent.destination)?.name;
  }, [intent.destination]);

  const progress = useMemo(() => intentProgress(intent, destinationLabel), [intent, destinationLabel]);

  const hasDestination = Boolean(intent.destination);
  const hasDuration = Boolean(intent.durationDays);
  const hasPersona = Boolean(intent.dataPersona);

  useEffect(() => {
    onResultsChange?.(plans);
  }, [plans, onResultsChange]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, plans, streamPreview]);

  const submitUserMessage = async (rawValue: string) => {
    const trimmed = rawValue.trim();
    if (!trimmed) return;

    const priorHistory = messages;
    setMessages((prev) => [...prev, { id: createId(), role: "user", content: trimmed }]);
    const nextIntent = deriveIntent(intent, trimmed);
    setIntent(nextIntent);
    setInput("");
    setIsLoading(true);
    setStreamPreview("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          intent: nextIntent,
          history: priorHistory.slice(-8).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        const errJson = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content: errJson?.error ?? "Something went wrong. Please try again.",
          },
        ]);
        return;
      }

      if (!contentType.includes("ndjson") && !contentType.includes("json")) {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content: "Unexpected response from the assistant. Please try again.",
          },
        ]);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setMessages((prev) => [
          ...prev,
          { id: createId(), role: "assistant", content: "No response stream. Please try again." },
        ]);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: NdjsonEvent;
          try {
            evt = JSON.parse(line) as NdjsonEvent;
          } catch {
            continue;
          }

          if (evt.type === "text") {
            assembled += evt.delta;
            setStreamPreview(assembled);
          } else if (evt.type === "error") {
            setStreamPreview("");
            setMessages((prev) => [
              ...prev,
              { id: createId(), role: "assistant", content: evt.message },
            ]);
            setIsLoading(false);
            return;
          } else if (evt.type === "done") {
            setStreamPreview("");
            const mergedIntent = {
              ...nextIntent,
              ...evt.intent,
            };
            setIntent(mergedIntent);

            if (evt.plans.length > 0) {
              setPlans(evt.plans);
            } else if (!mergedIntent.destination || !mergedIntent.durationDays || !mergedIntent.dataPersona) {
              setPlans([]);
            }

            const text = evt.text.trim() || "Here is what I found for your trip.";
            setMessages((prev) => [
              ...prev,
              {
                id: createId(),
                role: "assistant",
                content: text,
                plans: evt.plans.length > 0 ? evt.plans : undefined,
              },
            ]);
          }
        }
      }
    } catch {
      setStreamPreview("");
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: "I hit a network issue. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamPreview("");
    }
  };

  return (
    <section className="flex h-full min-h-[72vh] flex-col rounded-2xl border border-brand-navy/10 bg-white shadow-sm">
      <div className="border-b border-brand-gray-mid/80 bg-brand-gray-light/50 px-4 py-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-navy/50">
          What we understand so far
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {progress.map((step) => (
            <span
              key={step.label}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                step.done ? "bg-brand-teal/15 text-brand-teal" : "bg-white text-brand-navy/55 ring-1 ring-brand-navy/10"
              }`}
            >
              {step.done ? "✓ " : "○ "}
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full flex-col gap-3 ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[min(100%,520px)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "assistant"
                  ? "bg-brand-gray-light text-brand-navy"
                  : "bg-brand-navy text-white"
              }`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    h3: ({ children }) => <h3 className="mt-2 text-base font-semibold">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
            {message.role === "assistant" && message.plans && message.plans.length > 0 ? (
              <div className="grid w-full max-w-full gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {message.plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {streamPreview ? (
          <div className="flex w-full flex-col items-start">
            <div className="max-w-[min(100%,520px)] rounded-2xl bg-brand-gray-light px-4 py-3 text-sm leading-relaxed text-brand-navy">
              {streamPreview}
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand-navy/40 align-middle" />
            </div>
          </div>
        ) : null}

        {isLoading && !streamPreview ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-brand-gray-light px-4 py-3 text-sm text-brand-navy/70">
              Thinking…
            </div>
          </div>
        ) : null}

        <div ref={messageEndRef} />
      </div>

      <div className="border-t border-brand-gray-mid/80 bg-white px-4 py-3">
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {!hasDestination
            ? destinationSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    void submitUserMessage(item);
                  }}
                  className="whitespace-nowrap rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-gray-light"
                >
                  {item}
                </button>
              ))
            : null}
          {hasDestination && !hasDuration
            ? TIMEFRAME_CHIPS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    void submitUserMessage(item);
                  }}
                  className="whitespace-nowrap rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-gray-light"
                >
                  {item}
                </button>
              ))
            : null}
          {hasDestination && hasDuration && !hasPersona
            ? DATA_PERSONA_CHIPS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    void submitUserMessage(item);
                  }}
                  className="whitespace-nowrap rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-gray-light"
                >
                  {item}
                </button>
              ))
            : null}
          {hasDestination && hasDuration && hasPersona
            ? ["Start new search"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setIntent({});
                    setPlans([]);
                    setMessages([
                      {
                        id: createId(),
                        role: "assistant",
                        content: "New search started. Where are you flying to next?",
                      },
                    ]);
                  }}
                  className="whitespace-nowrap rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition hover:bg-brand-gray-light"
                >
                  {item}
                </button>
              ))
            : null}
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
            disabled={isLoading}
            className="h-11 flex-1 rounded-lg border border-brand-navy/20 bg-white px-3 text-sm text-brand-navy placeholder:text-brand-navy/40"
          />
          <button
            type="button"
            onClick={() => {
              void submitUserMessage(input);
            }}
            disabled={isLoading}
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white transition enabled:hover:bg-brand-red/90 disabled:opacity-60"
          >
            {isLoading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
};
