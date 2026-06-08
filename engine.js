/* =============================================================================
 * engine.js — ratings + World Cup simulation
 *
 * Ported from 38-0's core math, then adapted from a 38-game league to a real
 * World Cup: 16-team field, 4 groups of 4 (top 2 advance), then an 8-team
 * knockout (QF -> SF -> Final). EVERY match is simulated, so there is a real
 * champion even when your XI is eliminated.
 *
 * Pure functions only — no DOM. app.js drives the UI and calls into here.
 * ========================================================================== */

/* ---------- Formations (slot layout on a vertical pitch, x/y in %) ---------- */
const FORMATIONS = {
  "4-3-3": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rb",  position:"RB", x:82, y:72 }, { id:"cb1", position:"CB", x:62, y:74 },
    { id:"cb2", position:"CB", x:38, y:74 }, { id:"lb",  position:"LB", x:18, y:72 },
    { id:"cm1", position:"CM", x:68, y:50 }, { id:"cm2", position:"CM", x:50, y:46 },
    { id:"cm3", position:"CM", x:32, y:50 },
    { id:"rw",  position:"RW", x:80, y:24 }, { id:"st",  position:"ST", x:50, y:18 },
    { id:"lw",  position:"LW", x:20, y:24 },
  ],
  "4-4-2": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rb",  position:"RB", x:82, y:72 }, { id:"cb1", position:"CB", x:62, y:74 },
    { id:"cb2", position:"CB", x:38, y:74 }, { id:"lb",  position:"LB", x:18, y:72 },
    { id:"rm",  position:"RM", x:82, y:46 }, { id:"cm1", position:"CM", x:60, y:50 },
    { id:"cm2", position:"CM", x:40, y:50 }, { id:"lm",  position:"LM", x:18, y:46 },
    { id:"st1", position:"ST", x:60, y:20 }, { id:"st2", position:"ST", x:40, y:20 },
  ],
  "3-5-2": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"cb1", position:"CB", x:68, y:74 }, { id:"cb2", position:"CB", x:50, y:76 },
    { id:"cb3", position:"CB", x:32, y:74 },
    { id:"rwb", position:"RWB",x:86, y:50 }, { id:"cm1", position:"CM", x:64, y:52 },
    { id:"cam", position:"CAM",x:50, y:40 }, { id:"cm2", position:"CM", x:36, y:52 },
    { id:"lwb", position:"LWB",x:14, y:50 },
    { id:"st1", position:"ST", x:60, y:20 }, { id:"st2", position:"ST", x:40, y:20 },
  ],
  "4-2-3-1": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rb",  position:"RB", x:82, y:72 }, { id:"cb1", position:"CB", x:62, y:74 },
    { id:"cb2", position:"CB", x:38, y:74 }, { id:"lb",  position:"LB", x:18, y:72 },
    { id:"cdm1",position:"CDM",x:62, y:56 }, { id:"cdm2",position:"CDM",x:38, y:56 },
    { id:"lm",  position:"LM", x:20, y:38 }, { id:"cam", position:"CAM",x:50, y:36 },
    { id:"rm",  position:"RM", x:80, y:38 },
    { id:"st",  position:"ST", x:50, y:18 },
  ],
  "4-1-2-1-2": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rb",  position:"RB", x:82, y:72 }, { id:"cb1", position:"CB", x:62, y:74 },
    { id:"cb2", position:"CB", x:38, y:74 }, { id:"lb",  position:"LB", x:18, y:72 },
    { id:"cdm", position:"CDM",x:50, y:58 },
    { id:"cm1", position:"CM", x:72, y:46 }, { id:"cm2", position:"CM", x:28, y:46 },
    { id:"cam", position:"CAM",x:50, y:34 },
    { id:"st1", position:"ST", x:60, y:18 }, { id:"st2", position:"ST", x:40, y:18 },
  ],
  "3-4-3": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"cb1", position:"CB", x:68, y:74 }, { id:"cb2", position:"CB", x:50, y:76 },
    { id:"cb3", position:"CB", x:32, y:74 },
    { id:"rm",  position:"RM", x:84, y:50 }, { id:"cm1", position:"CM", x:60, y:52 },
    { id:"cm2", position:"CM", x:40, y:52 }, { id:"lm",  position:"LM", x:16, y:50 },
    { id:"rw",  position:"RW", x:80, y:22 }, { id:"st",  position:"ST", x:50, y:18 },
    { id:"lw",  position:"LW", x:20, y:22 },
  ],
  "4-5-1": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rb",  position:"RB", x:82, y:72 }, { id:"cb1", position:"CB", x:64, y:74 },
    { id:"cb2", position:"CB", x:36, y:74 }, { id:"lb",  position:"LB", x:18, y:72 },
    { id:"rm",  position:"RM", x:86, y:48 }, { id:"cm1", position:"CM", x:66, y:52 },
    { id:"cm2", position:"CM", x:50, y:48 }, { id:"cm3", position:"CM", x:34, y:52 },
    { id:"lm",  position:"LM", x:14, y:48 },
    { id:"st",  position:"ST", x:50, y:18 },
  ],
  "5-3-2": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rwb", position:"RWB",x:88, y:58 }, { id:"cb1", position:"CB", x:70, y:76 },
    { id:"cb2", position:"CB", x:50, y:78 }, { id:"cb3", position:"CB", x:30, y:76 },
    { id:"lwb", position:"LWB",x:12, y:58 },
    { id:"cm1", position:"CM", x:66, y:48 }, { id:"cm2", position:"CM", x:50, y:46 },
    { id:"cm3", position:"CM", x:34, y:48 },
    { id:"st1", position:"ST", x:60, y:20 }, { id:"st2", position:"ST", x:40, y:20 },
  ],
  "5-4-1": [
    { id:"gk",  position:"GK", x:50, y:90 },
    { id:"rwb", position:"RWB",x:88, y:58 }, { id:"cb1", position:"CB", x:70, y:76 },
    { id:"cb2", position:"CB", x:50, y:78 }, { id:"cb3", position:"CB", x:30, y:76 },
    { id:"lwb", position:"LWB",x:12, y:58 },
    { id:"rm",  position:"RM", x:84, y:46 }, { id:"cm1", position:"CM", x:62, y:50 },
    { id:"cm2", position:"CM", x:38, y:50 }, { id:"lm",  position:"LM", x:16, y:46 },
    { id:"st",  position:"ST", x:50, y:18 },
  ],
};

