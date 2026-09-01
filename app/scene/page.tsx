"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { COLORS } from "../../components/StreakOrb";

const StreakOrb = dynamic(() => import("../../components/StreakOrb"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
      Loading 3D scene…
    </div>
  ),
});

function StaticFallback({ color }: { color: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl"
      style={{
        background: `radial-gradient(circle at 40% 35%, ${color}, #0f172a 75%)`,
      }}
    >
      <p className="text-xs text-white/70">
        Motion reduced — static preview shown instead of the 3D scene.
      </p>
    </div>
  );
}

export default function ScenePage() {
  const [color, setColor] = useState(COLORS[0].hex);
  const [wireframe, setWireframe] = useState(false);
  const [celebrateSignal, setCelebrateSignal] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-xl font-semibold">Your Streak Orb</h1>
        <p className="text-sm text-gray-500">
          A little 3D companion for your habit streak. Move your cursor over it,
          change its color, or hit celebrate when you hit a milestone.
        </p>
      </div>

      <div className="h-[420px] w-full max-w-lg overflow-hidden rounded-xl border bg-gradient-to-b from-slate-900 to-slate-800">
        {prefersReducedMotion ? (
          <StaticFallback color={color} />
        ) : (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                Loading 3D scene…
              </div>
            }
          >
            <StreakOrb
              color={color}
              wireframe={wireframe}
              celebrateSignal={celebrateSignal}
            />
          </Suspense>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => setColor(c.hex)}
            aria-label={`Set color to ${c.name}`}
            aria-pressed={color === c.hex}
            className={`h-8 w-8 rounded-full border-2 transition-transform ${
              color === c.hex ? "scale-110 border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}

        <button
          type="button"
          onClick={() => setWireframe((w) => !w)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          {wireframe ? "Solid" : "Wireframe"}
        </button>

        <button
          type="button"
          onClick={() => setCelebrateSignal((n) => n + 1)}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
        >
          Celebrate 🎉
        </button>
      </div>
    </div>
  );
}