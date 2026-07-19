# WORKFLOW.md — Vague vs Precise Prompting Comparison

## The Drill
I built the same settings form twice using Cursor's Agent mode: once with a single
lazy prompt ("Make a settings form."), and once with a detailed prompt specifying
fields, validation rules, accessibility requirements, edge cases, and a request for
automated tests. Each round ran in a separate branch and a fresh chat session to
avoid context bleed.

## What Changed
Round 1 produced 3 files (431 lines): `index.html`, `js/app.js`, `css/styles.css`.
Round 2 produced 6 files (559 lines), adding `js/validation.js` (pure validation
functions, separated from DOM logic) and `tests/validation.test.js` (12 automated
tests using Node's built-in test runner, all passing).

## Correctness
Both versions technically work — form validation, save/reset via localStorage, and
error clearing on resubmission all function correctly in both. Round 1 was not
"broken," just unverified. Round 2 is provably correct: the tests explicitly check
whitespace-only names, malformed emails, and partial-fix resubmission, so I have
evidence, not just an assumption, that edge cases are handled.

## Accessibility
This is where the gap was clearest. Round 1 only labels sections (`aria-labelledby`
on each `<section>`). Round 2 adds `aria-invalid`, `aria-required`, and
`aria-describedby` on every input, linking each field directly to its own error
message. In round 1, a screen reader user gets no indication of *which* field
failed; in round 2, they hear the specific error tied to the specific input.

## Edge Cases
Round 2 explicitly handles whitespace-only names and malformed emails (missing "@"
or missing domain) with dedicated tests. Round 1 handles these too, but only
because the general logic happened to catch them — there's no test confirming it,
so I can't be sure it stays correct after future changes.

## AI Mistake I Caught
Round 1's output gave no instructions that the app needs to run through a local
server. Opening `index.html` directly (double-click, `file://` protocol) silently
fails with a CORS error in the console — the JS never loads, and the form falls
back to a native HTML submit that dumps form data into the URL with no validation
at all. Nothing in Cursor's response flagged this. I only caught it by testing the
"naive" way a real user would open the file, not by reading the code.

## Review Effort
Round 1 took less time to generate but more time to trust — I had to manually test
error states, resubmission behavior, and discovered the server issue by accident.
Round 2 took longer to prompt (I had to think through requirements up front) but
came with tests I could run in seconds to confirm behavior, meaning far less manual
poking around afterward. End-to-end, round 2 was faster once I counted verification
time, not just generation time.