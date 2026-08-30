export type HabitStatsPart =
  | { state: "input-streaming"; input?: { habitName?: string } }
  | { state: "input-available"; input: { habitName: string } }
  | {
      state: "output-available";
      input: { habitName: string };
      output: {
        habitName: string;
        streak: number;
        completionRate: number;
        totalDays: number;
      };
    }
  | { state: "output-error"; input?: { habitName?: string }; errorText?: string };

export default function HabitStatsToolPart({ part }: { part: HabitStatsPart }) {
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