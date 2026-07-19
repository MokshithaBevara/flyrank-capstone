# Project: FlyRank Capstone

## Stack
- To be decided (starting simple, will evolve during the internship)
- Frontend: HTML/CSS/JavaScript (or React later)

## Conventions
- Use Conventional Commits format for all commits (e.g. feat:, fix:, docs:, chore:)
- Keep code readable with clear variable names
- Write short comments for anything non-obvious

## Notes for AI assistant
- This is a learning project for the FlyRank AI Internship
- Prefer simple, well-explained solutions over clever/complex ones

## Rules learned from vague vs precise prompting drill

- Forms must include per-field `aria-invalid`, `aria-required`, and `aria-describedby` linking each input to its own error message — section-level `aria-labelledby` alone is not enough for screen readers.
- Any static HTML/JS app in this repo must include a note that it requires a local server (e.g. `python -m http.server`) to run — opening `index.html` directly via `file://` breaks module loading silently.
- Validation logic must live in a separate file (e.g. `validation.js`) with its own automated tests — never rely on manual browser testing alone to confirm edge cases like empty/whitespace input.