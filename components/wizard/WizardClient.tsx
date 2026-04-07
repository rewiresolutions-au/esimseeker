"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useMemo, useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { extractLatestPlansFromMessages } from "./extract-plans";
import { ResultsPanel } from "./ResultsPanel";

/** Opening line mirrors SeatSeeker-style chat: one clear first question. */
const WIZARD_OPENING_MESSAGES: UIMessage[] = [
  {
    id: "wizard-opening",
    role: "assistant",
    parts: [{ type: "text", text: "Where are you travelling to?" }],
  },
];

export function WizardClient() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: WIZARD_OPENING_MESSAGES,
  });

  const plans = useMemo(
    () => extractLatestPlansFromMessages(messages as UIMessage[]),
    [messages],
  );

  const hasUserMessage = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages],
  );

  const showResults = hasUserMessage || plans.length > 0;

  return (
    <div
      className={
        showResults
          ? "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 lg:flex-row lg:gap-6"
          : "mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10 sm:py-14"
      }
    >
      <div className={showResults ? "min-h-0 flex-1" : "w-full"}>
        <p className="mb-3 text-center text-sm font-medium tracking-wide text-brand-teal">
          AI plan search
        </p>
        <ChatPanel
          messages={messages as UIMessage[]}
          input={input}
          onInputChange={setInput}
          sendMessage={sendMessage}
          status={status}
          stop={stop}
        />
      </div>
      {showResults ? (
        <div className="w-full shrink-0 lg:w-[380px]">
          <ResultsPanel plans={plans} />
        </div>
      ) : null}
    </div>
  );
}
