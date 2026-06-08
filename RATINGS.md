# Rating calibration methodology

This game has **two rating layers**. Layer 1 is hand-authored and tunable; Layer 2 is
derived deterministically from Layer 1.

## Layer 1 — per-player `overall` (in `data.js`)

Each rating is the player's level **at that specific tournament** (peak/role at the time,
not career-best), on a scale **anchored to EA Sports FIFA in-game ratings** at each
tournament, verified against the games released closest to the event:

| Source anchor (verified) | Rating |
|---|---|
| FIFA 18 WC mode — Modrić, Griezmann | 89 |
| FIFA 18 WC mode — Kanté | 88 |
| FIFA 18 WC mode — Mbappé | 85 |
| FIFA 11 — Xavi, Robben, Iniesta | 87 |
| FIFA 11 — Sneijder | 86 |
| FIFA 23 WC — Messi, Mbappé (joint top) | 91 |

FIFA caps the modern best at ~91. Because this is an **all-time** game, the scale is
**gently extended above 91 only for the consensus greatest individual tournament
performances**, so the true GOATs sit above modern 91-rated players.

### Tier rubric (applied consistently across ALL eras)

| Band | Meaning | Examples |
|---|---|---|
| **94–95** | Greatest individual WC peaks (reserved) | Maradona '86 (95), Pelé '70 (94) |
| **91–93** | Era-defining, best-player-in-the-world | Cruyff '74, Beckenbauer '74, Garrincha '62, Puskás '54, Ronaldo '02, Romário '94, Messi '22 |
| **88–90** | World-class, elite at their position globally | Cannavaro '06, Buffon '06, Neuer '14, Eusébio '66, B. Charlton '66, Schiaffino '50, Matthäus '90, Sneijder '10 |
| **84–87** | Very good, key starters on strong sides | Cafu, Pirlo, Kanté, Rakitić, Kempes, Tardelli |
| **80–83** | Reliable international starters | most supporting cast |
| **76–79** | Squad players / starters on weaker sides | Brazil '70 keeper, full-backs of lesser teams |
| **73–75** | Lower-tier WC starters | Portugal '66 / Uruguay '50 role players |

Because eras are scored on **one shared rubric**, a 1950s great and a 2010s great are
directly comparable — "best in the world that year" maps to the same band regardless of decade.

Every rating lives on one line in `data.js` and is trivial to change. Adjusting a number
here automatically flows through to squad ratings AND that team's AI strength (see Layer 2).

## Layer 2 — squad & opponent strength (in `engine.js`, derived)

Nothing here is hand-tuned — it's all computed from Layer 1:

- **Effective rating** = `overall × chemistry`, chemistry = position-fit multiplier
  (1.00 natural / 0.99 / 0.98 / 0.93 out of position; floored at 40).
- **Line ratings** = mean effective rating per line (Attack / Midfield / Defence / GK).
- **Overall** = weighted blend **Attack 0.30 · Midfield 0.30 · Defence 0.28 · GK 0.12**.
- **Team AI strength** = the overall of that team's **best XI**, built by greedily assigning
  its players to a 4-3-3 by best fit, then run through the same formula above.
  → This makes a historical team's opponent strength *exactly* what a drafted version of
  that team would rate. **One source of truth: change a player rating and the team's
  strength moves with it.** (`TEAMS[].strength` in data.js is now only a display fallback.)
- **Match odds.** Because filling all 11 slots compresses overalls into a narrow band
  (~79-85), a *competitiveness curve* (`curveStrength`, pivot 81 x factor 1.7) widens the
  gap symmetrically before it drives match odds, and `RATING_SENSITIVITY` sets how
  decisively that gap shows on the scoreboard. Tuned so a ~91 all-time XI wins the World
  Cup ~78% of the time; both knobs live at the top of `engine.js`.

## What changed in this calibration pass

1. Modern players pulled in line with their tournament-era FIFA ratings (removed ~2–4 pt inflation).
2. All players re-banded onto the shared tier rubric for cross-era consistency.
3. Team strengths switched from hand-guessed constants to **derived from the squad**.
