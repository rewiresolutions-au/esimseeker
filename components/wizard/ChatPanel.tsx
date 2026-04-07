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
    <div className="flex min-h-[min(420px,50vh)] flex-1 flex-col overflow-hidden rounded-2xl border border-brand-navy/12 bg-white shadow-md dark:border-white/10 dark:bg-brand-navy">
      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-6 rounded-2xl bg-brand-teal/15 px-4 py-3 text-brand-navy dark:text-brand-paper sm:ml-10"
                : "mr-6 rounded-2xl bg-brand-paper px-4 py-3 text-brand-navy dark:bg-white/10 dark:text-brand-paper sm:mr-10"
            }
          >
            <div className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-red">
              {message.role === "user" ? "You" : "eSIMSeeker"}
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
        className="border-t border-brand-navy/10 p-3 dark:border-white/10 sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || busy) return;
          sendMessage({ text: input });
          onInputChange("");
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="sr-only" htmlFor="wizard-chat-input">
            Your reply
          </label>
          <textarea
            id="wizard-chat-input"
            className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-brand-navy/20 bg-brand-paper px-3 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/45 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/30 dark:border-white/15 dark:bg-brand-navy dark:text-brand-paper dark:placeholder:text-brand-paper/45"
            placeholder="e.g. Japan, Italy, or New York…"
            rows={2}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!input.trim() || busy) return;
                sendMessage({ text: input });
                onInputChange("");
              }
            }}
            disabled={busy}
            aria-label="Your reply"
          />
          <div className="flex shrink-0 gap-2 sm:flex-col sm:gap-2">
            {busy ? (
              <button
                type="button"
                className="rounded-xl border border-brand-red/40 px-4 py-2.5 text-sm font-medium text-brand-red hover:bg-brand-red/10"
                onClick={() => stop()}
              >
                Stop
              </button>
            ) : null}
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
