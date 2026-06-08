/* =============================================================================
 * app.js — UI flow & state (vanilla JS, no framework)
 * ========================================================================== */
(() => {
  const { TEAMS, PLAYERS_BY_TEAM } = window.WC_DATA;
  const E = window.WC_ENGINE;
  const $ = (s) => document.querySelector(s);

  /* ---------- state ---------- */
  const YEARS = [...new Set(TEAMS.map(t => t.year))].sort((a, b) => a - b);
  let setup = { formation: "4-3-3", difficulty: "easy", ratingMode: "career",
                yearFrom: YEARS[0], yearTo: YEARS[YEARS.length - 1] };
  let game = null;            // { formation, slots, difficulty, ratingMode, yearFrom, yearTo, picks, rerollsRemaining, currentSpin }
  let drafted = new Set();    // player ids already used
  let lastResult = null;

  /* ---------- helpers ---------- */
  const posGroup = (p) =>
    p === "GK" ? "GK"
    : ["LB","CB","RB","LWB","RWB"].includes(p) ? "DEF"
    : ["CDM","CM","CAM","LM","RM"].includes(p) ? "MID" : "ATT";

  const showScreen = (id) => {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    $("#" + id).classList.remove("hidden");
    window.scrollTo(0, 0);
  };
  let toastTimer;
  const toast = (msg) => {
    const t = $("#toast"); t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add("hidden"), 1800);
  };

  /* ---------- SETUP ---------- */
  const FORMATION_KEYS = Object.keys(E.FORMATIONS);
  const DIFFS = [
    { key:"easy", title:"Easy", desc:"10 rerolls total" },
    { key:"hard", title:"Hard", desc:"3 rerolls total" },
    { key:"pep",  title:"PEP",  desc:"No rerolls — overthink it" },
  ];
  const RATING_MODES = [
    { key:"career", title:"Career", desc:"Rating at that tournament" },
    { key:"prime",  title:"Prime",  desc:"Career-peak rating" },
  ];

  function pillRow(sel, items, current, onPick) {
    const row = $(sel); row.innerHTML = "";
    items.forEach(it => {
      const el = document.createElement("div");
      el.className = "opt" + (current === it.key ? " active" : "");
      el.innerHTML = `<div class="opt-title">${it.title}</div>` +
        (it.desc ? `<div class="opt-desc">${it.desc}</div>` : "");
      el.onclick = () => onPick(it.key);
      row.appendChild(el);
    });
  }

  function renderSetup() {
    pillRow("#formation-opts", FORMATION_KEYS.map(k => ({ key:k, title:k })), setup.formation,
      (k) => { setup.formation = k; renderSetup(); });
    pillRow("#difficulty-opts", DIFFS, setup.difficulty, (k) => { setup.difficulty = k; renderSetup(); });
    pillRow("#rating-opts", RATING_MODES, setup.ratingMode, (k) => { setup.ratingMode = k; renderSetup(); });

    const from = $("#year-from"), to = $("#year-to");
    const opts = (selected) => YEARS.map(y => `<option value="${y}"${y === selected ? " selected" : ""}>${y}</option>`).join("");
    from.innerHTML = opts(setup.yearFrom);
    to.innerHTML = opts(setup.yearTo);
    from.onchange = () => { setup.yearFrom = +from.value; if (setup.yearFrom > setup.yearTo) setup.yearTo = setup.yearFrom; renderSetup(); };
    to.onchange   = () => { setup.yearTo = +to.value;   if (setup.yearTo < setup.yearFrom) setup.yearFrom = setup.yearTo; renderSetup(); };
  }

  $("#btn-start").onclick = () => {
    game = {
      formation: setup.formation,
      slots: E.FORMATIONS[setup.formation],
      difficulty: setup.difficulty,
      ratingMode: setup.ratingMode,
      yearFrom: setup.yearFrom,
      yearTo: setup.yearTo,
      picks: [],
      rerollsRemaining: E.REROLL_COUNTS[setup.difficulty],
      currentSpin: null,
    };
    drafted = new Set();
    renderDraft();
    showScreen("screen-draft");
  };

  /* ---------- DRAFT ---------- */
  function emptySlots() {
    const used = new Set(game.picks.map(p => p.slot.id));
    return game.slots.filter(s => !used.has(s.id));
  }
  function pickInSlot(slotId) { return game.picks.find(p => p.slot.id === slotId); }
  // a player is draftable only if some EMPTY slot is a genuine positional fit for them
  function playerHasFit(player) {
    return emptySlots().some(s => E.fitMultiplier(s.position, player.positions) > 0.93);
  }

  function renderPitch(containerSel, withNames) {
    const c = $(containerSel); c.innerHTML = "";
    game.slots.forEach(slot => {
      const pick = pickInSlot(slot.id);
      const grp = posGroup(slot.position);
      const el = document.createElement("div");
      el.className = "slot" + (pick ? " filled" : "");
      el.style.left = slot.x + "%"; el.style.top = slot.y + "%";
      const disc = `<div class="disc ${grp==='GK'?'p-GK':''}">${pick ? initials(pick.player.name) : slot.position}</div>`;
      const tag = `<div class="pos-tag p-${grp}">${slot.position}</div>`;
      const extra = withNames && pick
        ? `<div class="pname">${lastName(pick.player.name)}</div><div class="prate">${Math.round(E.effectiveRating(pick))}</div>`
        : "";
      el.innerHTML = disc + tag + extra;
      c.appendChild(el);
    });
  }
  const initials = (n) => n.split(" ").map(w => w[0]).slice(0,2).join("");
  const lastName = (n) => n.split(" ").slice(-1)[0];

  function renderDraft() {
    $("#reroll-count").textContent = game.rerollsRemaining;
    $("#draft-progress").textContent = `${game.picks.length} / 11 picked`;
    renderPitch("#pitch", true);
    // spin panel
    if (game.currentSpin) renderSpinResult(); else {
      $("#spin-idle").classList.remove("hidden");
      $("#spin-result").classList.add("hidden");
    }
    $("#btn-to-summary").classList.toggle("hidden", game.picks.length < 11);
  }

  $("#btn-spin").onclick = doSpin;
  $("#btn-reroll").onclick = () => {
    if (game.rerollsRemaining <= 0) { toast("No rerolls left"); return; }
    game.rerollsRemaining--; doSpin();
  };
  $("#btn-respin-free").onclick = doSpin;   // free: current team can't fill any open slot
  let spinning = false;
  function spinPool() {
    return TEAMS.filter(t => t.year >= game.yearFrom && t.year <= game.yearTo);
  }
  function doSpin() {
    if (spinning) return;
    const pool = spinPool();
    const team = pool[Math.floor(Math.random() * pool.length)];
    // quick visual roll through random teams (within year range) before settling
    spinning = true;
    $("#spin-idle").classList.add("hidden");
    $("#spin-result").classList.remove("hidden");
    $("#player-list").innerHTML = "";
    $("#btn-respin-free").classList.add("hidden");
    const banner = $("#team-banner");
    let ticks = 0;
    const roll = () => {
      const t = pool[Math.floor(Math.random() * pool.length)];
      banner.style.opacity = ".5";
      banner.innerHTML = `${t.flag} ${t.country} <span style="color:var(--muted)">${t.year}</span>`;
      ticks++;
      if (ticks < 12) { setTimeout(roll, 40 + ticks * 8); }
      else { banner.style.opacity = "1"; game.currentSpin = { team, players: PLAYERS_BY_TEAM[team.id] }; spinning = false; renderDraft(); }
    };
    roll();
  }
  // rating that will actually be used for a player (career = at-tournament, prime = peak)
  function ratingFor(player, capOverall) {
    return game.ratingMode === "prime" ? player.prime : capOverall;
  }

  function renderSpinResult() {
    $("#spin-idle").classList.add("hidden");
    $("#spin-result").classList.remove("hidden");
    const { team, players } = game.currentSpin;
    const str = E.DERIVED_STRENGTH?.[team.id] ?? team.strength;
    $("#team-banner").innerHTML = `${team.flag} ${team.country} <span style="color:var(--muted)">${team.year}</span>
      <span class="team-str">${str}</span>`;
    const list = $("#player-list"); list.innerHTML = "";
    let anyPickable = false;
    players.forEach(({ player, overall }) => {
      const taken = drafted.has(player.id);
      const noFit = !taken && !playerHasFit(player);   // their position(s) already filled
      const blocked = taken || noFit;
      if (!blocked) anyPickable = true;
      const shown = ratingFor(player, overall);        // career vs prime
      const primeTag = game.ratingMode === "prime" && shown !== overall ? `<span class="pl-prime">prime</span>` : "";
      const row = document.createElement("div");
      row.className = "player-row" + (blocked ? " taken" : "");
      const note = taken ? `<span class="pl-note">drafted</span>`
                 : noFit ? `<span class="pl-note">position full</span>` : "";
      row.innerHTML =
        `<div><div class="pl-name">${player.name}</div>
         <div class="pl-pos">${player.positions.join(" · ")} ${note}</div></div>
         <div class="pl-rate">${shown}${primeTag}</div>`;
      if (!blocked) row.onclick = () => choosePlayer(player, shown);
      list.appendChild(row);
    });
    $("#reroll-count").textContent = game.rerollsRemaining;
    $("#btn-reroll").disabled = game.rerollsRemaining <= 0;
    // safety valve: if nobody on this team can fill a remaining slot, allow a free re-spin
    $("#btn-respin-free").classList.toggle("hidden", anyPickable);
  }

  // empty slots that are a genuine positional fit (not out-of-position)
  function fittingSlots(player) {
    return emptySlots().filter(s => E.fitMultiplier(s.position, player.positions) > 0.93);
  }
  function fitLabel(mult) {
    return mult >= 1 ? "natural fit" : mult >= 0.98 ? "good fit" : "out of position";
  }

  function choosePlayer(player, overall) {
    const fits = fittingSlots(player);
    // distinct positions the player genuinely fits, ordered best-fit first
    const positions = [...new Set(fits.map(s => s.position))]
      .sort((a, b) => E.fitMultiplier(b, player.positions) - E.fitMultiplier(a, player.positions));

    if (positions.length >= 2) {
      showPosChoice(player, overall, positions);   // let the user pick the role
    } else {
      // single fit (or none) → auto-place in the best available slot
      const empties = emptySlots();
      if (empties.length === 0) { toast("Squad full"); return; }
      let best = empties[0], bestMult = -1;
      for (const s of empties) {
        const m = E.fitMultiplier(s.position, player.positions);
        if (m > bestMult) { bestMult = m; best = s; }
      }
      commitPick(player, overall, best);
    }
  }

  function commitPick(player, overall, slot) {
    game.picks.push({ player, slot, overallUsed: overall, team: game.currentSpin.team });
    drafted.add(player.id);
    game.currentSpin = null;
    // rerolls are a single pool for the whole draft — do NOT reset between picks
    const mult = E.fitMultiplier(slot.position, player.positions);
    toast(`${lastName(player.name)} → ${slot.position} (${fitLabel(mult)})`);
    hidePosChoice();
    renderDraft();
  }

  function showPosChoice(player, overall, positions) {
    $("#pos-choice-title").textContent = `Where should ${player.name} play?`;
    const opts = $("#pos-choice-opts"); opts.innerHTML = "";
    positions.forEach(pos => {
      const mult = E.fitMultiplier(pos, player.positions);
      const slot = fittingSlots(player).find(s => s.position === pos);
      const el = document.createElement("button");
      el.className = "btn pos-choice-btn";
      el.innerHTML = `<span class="pc-pos">${pos}</span><span class="pc-fit">${fitLabel(mult)}</span>`;
      el.onclick = () => commitPick(player, overall, slot);
      opts.appendChild(el);
    });
    $("#pos-choice").classList.remove("hidden");
  }
  function hidePosChoice() { $("#pos-choice").classList.add("hidden"); }
  $("#pos-choice-cancel").onclick = hidePosChoice;   // keeps the spun team so you can pick someone else

  $("#btn-reset").onclick = () => {
    if (!confirm("Reset the whole draft?")) return;
    game.picks = []; drafted = new Set(); game.currentSpin = null;
    game.rerollsRemaining = E.REROLL_COUNTS[game.difficulty];
    renderDraft();
  };
  $("#btn-to-summary").onclick = () => { renderSummary(); showScreen("screen-summary"); };

  /* ---------- SUMMARY ---------- */
  function renderSummary() {
    renderPitch("#pitch-summary", true);
    const r = E.squadRating(game.picks);
    $("#overall-num").textContent = r.overall;
    const bars = [
      { label:"Attack",   v:r.attack,      c:"linear-gradient(90deg,#ef4444,#f97316)" },
      { label:"Midfield", v:r.midfield,    c:"linear-gradient(90deg,#10b981,#34d399)" },
      { label:"Defence",  v:r.defence,     c:"linear-gradient(90deg,#3b82f6,#60a5fa)" },
      { label:"GK",       v:r.goalkeeping, c:"linear-gradient(90deg,#f59e0b,#fbbf24)" },
    ];
    $("#rating-bars").innerHTML = bars.map(b => `
      <div class="bar"><div class="bar-top"><span>${b.label}</span><b>${b.v}</b></div>
      <div class="bar-track"><div class="bar-fill" style="width:${b.v}%;background:${b.c}"></div></div></div>`).join("");
    $("#expectation").textContent =
      r.overall >= 90 ? "Overwhelming favourites — anything less than the trophy is a failure."
      : r.overall >= 86 ? "A genuine contender. The latter stages are well within reach."
      : r.overall >= 82 ? "Dark horses. A good draw and you could go deep."
      : "Underdogs. Getting out of the group would be an achievement.";
  }
  $("#btn-back-draft").onclick = () => { renderDraft(); showScreen("screen-draft"); };

  /* ---------- SIMULATE ---------- */
  $("#btn-simulate").onclick = () => {
    lastResult = E.simulateWorldCup(game, TEAMS);
    renderResults(lastResult);
    showScreen("screen-results");
  };

  function renderResults(res) {
    const won = res.championsLifted;
    const banner = $("#result-banner");
    banner.className = "result-banner" + (won ? " win" : "");
    banner.innerHTML = `
      <div class="rb-emoji">${won ? "🏆" : res.eliminated ? "🚪" : "🎌"}</div>
      <div class="rb-title">${won ? "WORLD CHAMPIONS" : res.userFinish}</div>
      <div class="rb-sub">${res.record.wins}W · ${res.record.draws}D · ${res.record.losses}L ·
        ${res.record.gf} scored / ${res.record.ga} conceded</div>
      ${won ? "" : `<div class="rb-champ">Won by ${res.champion}</div>`}`;

    $("#achievements").innerHTML = res.achievements.map(([, label]) =>
      `<span class="ach">${label}</span>`).join("");

    // your XI (pitch + ratings)
    const rt = res.rating;
    $("#result-squad").innerHTML =
      `<div class="squad-head"><span>Your XI</span><span class="squad-ovr">${rt.overall}</span></div>
       <div class="squad-lines">ATT ${rt.attack} · MID ${rt.midfield} · DEF ${rt.defence} · GK ${rt.goalkeeping}</div>
       <div id="pitch-results" class="pitch result-pitch"></div>`;
    renderPitch("#pitch-results", true);

    const a = res.awards;
    $("#awards").innerHTML = `
      <div><div class="aw-label">⚽ Golden Boot</div>
        <div class="aw-name">${a.goldenBoot?.name ?? "—"}</div>
        <div class="aw-meta">${a.goldenBoot ? a.goldenBoot.count + " goals" : ""}</div></div>
      <div><div class="aw-label">🌟 Player of Tournament</div>
        <div class="aw-name">${a.playerOfTournament?.name ?? "—"}</div></div>
      <div><div class="aw-label">🧤 Clean Sheets</div>
        <div class="aw-name">${a.cleanSheets}</div></div>`;

    const rc = $("#rounds"); rc.innerHTML = "";

    // 1) user's group table + matches
    const g = res.userGroup;
    const rows = g.standings.map((s, i) => `
      <tr class="${s.team.isUser ? 'you' : ''}">
        <td>${i+1}</td><td class="team">${s.team.label}</td>
        <td>${s.P}</td><td>${s.W}</td><td>${s.D}</td><td>${s.L}</td>
        <td>${s.GF}-${s.GA}</td><td>${s.Pts}</td></tr>`).join("");
    const grp = document.createElement("div"); grp.className = "round";
    grp.innerHTML = `<h3>Group Stage — finished ${ordinal(g.userPos)} (${g.advanced ? "advanced" : "eliminated"})</h3>
      <table class="standings"><tr><th>#</th><th style="text-align:left">Team</th>
      <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>${rows}</table>
      ${res.groupMatches.map(matchRow).join("")}`;
    rc.appendChild(grp);

    // 2) user's knockout matches (detailed)
    res.koMatches.forEach(m => {
      const w = document.createElement("div"); w.className = "round";
      w.innerHTML = `<h3>${m.stage}</h3>${matchRow(m)}`;
      rc.appendChild(w);
    });

    // 3) full knockout bracket (all teams)
    const br = document.createElement("div"); br.className = "round";
    br.innerHTML = `<h3>Knockout Bracket</h3>` + res.bracket.map(rnd => `
      <div class="bracket-round"><div class="bracket-label">${rnd.round}</div>
        ${rnd.ties.map(t => {
          const winnerIsHome = t.winner === t.home;
          return `<div class="bracket-tie${t.isUser ? ' user' : ''}">
            <span class="${winnerIsHome ? 'bw' : ''}">${t.home.label}</span>
            <b>${t.score}</b>
            <span class="${!winnerIsHome ? 'bw' : ''}">${t.away.label}</span>
            ${t.decided ? `<i>${t.decided === 'pens' ? 'pens' : 'a.e.t.'}</i>` : ''}
          </div>`;
        }).join("")}
      </div>`).join("") +
      `<div class="champ-line">🏆 Champions: <b>${res.champion}</b></div>`;
    rc.appendChild(br);

    $("#share-text").value = shareText(res);
  }

  function matchRow(m) {
    const scorers = m.scorers.length
      ? `<div class="match-scorers">⚽ ${m.scorers.map(s => `${lastName(s.scorer)} ${s.minute}'`).join("  ")}</div>` : "";
    const tag = m.decided === "pens" ? `<div class="match-tag">decided on penalties</div>`
      : m.decided === "et" ? `<div class="match-tag">after extra time</div>` : "";
    return `<div class="match-row ${m.result}">
      <div class="match-top"><span class="opp">${m.opponent}</span>
        <span class="score ${m.result}">${m.goalsFor}–${m.goalsAgainst}</span></div>
      ${scorers}${tag}</div>`;
  }

  const ordinal = (n) => n + (["th","st","nd","rd"][(n%100-20)%10] || ["th","st","nd","rd"][n] || "th");

  function shareText(res) {
    const r = res.rating.overall;
    if (res.championsLifted)
      return `🏆 My ${r}-rated all-time XI just WON THE WORLD CUP — ${res.record.wins}W ${res.record.draws}D ${res.record.losses}L, ${res.record.gf} scored. Can you build better? #WorldXI`;
    return `My ${r}-rated all-time XI: ${res.userFinish} (${res.record.wins}-${res.record.draws}-${res.record.losses}), won by ${res.champion}. Think you can lift the trophy? #WorldXI`;
  }

  $("#btn-copy").onclick = async () => {
    try { await navigator.clipboard.writeText($("#share-text").value); toast("Copied!"); }
    catch { $("#share-text").select(); toast("Press Ctrl+C to copy"); }
  };
  $("#btn-newgame").onclick = () => { renderSetup(); showScreen("screen-setup"); };

  /* ---------- init ---------- */
  renderSetup();
})();
