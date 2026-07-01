# 🏛️ PANTHEON

> **Assemble. Rise. Endure.**

A 3D superhero action game built with Three.js + Next.js. Personal project — no monetization, no app store, just for fun.

## 🎮 Play

The game runs as an installable PWA (Progressive Web App). Once deployed:
- Open the URL on your phone
- Tap "Add to Home Screen"
- Launch from your home screen — feels like a native app

## 🦸 Heroes (Planned: 12 · Phase 0: 1)

| # | Hero | Archetype | Status |
|---|------|-----------|--------|
| 1 | Velora | Speedster (Makkari-inspired) | ✅ Phase 0 playable |
| 2 | Stormborn | Thunder God | ⏳ Phase 1 |
| 3 | Aegis Wing | Flying Shield-Fighter | ⏳ Phase 1 |
| 4 | Arachne | Web-Slinger | ⏳ Phase 1 |
| 5 | Ironclad | Tech Armor | ⏳ Phase 1 |
| 6 | Glitch | Hacker (Virus-inspired) | ⏳ Phase 2 |
| 7 | Pulsar | Energy Blaster | ⏳ Phase 2 |
| 8 | Elasto | Elastic | ⏳ Phase 2 |
| 9 | Sentinel / Hollow | Duality (Sentry-inspired) | ⏳ Phase 2 |
| 10 | Mystic | Sorcerer | ⏳ Phase 2 |
| 11 | Veil | Invisible Woman + TK | ⏳ Phase 2 |
| 12 | Blaze | Human Torch | ⏳ Phase 2 |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **3D**: Three.js + React Three Fiber + Drei
- **Physics**: Rapier (WASM)
- **State**: Zustand
- **Touch Input**: nipplejs
- **Audio**: Howler.js
- **Deployment**: Vercel (PWA)

## 🚀 Run Locally

```bash
bun install
bun run dev
```

Open http://localhost:3000 — best on mobile viewport (Chrome DevTools device mode).

## 🎯 Vibe-Coder Workflow

All gameplay "feel" constants live in **`src/config/tuning.ts`**. That's the single file you tune — no other file needs to change for feel adjustments.

```typescript
// src/config/tuning.ts
export const TUNING = {
  velora: {
    sprintSpeed: 60,        // ← change this if sprint feels too slow
    cameraDistance: 8,      // ← change this if camera feels too close
    // ...etc
  }
}
```

## 📚 Documentation

- `download/Pantheon_GDD.pdf` — Full Game Design Document (63 pages)
  - 21 sections covering heroes, world, missions, enemies, story, roadmap

## 🗺️ Roadmap

| Phase | Scope |
|-------|-------|
| **0** ✅ | Prototype: Velora in Midtown, 1 crime type, basic enemy |
| **1** | 3-Hero Switcher: Add Ironclad + Arachne |
| **2** | Full 12-hero roster, all 4 districts, vehicle emergencies |
| **3** | Story campaign (25 missions), 5 factions, 10 bosses, HQ, Hero Phone |
| **4** | Advanced: hero-swap mid-mission, team-up combos, roguelike rifts |

## 📝 License

Personal project. No commercial use. All hero archetypes are original IP inspired by (but legally distinct from) existing comic characters.

---

Made with 🕷️ by **Super Z** (AI) + **Layo-DamzD** (vibe coder)