const REROLL_COUNTS = { easy: 10, hard: 3, pep: 0 };   // rerolls PER PLAYER (reset each pick)

/* ---------- Position fit / chemistry (ported 1:1 from 38-0) ---------- */
const POS_ADJ = {
  RM:["RM","RW"], LM:["LM","LW"], RW:["RW","RM"], LW:["LW","LM"],
  RWB:["RB","RM"], LWB:["LB","LM"], CM:["CM","CAM","CDM"], CDM:["CDM","CM"], CAM:["CAM","CM"],
};
const STRICT_WB = new Set(["LWB","RWB"]);
const ATT_WIDE  = new Set(["ST","CAM","LW","RW","LM","RM"]);
const FIT = { perfect:1.0, second:0.99, third:0.98, none:0.93 };

function fitIndex(slotPos, playerPositions) {
  if (!playerPositions || playerPositions.length === 0) return -1;
  if (slotPos === "LW" || slotPos === "RW") {
    const alt = slotPos === "LW" ? "LM" : "RM";
    for (let i = 0; i < playerPositions.length; i++)
      if (playerPositions[i] === slotPos || (playerPositions[i] === alt && ATT_WIDE.has(playerPositions[0]))) return i;
    return -1;
  }
  const accepts = POS_ADJ[slotPos] ?? [slotPos];
  if (STRICT_WB.has(slotPos)) return accepts.includes(playerPositions[0]) ? 0 : -1;
  for (let i = 0; i < playerPositions.length; i++)
    if (accepts.includes(playerPositions[i])) return i;
  return -1;
}
function fitMultiplier(slotPos, playerPositions) {
  const i = fitIndex(slotPos, playerPositions);
  if (i === 0) return FIT.perfect;
  if (i === 1) return FIT.second;
  if (i >= 2) return FIT.third;
  return FIT.none;
}
function effectiveRating(pick) {
  return Math.max(40, pick.overallUsed * fitMultiplier(pick.slot.position, pick.player.positions));
}

