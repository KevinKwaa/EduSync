---
target: "AdminDashboard http://localhost:5174"
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-06-21T13-29-34Z
slug: admindashboard-http-localhost-5174
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton screens excellent; tab switches give zero feedback |
| 2 | Match System / Real World | 4 | RM, BM subjects, Malaysian school terms — genuinely local |
| 3 | User Control and Freedom | 2 | No undo, no panel dismiss, dead-end tab clicks with no indication |
| 4 | Consistency and Standards | 3 | Component vocab tight; View all goes nowhere |
| 5 | Error Prevention | 2 | Performance/Operations tabs imply working features; no API error state |
| 6 | Recognition Rather Than Recall | 2 | Icon-only rail forces icon memorization; no search autocomplete |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; showAdvanced toggle has no UI |
| 8 | Aesthetic and Minimalist Design | 3 | Clean density; dev theme-switcher doesn't belong in production |
| 9 | Error Recovery | 1 | Zero error boundaries, no retry UI, failed API = eternal spinner |
| 10 | Help and Documentation | 1 | No tooltips, no contextual help, no AI module explanation |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict
Detector: 0 findings across all component files. No gradient text, no side-stripe borders, no glassmorphism.
LLM: Does not read as generic SaaS. Crimson discipline holds. Malaysian context grounds it. Passes the slop test.

## Priority Issues

**[P1] Performance/Operations tabs are silent dead ends** — clicking shows identical Summary content with no feedback. Fix: disable with coming-soon state.

**[P1] No error state — Promise.all failure = eternal skeleton** — one failed fetch freezes the UI indefinitely. Fix: .catch() → error state → retry card.

**[P1] KPI label contrast fails AA in light theme** — #888 on #fff = 3.54:1 (needs 4.5:1 at 12px). Fix: darken --text-muted to #666 in light theme.

**[P2] Icon rail is recall-only** — no labels, no tooltips. Fix: tooltip on hover, active indicator when sidebar collapsed.

**[P2] Fee donut color semantics inverted** — grey arc = collected (good), crimson = outstanding (problem). Inverted from convention. Fix: swap colors or add directional label.

## Persona Red Flags
- Alex: no keyboard shortcut for search; showAdvanced not toggleable; sidebar state lost on reload
- Sam: no skip-to-content link; focus order coherent otherwise
- Faridah: AI panel unexplained; View all goes nowhere; New admission CTA top-right (below fold on fast scan)
