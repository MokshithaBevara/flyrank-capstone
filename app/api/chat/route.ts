import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// ─────────────────────────────────────────────────────────────
// Model + system prompt configuration — kept in one place so
// future assignments (FE-07) can extend this cleanly.
// ─────────────────────────────────────────────────────────────
const MODEL = google("gemini-3.6-flash");

const SYSTEM_PROMPT = `You are a supportive, practical habit-building coach inside a
habit tracker app called Habit Tracker. Help the user build and stick to habits:
give concrete, small, actionable suggestions (not vague motivation). Keep responses
short — a few sentences or a short list, not essays. If the user asks something
unrelated to habits/productivity, gently steer back or answer briefly.`;

export const maxDuration = 30;

// Expects: { messages: { role: "user" | "assistant", content: string }[] }
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages,
  });

  // Returns a plain text stream we consume manually on the client
  return result.toTextStreamResponse();
}