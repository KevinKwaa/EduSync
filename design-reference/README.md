# Handoff: EduSync — Unified Admin Dashboard (Dark + Light)

## Overview
A single, unified admin dashboard for **EduSync** (CodeSync Systems' education-management product), presented in two themes: **Dark** (Onyx surface, the brand's natural home) and **Light** (Off-White surface, the product's everyday default). It is the principal/admin home screen — a calm, KPI-first overview of a Malaysian school's operations: enrolment, attendance, fee collection, academic performance, at-risk students, events, and notices.

The defining idea is a **three-layer navigation system** that combines patterns the stakeholder liked from earlier explorations:
1. A fixed **domain icon rail** (always-dark brand anchor).
2. A **collapsible, grouped sidebar** (Overview / Academics / Finance & ops).
3. A **top nav** for switching views (Summary / Performance / Operations).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the intended look and behaviour, not production code to copy line-for-line. The HTML uses a small custom rendering runtime (`support.js`, the `<x-dc>` / `<sc-for>` tags) that is **specific to the prototyping environment and should not be ported**.

Your task is to **recreate these designs in the target codebase's existing environment** (React, Vue, SwiftUI, native, etc.) using its established components, state, and styling patterns. If no front-end environment exists yet, pick the most appropriate framework for the project and implement there. Treat the CodeSync design tokens below as the source of truth for visual values.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and interactions are all specified. Recreate the UI pixel-accurately using the codebase's existing libraries, mapping the literal values below onto the CodeSync design tokens (which the codebase should already expose, or which you can import from the design system at `tokens/colors.css`, `tokens/effects.css`, etc.).

---

## Screens / Views

There is **one screen**, rendered in two interchangeable themes. Layout, structure, content, and navigation are identical between them — only surface/border/shadow colors change. Build it as **one component with a `theme: 'dark' | 'light'` prop**, not two screens.

### Screen: Admin Dashboard

**Purpose:** Give a principal/admin an at-a-glance operational picture of the institution on login, with fast access to every module via the nav.

**Overall layout** — full-height (`868px` in the mock; should be `100vh` in production) flex row of three regions:

```
┌──────┬─────────────┬──────────────────────────────────────┐
│ icon │ collapsible │  top nav (toggle · view tabs · search · bell · CTA)
│ rail │  grouped    ├──────────────────────────────────────┤
│ 62px │  sidebar    │  scrollable content area (padding 24px)
│      │  214px      │   • greeting row
│      │             │   • KPI row (4 cards)
│      │             │   • attendance bar chart (1.7fr) + fee donut (1fr)
│      │             │   • subject performance (1fr) + at-risk (1fr)
│      │             │   • upcoming events (1fr) + notice board (1fr)
└──────┴─────────────┴──────────────────────────────────────┘
```

Container: `border-radius: 16px` (`--radius-xl`), `1px` hairline border (`--border-subtle`), `box-shadow: --shadow-lg`, `overflow: hidden`.

---

#### Region 1 — Icon rail (identical in both themes; always dark)
- **Width:** `62px`, fixed (`flex-shrink: 0`). Full height.
- **Background:** Onyx `#0D0D0D` (`--onyx`) in BOTH themes — it is the brand anchor.
- **Padding:** `16px 0`; column flex, centered, `gap: 6px`.
- **Logo mark** (top): `36×36`, `border-radius: 10px`, background `--gradient-crimson`, white "E", `font-weight: 700`, `font-size: 14px`, `margin-bottom: 10px`. In production use the supplied EduSync logo mark, not a letter.
- **Nav icons:** `42×42` tap targets, `border-radius: 11px`, Lucide icons `19×19`. Active item: `color: #fff`, `background: rgba(255,255,255,.12)`. Inactive: `color: #8a8a8a`, transparent background. Icons in order: `layout-dashboard` (Dashboard, active), `users` (People), `book-open` (Academics), `wallet` (Finance), `calendar-check` (Calendar), `bar-chart-3` (Analytics).
- **Settings** (`settings` icon) pinned to bottom via `margin-top: auto`.

#### Region 2 — Collapsible grouped sidebar
- **Width:** `214px` expanded → `0px` collapsed. `flex-shrink: 0`.
- **Collapse animation:** `transition: width .22s var(--ease-out), opacity .18s var(--ease-out)`. On collapse, also animate `opacity` 1→0, `padding-left/right` 12→0, `border-right-width` 1→0. `white-space: nowrap; overflow: hidden` so labels clip cleanly rather than wrap during the transition.
- **Background:** Dark theme `--bg-subtle`; Light theme `--off-white` (`#F5F5F3`).
- **Border-right:** `1px solid --border-subtle`.
- **Padding:** `16px 12px`; column flex.
- **Group headers:** `font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: --text-faint; padding: 4px 10px 6px` (first) / `14px 10px 6px` (subsequent). Three groups: **Overview**, **Academics**, **Finance & ops**.
- **Nav items:** flex row, `gap: 11px`, `padding: 9px 12px`, `border-radius: 8px`, `font-size: 13.5px`. Lucide icon `17×17`. 
  - **Active** (Dashboard): Dark theme → `background: --accent-wash; color: --text-strong;` icon `color: --accent`. Light theme → `background: --accent-wash; color: --accent;` (icon inherits).
  - **Inactive:** `color: --text-muted`. Hover → Dark: `background: --surface-card; color: --text-strong`. Light: `background: --bg-subtle; color: --text-strong`.
  - **Item list:**
    - Overview: Dashboard (`layout-dashboard`, active), Campuses (`building-2`)
    - Academics: Students (`users`), Teachers (`graduation-cap`), Classes (`layers`), Examinations (`file-text`), Attendance (`calendar-check`)
    - Finance & ops: School fees (`wallet`), Leave (`plane`), Notice board (`megaphone`)
- **User card** (bottom, `margin-top: auto`): `10px` padding, `1px` border `--border-subtle`, `background: --surface-card`, `border-radius: 10px`. `34×34` avatar square (`border-radius: 8px`) — Dark: `--gradient-crimson` bg; Light: `--onyx` bg — white initials "FN". Name "Faridah Nasir" (`12.5px`, `600`, `--text-strong`), subtitle "Principal · SMK BU" (`11px`, `--text-muted`).

#### Region 3 — Main column
Vertical flex, `min-width: 0`, `flex: 1`.

**Top nav bar** — `height: 60px`, `flex-shrink: 0`, `border-bottom: 1px solid --border-subtle`. Light theme adds `background: --surface-card`. Flex row, `align-items: center`, `gap: 16px`, `padding: 0 22px`:
- **Sidebar toggle** (left): `34×34`, `border-radius: 8px`, `1px` border `--border-default`, Lucide `panel-left` icon `16×16`. Clicking toggles the sidebar collapse. The chevron/icon rotates `rotateY(180deg)` when collapsed (`transition: transform .22s var(--ease-out)`).
- **View tabs:** "Summary" (active), "Performance", "Operations". `font-size: 13px`, `padding: 8px 13px`, `border-radius: 8px`. Active: `font-weight: 600; color: --text-strong;` background — Dark: `--surface-card` + `--shadow-xs`; Light: `--bg-subtle`. Inactive: `font-weight: 500; color: --text-muted`.
- **Right cluster** (`margin-left: auto`, `gap: 10px`):
  - **Search field:** `height: 38px`, `min-width: 230px`, `padding: 0 14px`, `border-radius: 8px`, `1px` border `--border-default`, `background: --surface-sunken`. Light theme adds `box-shadow: --shadow-inset`. Lucide `search` `15×15` `--text-faint`, placeholder "Search students, classes…" `13px --text-faint`.
  - **Bell button:** `38×38`, `border-radius: 8px`, `1px` border `--border-default`, Lucide `bell` `16×16`. Notification dot: `6×6`, `border-radius: 50%`, `background: --accent`, positioned `top: 8px; right: 9px`.
  - **Primary CTA:** `height: 38px`, `padding: 0 16px`, `border-radius: 8px`, `background: --accent`, `color: --off-white`, `font-size: 13px`, `font-weight: 600`, `box-shadow: --glow-crimson`. Lucide `plus` `15×15` + label "New admission". (One primary action per screen — keep the crimson glow on this only.)

**Content area** — `flex: 1; overflow: auto; padding: 24px`. Background — Dark: `--bg-base`; Light: `--bg-subtle`.

1. **Greeting row** (`margin-bottom: 18px`, baseline-aligned space-between):
   - Title "Good morning, Faridah" (`20px`, `600`, `--text-strong`, `letter-spacing: -0.01em`); subtitle "Term 2 · Week 9 · Tuesday, 18 June 2026" (`13px`, `--text-muted`).
   - Date-range chip: inline-flex, `gap: 6px`, `font-size: 12.5px`, `1px` border (`--border-default` dark / `--border-subtle` light), `background: --surface-card`, `padding: 7px 12px`, `border-radius: 8px`. Lucide `calendar` + "This term" + `chevron-down`.

2. **KPI row** — `display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 14px`. Each card: `background: --surface-card`, `1px` border `--border-subtle`, `border-radius: 12px` (`--radius-lg`), `padding: 16px`. Light theme adds `box-shadow: --shadow-xs`. Card internals: label row (`12px --text-muted` + Lucide icon `16×16 --text-faint`); value (`27px`, `700`, `--text-strong`, `letter-spacing: -0.02em`, `margin-top: 8px`) animated count-up; delta line (`11.5px`, `margin-top: 4px`).
   | Label | Icon | Value | Delta |
   |---|---|---|---|
   | Total students | `users` | `4,820` | +3.2% vs last term (`--success`, `trending-up`) |
   | Attendance today | `calendar-check` | `94.6%` | +1.1% vs avg (`--success`) |
   | Fees collected | `wallet` | `RM 1.42M` | 78% of term target (`--text-muted`) |
   | Teaching staff | `graduation-cap` | `312` | +6 this term (`--success`) |

3. **Attendance + Fee donut** — `grid-template-columns: 1.7fr 1fr; gap: 14px; margin-bottom: 14px`. Card chrome same as KPI cards.
   - **Attendance this week** (bar chart, `height: 150px`): 5 bars Mon–Fri, present rates 95/93/96/92/86. Bars `max-width: 42px`, `border-radius: 6px 6px 0 0`, heights 90/86/94/84/72%. Color — Dark: `--neutral-600`; Light: `--neutral-800`. **Friday is highlighted** in `--accent` (the dip). Each value labelled above, day below (`11px --text-muted`; Fri label `--accent`, `600`). Bars draw in with `barY` keyframe, staggered `.06s` each.
   - **Fee collection** donut: `124×124` `conic-gradient(<track> 0 78%, --accent 78% 100%)` — track is `--neutral-700` (dark) / `--neutral-800` (light). Inner hole `88×88`, `background: --surface-card`, centered "78%" (`22px`, `700`) over "collected" (`10.5px --text-muted`). Legend right: Collected RM 1.42M (track-color swatch), Outstanding RM 402K (`--accent` swatch). Swatches `9×9`, `border-radius: 3px`.

4. **Subject performance + At-risk** — `grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px`.
   - **Average score by subject** (horizontal bars, `gap: 13px`): Bahasa Melayu 82, Mathematics 76, Science 79, Sejarah 71, English 80. Each: label row (`12.5px`) with subject (`--text-body`) and score (`600 --text-strong`). Track `height: 8px`, `border-radius: 4px`, background — Dark: `--neutral-800`; Light: `--bg-subtle`. Fill width = score%, `border-radius: 4px`, animates via `barX` (`transform-origin: left`), staggered `.05s`. Fill color `--neutral-400` (dark) / `--neutral-800` (light); **Sejarah is the lowest** → fill `--accent`, score `--accent`.
   - **Students at risk** (AI module; gated by `showAdvanced`, see below): header has Lucide `sparkles --accent` + "Students at risk", and a pill "AI · 14 flagged" (`11px`, `600`, `--accent`, `background: --accent-wash`, `border-radius: 999px`). Rows (`gap: 8px`): each `1px` border `--border-subtle`, `border-radius: 9px`, `padding: 9px 11px`. `34×34` initials square (Dark: `--neutral-800` bg `--text-strong`; Light: `--onyx` bg `--off-white`). Name (`12.5px 600`) + class (`--text-faint`), reason (`11.5px --text-muted`, ellipsised). Right: level pill (`10px`, `700`, uppercase). Data:
     - **AH** Aiman Hakim · 5 Cendekia — "No logins for 6 days" — HIGH
     - **ML** Mei Ling · 4 Amanah — "Maths progress stalled at 40%" — MEDIUM
     - **AR** Arjun Raj · 5 Bestari — "Missed 3 assignments" — MEDIUM
     - (level pill colors come from the data: high = crimson tint, medium = warning tint)

5. **Events + Notices** — `grid-template-columns: 1fr 1fr; gap: 14px`.
   - **Upcoming events:** rows `padding: 9px 0`, `border-bottom: 1px solid --border-subtle`. Date block `width: 42px` centered — day (`17px 700 --text-strong`) over month (`10px --text-muted` uppercase). Detail has `border-left: 2px solid --accent`, `padding-left: 12px`: title (`13px 600 --text-strong`) + meta (`11.5px --text-muted`). Sample events: PTA Meeting, SPM Trial Exams, Sports Day, Term Break — substitute real data.
   - **Notice board:** header "Notice board" + "View all" (`12px 600 --accent`). Rows `gap: 11px`: `32×32` initials square (`border-radius: 8px`, bg `--neutral-800` dark / `--bg-subtle` light), text (`12.5px --text-body`, `line-height: 1.45`) + byline (`11px --text-faint`).

---

## Interactions & Behavior
- **Theme switch:** `theme` prop toggles Dark ⇄ Light. Identical structure; only surface/border/shadow/track colors differ (all mapped to semantic tokens, so a proper light/dark token set handles most of it automatically). Note the deliberate exceptions that stay dark in both themes: the **icon rail** (`--onyx`) and the light-theme user-card avatar (`--onyx`).
- **Sidebar collapse:** toggle button collapses Region 2 to `0px` width (animated, see above) and rotates the toggle icon `rotateY(180deg)`. State is **independent per theme** in the prototype; in production it's one piece of UI state. `transition: .22s var(--ease-out)`.
- **Count-up on load:** all `.cu` numbers animate from 0 to target over **950ms**, easing `1 - (1-t)³` (ease-out cubic). Respects formatting (thousands separators, `RM ` prefix, `%`/`M` suffix, decimal places). Runs once when the view first becomes visible. **Must be gated behind `prefers-reduced-motion` and a `animateData` toggle** — when off, numbers render at final value instantly.
- **Chart draw-in:** bars use `barY` (vertical, `transform-origin: bottom`) and `barX` (horizontal, `transform-origin: left`) keyframes, ~600ms `--ease-out`, staggered. Also gate behind reduced-motion.
- **View entrance:** when the dashboard mounts, content fades/slides in via a `viewIn` animation (~340ms `--ease-out`). Optional.
- **Hover states:** sidebar items shift background + text color (see Region 2). Primary CTA → darker crimson + larger glow + 1px lift (per design system). Keep crimson on hover, not as a full fill.

## State Management
- `theme: 'dark' | 'light'` — surface theme.
- `sidebarCollapsed: boolean` — Region 2 collapse.
- `activeView: 'summary' | 'performance' | 'operations'` — top-nav tab (only Summary is built out in the mock; Performance/Operations are placeholders to implement).
- `activeNavItem` — selected sidebar/rail item (Dashboard active in mock).
- `showAdvanced: boolean` — show/hide the AI "Students at risk" module.
- `animateData: boolean` — enable/disable count-up + chart animations.
- **Data fetching:** KPIs, attendance series, fee totals, subject averages, at-risk list (AI-scored), events, and notices should all come from the institution's live data. The mock uses static sample values listed above as the shape.

## Design Tokens
All values map to the **CodeSync Systems Design System** (`tokens/colors.css`, `tokens/effects.css`, `tokens/typography.css`, `tokens/spacing.css`). Use the semantic tokens; literals below are for reference.

**Core colors:** Onyx `#0D0D0D` (`--onyx`), Crimson `#8C151D` (`--accent` / `--crimson-500`), Off-White `#F5F5F3` (`--off-white`), Steel `#888888`. Crimson is a **signal**, never a large fill — one primary action per screen. Crimson glow on primary CTA only.
**Semantic (theme-aware):** `--bg-base`, `--bg-subtle`, `--surface-card`, `--surface-sunken`, `--text-strong`, `--text-body`, `--text-muted`, `--text-faint`, `--border-subtle`, `--border-default`, `--accent`, `--accent-hover`, `--accent-wash`, `--success`, `--warning`. Neutral ramp `--neutral-400 … --neutral-800` for chart fills.
**Typography:** Inter for all UI (this dashboard is product UI — no Sora here). Sizes used: 27 / 22 / 20 / 17 / 14 / 13.5 / 13 / 12.5 / 12 / 11.5 / 11 / 10px. Weights 400/500/600/700. Negative tracking on large numbers/headings (−0.01 to −0.02em); +0.06–0.08em uppercase on micro-labels.
**Spacing:** 4px base grid. Common gaps 14px (card grids), padding 16px (KPI) / 18–20px (panels) / 24px (content area).
**Radii:** 8px buttons/inputs/nav items (`--radius-md`), 9–11px small tiles, 12px cards (`--radius-lg`), 16px container (`--radius-xl`), 999px pills.
**Shadows:** `--shadow-xs` (light-theme cards), `--shadow-lg` (container), `--shadow-inset` (light search well), `--glow-crimson` (primary CTA).
**Motion:** count-up 950ms; chart draw ~600ms; sidebar collapse 220ms; view entrance ~340ms. Easing `--ease-out`. All wrapped in `prefers-reduced-motion: no-preference`.

## Assets
- **Icons:** [Lucide](https://lucide.dev) (`layout-dashboard`, `users`, `book-open`, `wallet`, `calendar-check`, `bar-chart-3`, `settings`, `building-2`, `graduation-cap`, `layers`, `file-text`, `plane`, `megaphone`, `panel-left`, `search`, `bell`, `plus`, `calendar`, `chevron-down`, `trending-up`, `sparkles`). Use your codebase's existing icon library if it already has one; otherwise add Lucide. ~1.75px stroke, `currentColor`.
- **Logo:** EduSync logo mark for the rail and a real avatar/initials for the user card. The design system ships `assets/logo-horizontal*.png` and `logo-vertical*.png` (default + white). The rail uses just the crimson mark.
- No photographic imagery.

## Files
- `EduSync LMS Redesign.dc.html` — the source prototype (uses the `<x-dc>` runtime + `support.js`; **reference only, do not port the runtime**). Both themes live in `data-view="c5"` (Dark) and `data-view="c6"` (Light) `<section>`s.
- `EduSync LMS Redesign - Standalone.html` — self-contained single-file build that opens in any browser offline. **Use this to view the design** — open it and toggle the Dark/Light tabs at the top.