/* ---------- Line + overall ratings (ported weights from 38-0) ---------- */
function squadRating(picks) {
  if (picks.length === 0) return { overall:0, attack:0, midfield:0, defence:0, goalkeeping:0 };
  const lineAvg = (positions) => {
    const inLine = picks.filter(p => positions.includes(p.slot.position));
    if (inLine.length === 0) return 0;
    return inLine.reduce((s, p) => s + effectiveRating(p), 0) / inLine.length;
  };
  const attack    = lineAvg(["ST","LW","RW","CAM"]);
  const midfield  = lineAvg(["CM","CDM","LM","RM","LWB","RWB"]);
  const defence   = lineAvg(["CB","LB","RB"]);
  const gks       = picks.filter(p => p.slot.position === "GK");
  const goalkeeping = gks.length ? gks.reduce((s, p) => s + effectiveRating(p), 0) / gks.length : 0;
  const lines = [
    { val: attack, w: 0.30 }, { val: midfield, w: 0.30 },
    { val: defence, w: 0.28 }, { val: goalkeeping, w: 0.12 },
  ].filter(l => l.val > 0);
  const wSum = lines.reduce((s, l) => s + l.w, 0);
  const overall = Math.round(lines.reduce((s, l) => s + (l.w / wSum) * l.val, 0));
  return { overall, attack:Math.round(attack), midfield:Math.round(midfield),
           defence:Math.round(defence), goalkeeping:Math.round(goalkeeping) };
}

/* ---------- Derived team strength = overall of that team's best XI ----------
 * Greedily assign a team's players to a 4-3-3 by best positional fit (strongest
 * players first), then run the same squadRating() used for the user. This makes a
 * historical team's AI strength a function of its player ratings — change a rating
 * in data.js and the team's strength moves with it. */
function fillFormation(teamPlayers, formationKey) {
  const slots = FORMATIONS[formationKey].map(s => ({ slot: s, taken: false }));
  const sorted = [...teamPlayers].sort((a, b) => b.overall - a.overall);
  const picks = [];
  for (const tp of sorted) {
    if (picks.length >= 11) break;
    let best = null, bestM = -1;
    for (const s of slots) {
      if (s.taken) continue;
      const m = fitMultiplier(s.slot.position, tp.player.positions);
      if (m > bestM) { bestM = m; best = s; }
    }
    if (best) { best.taken = true; picks.push({ player: tp.player, slot: best.slot, overallUsed: tp.overall }); }
  }
  return squadRating(picks).overall;
}
// best XI overall across all formations (so a team isn't penalised for shape)
function bestXIStrength(teamPlayers) {
  return Math.max(...Object.keys(FORMATIONS).map(k => fillFormation(teamPlayers, k)));
}
const DERIVED_STRENGTH = (() => {
  const out = {};
  const data = window.WC_DATA;
  if (data && data.PLAYERS_BY_TEAM)
    for (const id in data.PLAYERS_BY_TEAM) out[id] = bestXIStrength(data.PLAYERS_BY_TEAM[id]);
  return out;
})();

/* ---------- Seeded RNG (LCG, from 38-0) + Poisson (Knuth) ---------- */
function makeRng(seed) {
  let a = seed >>> 0;
  return () => ((a = (Math.imul(1664525, a) + 0x3c6ef35f) | 0) >>> 0) / 0xffffffff;
}
function poisson(rng, lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= rng(); } while (p > L);
  return k - 1;
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Balance knobs. Squad overalls cluster (filling all 11 slots compresses them), so a
 * "competitiveness curve" widens the gap symmetrically before it drives match odds, and
 * RATING_SENSITIVITY controls how decisively that gap shows up on the scoreboard.
 * Tune these two numbers to taste — higher = favourites win more, upsets rarer. */
const RATING_SENSITIVITY = 0.07;          // goals per rating point of gap (was 0.055)
const CURVE_PIVOT = 81, CURVE_FACTOR = 1.7;
const curveStrength = (x) => CURVE_PIVOT + (x - CURVE_PIVOT) * CURVE_FACTOR;

