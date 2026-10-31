# Project: Roshan V N - Google Gemini Portfolio Restructuring

## Architecture
- **Design Philosophy**: Google Gemini Minimalist Aesthetic (Dark Obsidian Substrate `#0a0a0c`, Elevated Slate Surfaces `#131316` / `#1a1a1e` / `#2d2d34`, Subtle Grey Mesh Coordinates `#71717a` / `#a1a1aa`, Luminescent White Typography `#f4f4f5`, Hairline Structural Borders `rgba(255, 255, 255, 0.08)`). Created via Stitch MCP Server (Project `7897016753738391168`, Design System `assets/4209964919120080456`).
- **Layout & Section Ordering**:
  1. Fixed Glassmorphic Navigation Header (`#navbar`): Clean wordmark "Roshan V N", zero blue status dot, reordered links (`Projects`, `About`, `Skills`, `Contact`).
  2. Projects Showcase (`#projects`): Placed at the very top of the body immediately following navigation, before the intro/bio section.
  3. Bio & Overview Section (`#hero` / `#about`): Name strictly "Roshan V N", "Electronics & Communication Engineering" and all blue dots removed.
  4. Technical Skills Matrix (`#skills`): Clean dark card grid with subtle borders.
  5. Footer & Contact (`#contact`): Clean minimalist footer.
- **Interaction & Canvas Systems**:
  - **Google Gemini Pinned Horizontal Scroll**: `#projects` pinned to viewport while vertical page scroll drives the horizontal track translation (`translateX`) smoothly via GSAP ScrollTrigger scrub, synchronized with `01 / 08` counter, progress thumb, and Prev/Next buttons.
  - **Hover Wheel Pass-Through**: Zero wheel interception or `e.preventDefault()`. Wheel scrolling passes through smoothly without locking, trapping, or freezing when the cursor hovers over project cards.
  - **Interactive Grey Mesh Canvas**: High-performance fullscreen 2D canvas (`#bg-mesh-canvas`, `z-index: -2`) rendering subtle slate-grey coordinate mesh with gentle ambient trigonometric drift, spring mouse proximity displacement, batched 2-call drawing (<1.5% CPU), and Page Visibility sleep mode.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Stitch MCP Design System & Tokens | Google Gemini obsidian & slate grey palette, typography scales, and hairline borders | M1 | R3, Stitch MCP |
| F2 | Layout Reordering — Projects at Top | Move `#projects` immediately following navigation header, before intro/bio section | M1 | R1 |
| F3 | Header Elements & Name Cleansing | Remove "Electronics & Communication Engineering", remove blue dots, format name strictly as "Roshan V N" | M1 | R1 |
| F4 | Google Gemini Pinned Horizontal Scroll | Pinned horizontal scrolling driven by vertical page scroll with GSAP ScrollTrigger | M1 | R2 |
| F5 | Project Hover Scroll Pass-Through Fix | Eliminate wheel hijacking & `e.preventDefault()`, allowing continuous mouse wheel scroll over cards | M1 | R2 |
| F6 | Interactive Grey Mesh Canvas Background | Fullscreen background canvas with subtle slate-grey grid, ambient drift, and mouse physics | M1 | R3 |
| F7 | Responsive & Modal Integration | Maintain all 8 project cards, details modals, and smooth responsive mobile experience | M1 | Codebase / Canonical |
| F8 | Visual Verification & Console Cleanliness | Zero console errors, smooth 60fps animations, layout alignment inspection in browser | M2 | Acceptance Criteria |
| F9 | Forensic Integrity Audit | Systematic integrity check verifying genuine implementation, zero cheating/facades | M3 | Audit Enforcement |
| F10 | Git Commit & Remote Push | Clean commit and push to origin main at https://github.com/roshanvn1/roshan-portfolio | M4 | R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey & Exploration | 3 parallel explorers: DOM/Codebase, Interaction/Hover Fix/Mesh Canvas, Stitch MCP tokens | None | DONE |
| M1 | Core Implementation | Implement R1 (Header, Name, Relocation), R2 (Pinned scroll, hover fix), R3 (Grey mesh canvas, Stitch tokens) | M0 | DONE |
| M2 | Review & Verification | Independent review: HTML/CSS/JS validation, browser visual check, interactive scroll/hover test | M1 | DONE |
| M3 | Forensic Integrity Audit | Static analysis and runtime verification (veto check) | M2 | DONE |
| M4 | Remote Deployment | Commit all changes to Git and push to origin main at https://github.com/roshanvn1/roshan-portfolio | M3 | DONE |

## Interface Contracts
### `index.html` ↔ `style.css`
- Tokens: `--bg-canvas: #0a0a0c`, `--bg-surface-1: #131316`, `--bg-surface-2: #1a1a1e`, `--bg-surface-3: #2d2d34`, `--text-primary: #f4f4f5`, `--text-secondary: #a1a1aa`, `--text-muted: #71717a`, `--border-subtle: rgba(255, 255, 255, 0.08)`.
- Classes: `#projects` placed before `#hero`; `.projects-viewport` (`overflow: hidden`), `.projects-track`, `.project-card`, `.bg-mesh-canvas` (`position: fixed; inset: 0; z-index: -2; pointer-events: none`).
- Header: `.logo-text` = "Roshan V N" (no `.logo-status-dot`); `.hero-name` = "Roshan V N" (no `.hero-eyebrow`, no `.eyebrow-beacon`, no `.hero-accent`).

### `index.html` ↔ `script.js`
- GSAP 3 & ScrollTrigger initializes pinned horizontal scroll on `#projects` tracking `#projects-track`.
- `#bg-mesh-canvas` initialized via `initGreyMeshCanvas()` with passive pointer listeners.
- No `wheel` listener with `preventDefault()` attached to `#projects-viewport` or cards.

## Code Layout
- `d:\things_for_backup\github_website\`
  - `index.html` — Main website DOM structure (owned by Worker)
  - `style.css` — Styling and Google Gemini design tokens (owned by Worker)
  - `script.js` — Pinned horizontal scroll, grey mesh canvas, modal logic (owned by Worker)
  - `images/` — Project images (read-only)
- `.agents/teamwork/`
  - `orchestrator/` — Orchestrator state (`BRIEFING.md`, `progress.md`, `DISPATCH.md`, `GATE_STATUS.md`)
  - `explorer_r2_1/` — Explorer 1 DOM & codebase report
  - `explorer_r2_2/` — Explorer 2 Interaction & canvas mesh report
  - `explorer_r2_3/` — Explorer 3 Stitch MCP design system & screen concept
  - `worker_impl_r2/` — Implementation Worker working directory
  - `reviewer_r2_1/` — Reviewer working directory
  - `challenger_r2_1/` — Challenger working directory
  - `auditor_r2/` — Forensic Auditor working directory
