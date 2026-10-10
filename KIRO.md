# 🤖 How We Used Kiro (AWS AI IDE)

> Kiro is the official AI tool for Islamabad Hack 2026. This document is our Kiro usage evidence — covering **15/100 judging points**.

## Our Kiro Workflow

We used Kiro as a **spec-driven development partner** across the entire build — not as a one-off code generator.

### 1. Specs First (Kiro Spec Mode)
We wrote requirements as structured specs before coding:

```
spec: medicine-interaction-checker
  requirement: User selects 2+ medicines and sees severity-rated interactions
    scenario: Aspirin + Warfarin → Dangerous, shown with bleeding-risk advice
    scenario: Panadol + Paracetamol → flagged as duplicate paracetamol (Major)
  requirement: Family members have separate medicine lists
  requirement: Safety score derived from active warnings
```

Kiro turned each spec into tasks with acceptance criteria, then implemented them task-by-task — so every feature shipped with a defined "done".

### 2. Steer Conversations (Real Prompts We Used)

| Phase | Prompt to Kiro |
|-------|----------------|
| Architecture | "Design an ASP.NET Core 10 + EF Core + SQL Server schema for medicines, interactions (bidirectional pairs), users, family members, and user medicines. Use BCrypt + JWT." |
| Interaction logic | "In InteractionsController, check all distinct pairs of selected medicine IDs. Query bidirectionally (A→B or B→A). If no row exists, return severity Safe with generic advice." |
| UI system | "Create a Tailwind v4 design system: dark glassmorphism cards, gradient medical buttons, severity-safe/mild/dangerous classes with colored left borders. Animated with CSS keyframes." |
| Charts | "Add a safety donut and weekly activity area chart using recharts, styled to match our glass theme." |
| Fuzzy search | "Implement Levenshtein-based fuzzy scoring in the medicines endpoint: exact=100, prefix=80, contains=60, edit-distance≤2=40-5d." |
| Demo data | "Add POST /api/demo/seed that creates a demo user (Ayesha Khan) with 5 medicines including a known Warfarin+Brufen dangerous pair, plus a family member." |
| Testing | "Write xUnit tests for InteractionsController using EF InMemory: bad input, known interaction, symmetric pair, dedupe, 3-medicine pair count." |
| PWA | "Make the Next.js app installable: manifest.ts, theme color, SVG icon, standalone display." |
| Animations | "Build ParticleField, AuroraBg, RadarScanner, and Confetti components — but avoid Math.random() at render time because Next 16 prerender blocks it. Use a seeded sin-based pseudo-random." |

### 3. Debugging with Kiro
- **Swashbuckle + .NET 10 OpenApi conflict** — Kiro diagnosed the `Microsoft.OpenApi` 1.x vs 2.x namespace split (`Models` removed in 2.x) and fixed the package reference combination.
- **Next.js 16 prerender error** — `Math.random()` in client components during static generation; Kiro suggested the seeded-random pattern.
- **React hooks lint error** — `useMemo` placed after an early `return`; Kiro moved it above the guard.

### 4. Files Kiro Helped Produce
```
backend/PillWise.API/           — 8 controllers, 6 models, seeder, Swagger, Serilog, rate limiting
backend/PillWise.Tests/         — 7 passing xUnit tests
frontend/app/                   — 12 routes (landing, home, search, checker, scan, medicine, family...)
frontend/components/            — 25+ components (charts, visuals, chatbot, PDF, share card, reminders...)
.github/workflows/ci.yml        — CI: backend test + frontend build on every push
```

## Impact
- **~70% of boilerplate code** generated via Kiro spec→task workflow
- **All debugging sessions** above resolved with Kiro assistance
- **Zero "vibe-coded" features** — every feature started from a written spec with acceptance criteria

---
*Team PillWise — Islamabad Hack 2026 — Built with Kiro*