/* ---------- Goal-scorer / assist weighting (ported) ---------- */
const SCORER_W = { GK:0, LB:2, CB:1, RB:2, LWB:2, RWB:2, CDM:3, CM:8, CAM:13, LM:9, RM:9, LW:15, RW:15, ST:20 };
const ASSIST_W = { GK:0, LB:4, CB:1, RB:4, LWB:5, RWB:5, CDM:4, CM:9, CAM:14, LM:11, RM:11, LW:13, RW:13, ST:8 };
const ratingScale = (r, exp) => Math.pow(Math.max(40, r) / 80, exp);
const SCORER_EXP = 4, ASSIST_EXP = 3.5;

function pickWeighted(rng, picks, weightMap, exp, excludeName) {
  const pool = excludeName ? picks.filter(p => p.player.name !== excludeName) : picks;
  const weights = pool.map(p => (weightMap[p.slot.position] ?? 0) * ratingScale(effectiveRating(p), exp));
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return null;
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) if ((r -= weights[i]) <= 0) return pool[i].player.name;
  return pool[pool.length - 1].player.name;
}

/* ---------- One USER match ---------- */
function simMatch(rng, picks, rating, opp, knockout) {
  const diff = curveStrength(rating.overall) - curveStrength(opp.strength);
  const attackTilt  = (rating.attack  - rating.overall) * 0.025;
  const defenceTilt = (rating.defence - rating.overall) * 0.025;
  const lambdaFor      = clamp(1.30 + diff * RATING_SENSITIVITY + attackTilt, 0.15, 4.8);
  const lambdaAgainst  = clamp(1.30 - diff * RATING_SENSITIVITY - defenceTilt, 0.10, 4.5);

  let gf = poisson(rng, lambdaFor);
  let ga = poisson(rng, lambdaAgainst);

  let decided = null;          // 'et' | 'pens'
  if (knockout && gf === ga) {
    gf += poisson(rng, lambdaFor * 0.32);
    ga += poisson(rng, lambdaAgainst * 0.32);
    if (gf !== ga) decided = "et";
    else {
      const pWin = clamp(0.5 + diff * 0.012 + (rating.goalkeeping - opp.strength) * 0.004, 0.2, 0.8);
      if (rng() < pWin) gf += 1; else ga += 1;   // shootout recorded as +1 to winner
      decided = "pens";
    }
  }

  const result = gf > ga ? "W" : gf < ga ? "L" : "D";
  const scorers = [];
  const realGoals = decided === "pens" ? gf - 1 : gf;
  for (let i = 0; i < realGoals; i++) {
    const minute = Math.floor(90 * rng()) + 1;
    const scorer = pickWeighted(rng, picks, SCORER_W, SCORER_EXP) ?? "Own goal";
    const assist = (rng() > 0.72) ? undefined : pickWeighted(rng, picks, ASSIST_W, ASSIST_EXP, scorer);
    scorers.push({ minute, scorer, assist });
  }
  scorers.sort((a, b) => a.minute - b.minute);
  return { opponent: opp.name, flag: opp.flag, goalsFor: gf, goalsAgainst: ga, result, decided, scorers };
}

/* ---------- AI-vs-AI match (strengths only) ---------- */
function simAiMatch(rng, sA, sB) {
  const diff = curveStrength(sA) - curveStrength(sB);
  const ga = poisson(rng, clamp(1.30 + diff * RATING_SENSITIVITY, 0.15, 4.5));
  const gb = poisson(rng, clamp(1.30 - diff * RATING_SENSITIVITY, 0.15, 4.5));
  return [ga, gb];
}

/* strength-weighted distinct draw of `count` teams */
function drawOpponents(rng, allTeams, count, excludeIds) {
  const pool = allTeams.filter(t => !excludeIds.has(t.id));
  const picked = [], used = new Set();
  while (picked.length < count && picked.length < pool.length) {
    const avail = pool.filter(t => !used.has(t.id));
    const weights = avail.map(t => Math.pow(t.strength, 3));
    const total = weights.reduce((s, w) => s + w, 0);
    let r = rng() * total, chosen = avail[avail.length - 1];
    for (let i = 0; i < avail.length; i++) if ((r -= weights[i]) <= 0) { chosen = avail[i]; break; }
    used.add(chosen.id); picked.push(chosen);
  }
  return picked;
}

