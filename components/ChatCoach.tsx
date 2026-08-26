"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

const STARTER_PROMPTS = [
  "How is my morning run streak?",
  "Give me a tip for drinking more water",
  "How is my meditation habit going?",
];

export default function ChatCoach() {
  const { messages, sendMessage, status, stop, error, regenerate, clearError } =
    useChat();
  const [input, setInput] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (isPinnedToBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isPinnedToBottom]);

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsPinnedToBottom(distanceFromBottom < 40);
  }

  function submitText(text: string) {
    if (!text.trim() || isStreaming) return;
    sendMessage({ text });
    setInput("");
    setIsPinnedToBottom(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitText(input);
  }

  function handleRetry() {
    clearError();
    regenerate();
  }

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto border rounded-lg overflow-hidden">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask your habit coach anything. Try one of these:
            </p>
            <div className="flex flex-col gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitText(prompt)}
                  className="text-left text-sm border rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {message.parts.map((part: any, i: number) => {
              if (part.type === "text") {
                return (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {part.text}
                  </div>
                );
              }

              if (part.type === "tool-getHabitStats") {
                return <HabitStatsToolPart key={i} part={part} />;
              }

              return null;
            })}
          </div>
        ))}

        {/* Skeleton matching the shape of an incoming assistant bubble */}
        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-gray-100 px-3 py-2 space-y-2 w-40">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Designed error state with retry, not a crash */}
        {error && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 space-y-2">
              <p>Something went wrong sending that message.</p>
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs font-medium underline underline-offset-2"
              >
                Retry last message
              </button>
            </div>
          </div>
        )}

        {!isPinnedToBottom && (
          <button
            type="button"
            onClick={() => {
              setIsPinnedToBottom(true);
              scrollContainerRef.current?.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="sticky bottom-0 mx-auto block text-xs bg-white border rounded-full px-3 py-1 shadow"
          >
            Jump to latest ↓
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your habit coach..."
          disabled={isStreaming}
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={() => stop()}
            className="bg-red-600 text-white text-sm rounded-md px-4 py-2"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 text-white text-sm rounded-md px-4 py-2 disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function HabitStatsToolPart({ part }: { part: any }) {
  if (part.state === "input-streaming") {
    return (
      <div className="max-w-[80%] rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Looking up habit…
      </div>
    );
  }

  if (part.state === "input-available") {
    return (
      <div className="max-w-[80%] rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 animate-pulse">
        Checking stats for &quot;{part.input?.habitName}&quot;…
      </div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div className="max-w-[80%] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Couldn&apos;t find that habit. Try one you&apos;ve added, like &quot;morning
        run&quot; or &quot;drink water&quot;.
      </div>
    );
  }

  if (part.state === "output-available") {
    const { habitName, streak, completionRate, totalDays } = part.output;
    return (
      <div className="max-w-[80%] rounded-lg border bg-white shadow-sm px-4 py-3 text-sm">
        <div className="font-semibold capitalize mb-1">{habitName}</div>
        <div className="flex gap-4 text-gray-700">
          <div>
            <div className="text-lg font-bold">{streak}</div>
            <div className="text-xs text-gray-500">day streak</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {Math.round(completionRate * 100)}%
            </div>
            <div className="text-xs text-gray-500">completion</div>
          </div>
          <div>
            <div className="text-lg font-bold">{totalDays}</div>
            <div className="text-xs text-gray-500">days tracked</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}