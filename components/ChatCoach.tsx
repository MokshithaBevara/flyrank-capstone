"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">("idle");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  // Only auto-scroll to bottom while the user hasn't scrolled up to read history
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input };
    const assistantId = crypto.randomUUID();

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStatus("submitted");
    setIsPinnedToBottom(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (firstChunk) {
          setStatus("streaming"); // handoff from "thinking" to actual streamed text
          firstChunk = false;
        }

        const chunk = decoder.decode(value, { stream: true });

        // Append streamed text to the assistant message as it arrives
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err) {
      // AbortError is expected when the user clicks Stop — not a real failure
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.error("Chat stream error:", err);
      }
    } finally {
      setStatus("idle");
      abortControllerRef.current = null;
    }
  }

  function handleStop() {
    abortControllerRef.current?.abort();
    // Partial message is already in state from the chunks received so far — it persists as-is
    setStatus("idle");
  }

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto border rounded-lg overflow-hidden">
      {/* Message list */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ask your habit coach anything — e.g. &quot;How do I stick to a morning
            routine?&quot;
          </p>
        )}

        {messages.map((message) => {
          const isEmptyAssistant = message.role === "assistant" && message.content === "";
          if (isEmptyAssistant && status !== "submitted") return null;

          return (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {isEmptyAssistant ? (
                <div className="bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm italic">
                  Thinking…
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              )}
            </div>
          );
        })}

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

      {/* Input row */}
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
            onClick={handleStop}
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