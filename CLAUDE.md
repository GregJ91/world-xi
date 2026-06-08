# World XI

A World Cup squad-builder + tournament simulator. Spin a country + World Cup year, draft an
all-time XI from football history, then simulate a full World Cup against the greatest
historical teams. A reskin/spin-off of the Premier-League game **38-0** (https://38-0.app),
whose engine math was ported and adapted.

## Run / build / test

- **No build step, no dependencies.** Pure HTML/CSS/JS — open `index.html` in a browser.
- **Node/npm are NOT installed** on this machine, so don't introduce a toolchain or `npm`-based tests.
- **Headless smoke test** (the way to verify changes without Node — uses installed Edge):
  ```powershell
  $edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  Start-Process -FilePath $edge -ArgumentList '--headless=new','--disable-gpu','--no-sandbox',`
    '--virtual-time-budget=6000','--dump-dom','file:///C:/Users/.../index.html' `
    -RedirectStandardOutput out.html -NoNewWindow -Wait
  ```
  (Edge's stdout isn't captured by the call operator — must `-RedirectStandardOutput` to a file.)
  Then grep the dumped DOM for JS-generated content (e.g. setup pills) to confirm scripts ran
  with no errors. For engine logic, write a temp `_test.html` that includes `data.js`+`engine.js`,
  runs a scenario, and writes results into a `<pre>`; dump-dom and read it. Delete temp files after.

## Deploy / hosting

- **Public repo:** https://github.com/GregJ91/world-xi — **live site:** https://gregj91.github.io/world-xi/ (GitHub Pages, deploy-from-branch `main` / root). Every push to `main` auto-redeploys in ~1–2 min.
- git 2.54 + GitHub CLI 2.93 are installed (via winget); not on the default shell PATH, so prefix calls: `& "C:\Program Files\Git\cmd\git.exe"` and `& "C:\Program Files\GitHub CLI\gh.exe"`. git pushes auth through Windows Credential Manager.
- To ship a change: `git add -A; git commit -m "…"; git push origin main`. Pages does the rest.

## Files (load order matters: data → engine → app)

- `data.js` — the dataset. `TEAMS` (country-year units, the draft "wheel"), `PLAYERS`
  (`{id,name,nationality,positions[],caps:[{team,overall}]}`; `positions[0]` is natural).
  A player can have multiple `caps` (e.g. Pelé 1958 & 1970); `prime` is auto-derived as max cap.
  `PLAYERS_BY_TEAM` is the draft lookup. **Add a team:** add to `TEAMS` + players whose caps reference it.
- `engine.js` — pure functions, no DOM. Ratings (chemistry/line/overall), seeded LCG RNG,
  Poisson goals, scorer/assist weighting, and `simulateWorldCup`. The tournament **auto-scales
  to the dataset size**: ≥47 teams → 48-team (12 groups → top 2 + 8 best thirds → R32 → R16 →
  QF → SF → Final), ≥31 → 32-team (8 groups → R16 → …), else 16-team (4 groups → QF → …).
  Knockout is a generic strength-seeded single-elim (`seedOrder`/`roundName`); every match is
  simulated so there's a real champion. `FORMATIONS` (9) and `REROLL_COUNTS` live here.
  **Currently 32 teams in `data.js` (R16 active); add toward 48 to unlock the Round of 32.**
- `app.js` — UI/state (vanilla, no framework). Screen flow: setup → draft → summary → results.
- `styles.css` — dark theme.
- `RATINGS.md` — **the rating calibration methodology. Read before changing any ratings.**

## How things work (key conventions)

- **Ratings** are calibrated and documented in `RATINGS.md`: per-player `overall` is FIFA-anchored
  at tournament time, extended above 91 only for all-time peaks (Maradona '86=95, Pelé '70=94).
- **Team AI strength is DERIVED**, not hand-set: `bestXIStrength` builds each team's best XI
  across all formations and runs the same `squadRating`. One source of truth — change a player
  rating and the team's strength follows. (`TEAMS[].strength` is only a display fallback.)
- **Balance knobs** at the top of `engine.js`: `RATING_SENSITIVITY` and `curveStrength`
  (`CURVE_PIVOT`/`CURVE_FACTOR`). Squad overalls cluster ~79–85; the curve widens the gap so
  the better side is favoured. Tuned so a ~91 all-time XI wins the WC ~78% of the time.
- **Chemistry / position fit**: multiplier 1.00 natural / 0.99 / 0.98 / 0.93 out-of-position
  (floored at 40). Adjacency map `POS_ADJ`; wing-backs (LWB/RWB) only count as a player's primary.
- **Draft modes** (setup screen): formation (9), difficulty = total reroll pool for the whole
  draft (Easy 10 / Hard 3 / PEP 0 — does NOT reset between picks), rating mode (Career =
  at-tournament / Prime = peak), and a
  year-range filter for the wheel. Players whose positions are all filled grey out; a player who
  fits 2+ open positions triggers a position chooser.
