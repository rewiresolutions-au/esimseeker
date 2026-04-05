"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useMemo, useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { extractLatestPlansFromMessages } from "./extract-plans";
import { ResultsPanel } from "./ResultsPanel";

export function WizardClient() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const plans = useMemo(
    () => extractLatestPlansFromMessages(messages as UIMessage[]),
    [messages],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 lg:flex-row lg:gap-6">
      <ChatPanel
        messages={messages as UIMessage[]}
        input={input}
        onInputChange={setInput}
        sendMessage={sendMessage}
        status={status}
        stop={stop}
      />
      <div className="w-full shrink-0 lg:w-[380px]">
        <ResultsPanel plans={plans} />
      </div>
    </div>
  );
}