/* ---------- Full World Cup (16-team: 4 groups -> 8-team knockout) ---------- */
function simulateWorldCup(game, allTeams, seedOverride) {
  const rating = squadRating(game.picks);
  const seed = (seedOverride ?? (Date.now() & 0xffffffff)) >>> 0;
  const rng = makeRng((0x9e3779b9 ^ seed) >>> 0);
  const label = (t) => `${t.flag} ${t.country} ${t.year}`;

  // use DERIVED strengths (from each team's best XI) rather than hand-set fallbacks
  const teams = allTeams.map(t => ({ ...t, strength: DERIVED_STRENGTH[t.id] ?? t.strength }));
  const user = { id:"__USER__", label:"⭐ Your XI", flag:"⭐", strength: rating.overall,
                 isUser:true, picks: game.picks, rating };
  const ai = drawOpponents(rng, teams, 15, new Set())
    .map(t => ({ id:t.id, label:label(t), flag:t.flag, strength:t.strength, isUser:false }));
  const field = [user, ...ai];

  // seed into 4 pots by strength, shuffle each pot, deal one per group
  const byStrength = [...field].sort((a, b) => b.strength - a.strength);
  const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } };
  const groupCount = 4;
  const pots = [];
  for (let p = 0; p < groupCount; p++) { const pot = byStrength.slice(p * 4, p * 4 + 4); shuffle(pot); pots.push(pot); }
  const groups = Array.from({ length: groupCount }, () => []);
  pots.forEach(pot => pot.forEach((t, i) => { if (groups[i]) groups[i].push(t); }));

  // simulate every group
  const userMatches = [];
  const groupTables = groups.map((grp, gi) => {
    const rows = {}; grp.forEach(t => rows[t.id] = { team:t, P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0 });
    const apply = (id, gf, ga) => { const r = rows[id]; r.P++; r.GF += gf; r.GA += ga;
      if (gf > ga) { r.W++; r.Pts += 3; } else if (gf === ga) { r.D++; r.Pts++; } else r.L++; };
    for (let i = 0; i < grp.length; i++) for (let j = i + 1; j < grp.length; j++) {
      const A = grp[i], B = grp[j];
      if (A.isUser || B.isUser) {
        const u = A.isUser ? A : B, opp = A.isUser ? B : A;
        const m = simMatch(rng, u.picks, u.rating, { name:opp.label, flag:opp.flag, strength:opp.strength }, false);
        m.stage = "Group"; userMatches.push(m);
        apply(u.id, m.goalsFor, m.goalsAgainst); apply(opp.id, m.goalsAgainst, m.goalsFor);
      } else {
        const [ga, gb] = simAiMatch(rng, A.strength, B.strength);
        apply(A.id, ga, gb); apply(B.id, gb, ga);
      }
    }
    const standings = Object.values(rows).sort((a, b) =>
      b.Pts - a.Pts || (b.GF - b.GA) - (a.GF - a.GA) || b.GF - a.GF);
    return { groupIndex: gi, standings };
  });

  // user's group + finishing position
  let userGroup = null, userPos = 0;
  groupTables.forEach(gt => { const idx = gt.standings.findIndex(r => r.team.isUser);
    if (idx >= 0) { userGroup = gt; userPos = idx + 1; } });
  const advanced = userPos > 0 && userPos <= 2;

  // qualifiers (top 2 per group) -> QF pairings cross-group
  const q = groupTables.map(gt => ({ w: gt.standings[0].team, r: gt.standings[1].team }));
  const qfPairs = [[q[0].w, q[1].r], [q[2].w, q[3].r], [q[1].w, q[0].r], [q[3].w, q[2].r]];

  const bracket = [];
  function play(home, away, roundName) {
    if (home.isUser || away.isUser) {
      const u = home.isUser ? home : away, opp = home.isUser ? away : home;
      const m = simMatch(rng, u.picks, u.rating, { name:opp.label, flag:opp.flag, strength:opp.strength }, true);
      m.stage = roundName; userMatches.push(m);
      const userWon = m.result === "W";
      const hs = home.isUser ? m.goalsFor : m.goalsAgainst;
      const as = away.isUser ? m.goalsFor : m.goalsAgainst;
      return { home, away, score:`${hs}-${as}`, winner: userWon ? u : opp, decided:m.decided, isUser:true };
    }
    let [ga, gb] = simAiMatch(rng, home.strength, away.strength);
    let decided = null;
    if (ga === gb) { const p = clamp(0.5 + (home.strength - away.strength) * 0.012, 0.2, 0.8);
      if (rng() < p) ga++; else gb++; decided = "pens"; }
    return { home, away, score:`${ga}-${gb}`, winner: ga > gb ? home : away, decided, isUser:false };
  }
  function round(pairs, name) { const ties = pairs.map(([h, a]) => play(h, a, name)); bracket.push({ round:name, ties }); return ties.map(t => t.winner); }

  const sfTeams    = round(qfPairs, "Quarter-Final");
  const finalTeams = round([[sfTeams[0], sfTeams[1]], [sfTeams[2], sfTeams[3]]], "Semi-Final");
  const champion   = round([[finalTeams[0], finalTeams[1]]], "Final")[0];

  const championsLifted = champion.isUser;
  const eliminated = !championsLifted;
  let userFinish;
  if (championsLifted) userFinish = "Champions";
  else if (!advanced) userFinish = "Group Stage exit";
  else {
    let lostRound = "Quarter-Final";
    for (const m of userMatches) if (m.stage !== "Group" && m.result === "L") { lostRound = m.stage; break; }
    userFinish = `Lost in the ${lostRound}`;
  }

  /* ---- aggregate user stats, awards, achievements ---- */
  let wins=0, draws=0, losses=0, gf=0, ga=0, cleanSheets=0;
  const goals = new Map(), assists = new Map();
  for (const m of userMatches) {
    if (m.result === "W") wins++; else if (m.result === "D") draws++; else losses++;
    gf += m.goalsFor; ga += m.goalsAgainst;
    if (m.goalsAgainst === 0) cleanSheets++;
    for (const s of m.scorers) {
      goals.set(s.scorer, (goals.get(s.scorer) ?? 0) + 1);
      if (s.assist) assists.set(s.assist, (assists.get(s.assist) ?? 0) + 1);
    }
  }
  const topOf = (map) => { let best=null,n=-1; for (const [k,v] of map) if (v>n){best=k;n=v;} return best?{name:best,count:n}:null; };
  const goldenBoot = topOf(goals);
  const contrib = new Map();
  for (const [k, v] of goals) contrib.set(k, (contrib.get(k) ?? 0) + v);
  for (const [k, v] of assists) contrib.set(k, (contrib.get(k) ?? 0) + v);
  const playerOfTournament = topOf(contrib);

  const achievements = [];
  const allOneNation = game.picks.length === 11 &&
    game.picks.every(p => p.player.nationality === game.picks[0].player.nationality);
  if (championsLifted) achievements.push(["CHAMPIONS", "🏆 WORLD CHAMPIONS"]);
  if (championsLifted && losses === 0 && draws === 0) achievements.push(["PERFECT", "PERFECT RUN — won every game"]);
  else if (championsLifted && losses === 0) achievements.push(["INVINCIBLE", "INVINCIBLES — unbeaten champions"]);
  if (championsLifted && ga === 0) achievements.push(["FORTRESS", "FORTRESS — lifted it without conceding"]);
  if (championsLifted && allOneNation) achievements.push(["GOLDEN_GEN", "GOLDEN GENERATION — one-nation champions"]);
  if (!advanced && losses === 0) achievements.push(["UNBEATEN_OUT", "UNBEATEN but OUT — group draws cost you"]);
  if (gf >= 15) achievements.push(["GOAL_FEST", `GOAL MACHINE — ${gf} scored`]);
  if (!advanced) achievements.push(["GROUP_EXIT", "GROUP STAGE EXIT"]);

  return {
    seed, rating,
    userGroup: { standings: userGroup ? userGroup.standings : [], userPos, advanced },
    bracket, champion: champion.label, championsLifted, eliminated, userFinish,
    groupMatches: userMatches.filter(m => m.stage === "Group"),
    koMatches:    userMatches.filter(m => m.stage !== "Group"),
    record: { wins, draws, losses, gf, ga, cleanSheets },
    awards: { goldenBoot, playerOfTournament, cleanSheets },
    achievements,
  };
}

window.WC_ENGINE = {
  FORMATIONS, REROLL_COUNTS, squadRating, effectiveRating, fitMultiplier,
  simulateWorldCup, makeRng, DERIVED_STRENGTH,
};
