"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroShader = dynamic(() => import("../../components/HeroShader"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900" />,
});

function StaticFallback() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "linear-gradient(135deg, #1a2650 0%, #337a8c 55%, #d98b40 100%)",
      }}
    />
  );
}

export default function HeroPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {prefersReducedMotion ? <StaticFallback /> : <HeroShader />}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-md sm:text-5xl">
          Habit Tracker
        </h1>
        <p className="mt-3 max-w-md text-white/90 drop-shadow-sm">
          Small, steady habits — with an AI coach that actually knows your
          streaks.
        </p>
      </div>
    </div>
  );
}