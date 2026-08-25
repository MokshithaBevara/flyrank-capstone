# NOTES.md — Hand-built Components vs shadcn/ui

## What I Built
Three components in `playground/`, implemented from scratch against the W3C ARIA
Authoring Practices patterns: `Modal.tsx` (Dialog pattern), `Tabs.tsx` (Tabs pattern),
`Disclosure.tsx` (Disclosure pattern). All three were tested keyboard-only (Tab,
Escape, Arrow keys) before comparing against shadcn/ui.

## Gaps Found: Dialog

1. **No portal rendering.** shadcn's `DialogContent` renders through
   `DialogPortal`, which injects the dialog at the end of `<body>` in the DOM tree,
   independent of where the component is called from in the React tree. My Modal
   renders inline, nested wherever it's called. This matters for z-index stacking
   contexts and can affect how assistive tech interprets the dialog's position
   relative to surrounding landmarks.

2. **No description support.** shadcn wires up both `DialogTitle` (`aria-labelledby`)
   and `DialogDescription` (`aria-describedby`), so screen readers announce the
   dialog's name *and* a longer description on open. My Modal only implements
   `aria-labelledby` via the title — there's no equivalent for a description.

3. **No open/close animation.** shadcn uses `data-open`/`data-closed` attributes
   to drive CSS transitions (fade, zoom). My Modal is a hard show/hide with no
   transition, which is functionally accessible but a rougher UX.

## Gaps Found: Tabs

1. **No vertical orientation support.** shadcn's Tabs handles both horizontal and
   vertical layouts, with arrow key behavior adapting per the ARIA spec (Left/Right
   vs Up/Down). My Tabs only implements horizontal navigation — I'd need to add an
   orientation prop and conditional key handling to match this.

2. **State can be uncontrolled.** Radix's Tabs primitive manages its own internal
   selected-tab state by default, only requiring `useState` from the consumer if
   controlled behavior is needed. My Tabs always requires the parent-style
   `useState` I wrote directly into the component; there's no built-in uncontrolled
   mode.

## Reflection
Writing the ARIA roles, focus trap, and keyboard handling by hand for the Modal
was the most valuable part of this exercise — it's the piece that's completely
invisible in shadcn's Tabs source (no visible role/aria-selected/keydown logic
at all, because Radix abstracts it away entirely). Having built it myself, I can
now actually verify that Radix's hidden implementation is doing the right thing,
rather than trusting it blindly. The biggest practical gap I'd carry forward from
shadcn into my own code going forward is the portal pattern for dialogs — it's a
real structural difference, not just polish.