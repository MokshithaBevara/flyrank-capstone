import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Model + system prompt configuration — kept in one place so
// future assignments can extend this cleanly.
// ─────────────────────────────────────────────────────────────
const MODEL = google("gemini-3.6-flash");

const SYSTEM_PROMPT = `You are a supportive, practical habit-building coach inside a habit tracker app called Habit Tracker. Help the user build and stick to habits: give concrete, small, actionable suggestions (not vague motivation). Keep responses short — a few sentences or a short list, not essays. If the user asks something unrelated to habits/productivity, gently steer back or answer briefly.

When the user asks how they're doing with a specific habit, use the getHabitStats tool to look up real numbers instead of guessing.`;

export const maxDuration = 30;

// ─────────────────────────────────────────────────────────────
// Production hygiene: a simple per-IP rate limit and a message
// length cap, so a stranger can't spam this route and drain the
// AI API budget. This is a best-effort, in-memory limiter — it
// resets on cold starts and isn't shared across serverless
// instances, but it stops casual/accidental abuse, which is the
// realistic threat for a small project like this.
// ─────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const MAX_MESSAGE_LENGTH = 2000;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ─────────────────────────────────────────────────────────────
// Sample habit data (placeholder until real habit storage exists).
// Swap this for a real database later — the tool contract below
// won't need to change.
// ─────────────────────────────────────────────────────────────
const SAMPLE_HABITS: Record <
  string,
  { streak: number; completionRate: number; totalDays: number }
> = {
  "morning run": { streak: 12, completionRate: 0.8, totalDays: 15 },
  "read 20 minutes": { streak: 5, completionRate: 0.6, totalDays: 20 },
  "drink water": { streak: 30, completionRate: 0.95, totalDays: 30 },
  meditate: { streak: 2, completionRate: 0.4, totalDays: 10 },
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const totalChars = messages.reduce((sum, m) => {
    const text =
      m.parts
        ?.filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("") ?? "";
    return sum + text.length;
  }, 0);

  if (totalChars > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ error: "Message too long." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      getHabitStats: tool({
        description:
          "Look up streak and completion stats for one of the user's habits. Call this whenever the user asks how they're doing with a specific habit.",
        inputSchema: z.object({
          habitName: z
            .string()
            .describe(
              "The habit to look up, e.g. 'morning run'. Match loosely against known habits."
            ),
        }),
        execute: async ({ habitName }) => {
          const key = Object.keys(SAMPLE_HABITS).find(
            (k) =>
              habitName.toLowerCase().includes(k) ||
              k.includes(habitName.toLowerCase())
          );

          if (!key) {
            throw new Error(`No habit found matching "${habitName}"`);
          }

          const stats = SAMPLE_HABITS[key];
          return {
            habitName: key,
            streak: stats.streak,
            completionRate: stats.completionRate,
            totalDays: stats.totalDays,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}