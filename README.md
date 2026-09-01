This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Tool: getHabitStats

**What it does:** Looks up streak and completion stats for a specific habit, so the AI coach can answer questions with real numbers instead of guessing.

**Schema:**
- Input: `{ habitName: string }` — the habit to look up (matched loosely against known habits)
- Output: `{ habitName: string, streak: number, completionRate: number, totalDays: number }`

**Error case:** If no matching habit is found, the tool throws an error and the UI shows a designed error card suggesting habits the user can ask about instead.

**Currently backed by:** sample in-memory data (`SAMPLE_HABITS` in `route.ts`) as a placeholder until real habit storage is added.

## 3D Experience: Streak Orb (/scene)

**What it is:** A small interactive 3D companion for the habit tracker — an icosahedron "orb" that represents your streak. It gently follows the cursor, its material color can be changed, it has a wireframe toggle, and a "Celebrate" button triggers a spring-like scale pulse.

**Stack:** React Three Fiber + drei, no external 3D model files — the geometry is procedural (a subdivided icosahedron), so there's no GLB/GLTF asset to download or compress at all.

**Performance note:** The 3D canvas is lazy-loaded via `next/dynamic` with `ssr: false`, so it doesn't add to the initial page bundle until the `/scene` route is actually visited. Device pixel ratio is capped at 1.5 (`dpr={[1, 1.5]}`) to avoid over-rendering on high-DPI phones, and the geometry itself is lightweight (a single low-poly mesh, no heavy textures). Under `prefers-reduced-motion: reduce`, the canvas is skipped entirely in favor of a static CSS gradient, so no WebGL work happens at all for users who've asked for reduced motion.

**With more time, I'd add:** a real `.glb` habit-icon model per habit type (compressed with DRACO), a scroll-linked camera move for a landing-page hero version of this scene, and persisting the chosen orb color so it reflects the user's actual streak progress instead of being purely decorative.