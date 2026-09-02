# Accessibility & Performance Audit

## Before

**Lighthouse (mobile, initial deploy):**
- Performance: 95
- Accessibility: 100
- Best Practices: 100
- LCP: 1.1s | TBT: 260ms | CLS: 0

**WAVE:**
- 1 Error (missing form label on the chat input)
- 0 Contrast errors
- 0 Alerts
- AIM Score: 9.1/10

## Changes made

1. **Missing form label (WAVE error):** The chat input only had a placeholder, which doesn't count as an accessible label for screen readers. Added `aria-label="Message to your habit coach"` to the input.
2. **AI-specific: streamed output announced politely:** Added `aria-live="polite"` and `aria-atomic="false"` to the chat message container, so screen reader users are notified as new AI text streams in, without interrupting them mid-sentence for every token.
3. **AI-specific: keyboard-reachable stop button:** Verified the Stop button is a native `<button>` element, part of the normal tab order, no custom widget with missing keyboard support.
4. **Keyboard-only pass:** Walked the primary flow (reach a starter prompt, activate it with Enter, reach and activate Stop while streaming) using Tab/Enter only. Confirmed via DOM inspection (`document.activeElement`) that focus moves correctly through the page in document order, and that focus-visible styling is correctly defined and renders (verified via forced pseudo-state and programmatic focus in DevTools).

## After

**Lighthouse (mobile, redeployed):**
- Performance: 99
- Accessibility: 100
- LCP: 1.4s | TBT: 130ms | CLS: 0

**WAVE:**
- 0 Errors
- 0 Contrast errors
- 0 Alerts

## Delta

| Metric | Before | After |
|---|---|---|
| Lighthouse Performance | 95 | 99 |
| Lighthouse Accessibility | 100 | 100 |
| WAVE Errors | 1 | 0 |
| Total Blocking Time | 260ms | 130ms |

Both Performance and Accessibility clear the 90+ target (well above the 80 absolute minimum). The one real accessibility defect found (missing input label) is fixed and verified. AI-specific accessibility requirements (polite live-region announcements for streamed text, keyboard-reachable stop control) are in place.