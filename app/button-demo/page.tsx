"use client";

import { useState, useRef, useCallback } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

function SendButton() {
  const [state, setState] = useState<ButtonState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    // Ignore spam clicks while a request is already in flight —
    // this is what makes it "interruptible" without breaking.
    if (state === "loading") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setState("loading");

    const delay = 700 + Math.random() * 700; // fake 700–1400ms latency
    const willFail = Math.random() < 0.2; // 20% failure rate

    timeoutRef.current = setTimeout(() => {
      setState(willFail ? "error" : "success");

      timeoutRef.current = setTimeout(() => {
        setState("idle");
      }, 1400);
    }, delay);
  }, [state]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-live="polite"
      className={`
        relative inline-flex h-11 w-40 items-center justify-center
        rounded-lg text-sm font-medium text-white
        transition-colors duration-300 ease-out motion-reduce:transition-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        active:scale-[0.97] motion-reduce:active:scale-100
        ${isError ? "bg-red-600 focus-visible:ring-red-500 shake-on-error" : ""}
        ${isSuccess ? "bg-emerald-600 focus-visible:ring-emerald-500" : ""}
        ${
          !isError && !isSuccess
            ? "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
            : ""
        }
      `}
    >
      {/* Idle label */}
      <span
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          state === "idle"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        Send message
      </span>

      {/* Loading spinner */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          isLoading ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        <svg className="h-5 w-5 motion-safe:animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </span>

      {/* Success checkmark */}
      <span
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
          isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
        }`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Sent
      </span>

      {/* Error / retry label */}
      <span
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          isError ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Retry
      </span>
    </button>
  );
}

export default function ButtonDemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-xl font-semibold">Buttons with a Brain</h1>
        <p className="text-sm text-gray-500">
          Click the button. It fakes an async send with a random 700–1400ms delay
          and a 20% chance of failure, so you can see every state without
          reloading — click it a few times to see both outcomes.
        </p>
      </div>

      <SendButton />

      <div className="max-w-sm text-center text-xs leading-relaxed text-gray-400">
        <strong>Motion notes:</strong> Layers crossfade using opacity and
        transform (translate/scale) only — never width or height — so nothing
        reflows the layout. Idle→loading uses a quick 300ms ease-out since it&apos;s
        user-initiated and should feel responsive. Success uses a springy
        overshoot easing so the checkmark feels like a small reward, not just a
        flip. Error triggers one 300ms shake, then holds red until retried — no
        repeating animation, so it doesn&apos;t nag. All motion is skipped under{" "}
        <code>prefers-reduced-motion</code>; color and label changes still
        communicate every state without movement.
      </div>
    </div>
  );
}