"use client";

import type { ChatStatus, UIMessage } from "ai";

type SendMessageFn = (message: { text: string }) => void;

type Props = {
  messages: UIMessage[];
  input: string;
  onInputChange: (value: string) => void;
  sendMessage: SendMessageFn;
  status: ChatStatus;
  stop: () => void;
};

export function ChatPanel({
  messages,
  input,
  onInputChange,
  sendMessage,
  status,
  stop,
}: Props) {
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="flex min-h-[420px] flex-1 flex-col rounded-lg border border-[#0A192F]/12 bg-white shadow-sm dark:border-white/10 dark:bg-[#0A192F]">
      <header className="border-b border-[#0A192F]/10 px-4 py-3 dark:border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-[#0A192F] dark:text-[#F8F9FA]">
          Plan wizard
        </h1>
        <p className="text-sm text-[#0A192F]/65 dark:text-[#F8F9FA]/60">
          Tell us where you&apos;re going — we&apos;ll pull real catalogue rows
          when needed.
        </p>
      </header>

      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-[#0A192F]/60 dark:text-[#F8F9FA]/55">
            Try: &quot;I need an eSIM for two weeks in Japan with about
            10GB.&quot;
          </p>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-8 rounded-lg bg-[#20B2AA]/15 px-3 py-2 text-[#0A192F] dark:text-[#F8F9FA]"
                : "mr-8 rounded-lg bg-[#F8F9FA] px-3 py-2 text-[#0A192F] dark:bg-[#0A192F]/60 dark:text-[#F8F9FA]"
            }
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#C0392B]">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <p key={index} className="whitespace-pre-wrap text-sm">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-getPlans") {
                if (
                  part.state === "input-streaming" ||
                  part.state === "input-available"
                ) {
                  return (
                    <p
                      key={index}
                      className="text-sm italic text-[#0A192F]/55 dark:text-[#F8F9FA]/50"
                    >
                      Searching plans…
                    </p>
                  );
                }
                if (part.state === "output-available") {
                  const n = (part.output as { plans?: unknown[] })?.plans
                    ?.length;
                  return (
                    <p key={index} className="text-sm text-[#20B2AA]">
                      Found {typeof n === "number" ? n : 0} plan
                      {n === 1 ? "" : "s"} in catalogue.
                    </p>
                  );
                }
                if (part.state === "output-error") {
                  return (
                    <p key={index} className="text-sm text-[#C0392B]">
                      Plan search failed.
                    </p>
                  );
                }
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <form
        className="border-t border-[#0A192F]/10 p-3 dark:border-white/10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || busy) return;
          sendMessage({ text: input });
          onInputChange("");
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="min-h-10 flex-1 rounded-lg border border-[#0A192F]/20 bg-[#F8F9FA] px-3 text-sm text-[#0A192F] placeholder:text-[#0A192F]/40 focus:border-[#20B2AA] focus:outline-none focus:ring-1 focus:ring-[#20B2AA] dark:border-white/15 dark:bg-[#0A192F] dark:text-[#F8F9FA]"
            placeholder="Where are you travelling?"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={busy}
            aria-label="Message"
          />
          <div className="flex gap-2">
            {busy ? (
              <button
                type="button"
                className="rounded-lg border border-[#C0392B]/40 px-4 py-2 text-sm font-medium text-[#C0392B] hover:bg-[#C0392B]/10"
                onClick={() => stop()}
              >
                Stop
              </button>
            ) : null}
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-lg bg-[#C0392B] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
