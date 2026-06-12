/* ============================================================
   Workout Tracker — App Logic
   ============================================================ */

// ── Storage ───────────────────────────────────────────────────
const K_SETTINGS = 'wt_settings';
const K_PROGRAM  = 'wt_program_v2';
const K_LOGS     = 'wt_logs';
const K_CUSTOM   = 'wt_custom_exercises';

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let settings = lsGet(K_SETTINGS, { restTimer: true, autoProgress: true });
let program  = lsGet(K_PROGRAM, null) || structuredClone(DEFAULT_PROGRAM);
if (!program.weeks) program = structuredClone(DEFAULT_PROGRAM); // pre-A/B format
let logs     = lsGet(K_LOGS, {});
let customs  = lsGet(K_CUSTOM, []);

// ── Week A/B rotation ─────────────────────────────────────────
function weekIndexFor(date) {
  const anchor = mondayOf(new Date(EPOCH_MONDAY + 'T12:00'));
  const wk = Math.round((mondayOf(date) - anchor) / (7 * 864e5));
  const n = program.weeks.length;
  return ((wk % n) + n) % n;
}
function dayFor(date) { return program.weeks[weekIndexFor(date)][date.getDay()]; }
function weekLabel(date) { return 'WEEK ' + String.fromCharCode(65 + weekIndexFor(date)); }

function saveProgram() { lsSet(K_PROGRAM, program); }
function saveLogs()    { lsSet(K_LOGS, logs); }
function saveCustoms() { lsSet(K_CUSTOM, customs); }

// ── Exercise lookup ───────────────────────────────────────────
function allExercises() { return BUILTIN_EXERCISES.concat(customs); }
function exById(id) { return allExercises().find(e => e.id === id); }

// ── Dates ─────────────────────────────────────────────────────
let selectedDate = new Date();
let weekOffset = 0; // for week view

function iso(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function mondayOf(d) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOWS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DOW_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function fmtShort(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate(); }

// ── Day log helpers ───────────────────────────────────────────
function dayLog(dateStr, create) {
  if (!logs[dateStr] && create) logs[dateStr] = { sets: {}, warmup: {}, skipped: [], swaps: {} };
  return logs[dateStr] || { sets: {}, warmup: {}, skipped: [], swaps: {} };
}
function setKey(blockId, itemIdx) { return blockId + '|' + itemIdx; }

// A day is done when she taps "Finish workout" (log.completed) or
// every working set is checked off.
function isDayDone(dateStr) {
  if (dayLog(dateStr).completed) return true;
  const c = dayCompletion(dateStr);
  return c.total > 0 && c.done >= c.total;
}

// ── Units (lbs / kg) — weights are stored in lbs internally ──
const LB_PER_KG = 2.20462;
function isKg() { return settings.units === 'kg'; }
function unitLabel() { return isKg() ? 'kg' : 'lbs'; }
function toDisplayW(lbs) { return Math.round((isKg() ? lbs / LB_PER_KG : lbs) * 2) / 2; }
function fromDisplayW(v) { return isKg() ? v * LB_PER_KG : v; }
function fmtWt(lbs) { return toDisplayW(lbs) + ' ' + unitLabel(); }

// Resolve the exercise for an item on a date (today-only swaps live in the log)
function resolveEx(dateStr, block, itemIdx) {
  const log = dayLog(dateStr);
  const swapped = log.swaps && log.swaps[setKey(block.id, itemIdx)];
  return exById(swapped || block.items[itemIdx].ex);
}

// ── History & suggestions ─────────────────────────────────────
// Each logged set is stamped with its exercise id (log.ex), so history
// survives program redesigns, moves, and swaps. blockMap is the fallback
// for sets logged before stamping existed.
function blockMap() {
  const map = {};
  for (const week of program.weeks)
    for (const day of Object.values(week))
      for (const block of (day.blocks || []))
        if (block.items) map[block.id] = block;
  return map;
}

function exerciseHistory(exId) {
  const out = [];
  const blocks = blockMap();
  for (const [date, log] of Object.entries(logs)) {
    if (!log.sets) continue;
    for (const [key, sets] of Object.entries(log.sets)) {
      let id, targetReps;
      const stamp = log.ex && log.ex[key];
      if (stamp) {
        id = stamp.id; targetReps = stamp.reps;
      } else {
        const [blockId, idxStr] = key.split('|');
        const block = blocks[blockId];
        const item = block && block.items[Number(idxStr)];
        if (!item) continue;
        id = (log.swaps && log.swaps[key]) || item.ex;
        targetReps = item.reps;
      }
      if (id !== exId) continue;
      if (sets.some(s => s && s.done)) out.push({ date, sets, targetReps });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

function stampLog(log, key, exId, targetReps) {
  if (!log.ex) log.ex = {};
  log.ex[key] = { id: exId, reps: targetReps };
}

// One-time migration: stamp pre-v2 logs with exercise ids so history
// survives the program overhaul. Resolution order: user's stored v1
// program → legacy default map → current program blocks.
(function migrateLogs() {
  const oldProg = lsGet('wt_program_v1', null);
  const blocks = blockMap();
  let changed = false;
  for (const log of Object.values(logs)) {
    if (!log.sets) continue;
    if (!log.ex) log.ex = {};
    for (const key of Object.keys(log.sets)) {
      if (log.ex[key]) continue;
      const [blockId, idxStr] = key.split('|');
      const i = Number(idxStr);
      let item = null;
      if (oldProg) {
        for (const day of Object.values(oldProg)) {
          const b = (day.blocks || []).find(b => b.id === blockId);
          if (b && b.items && b.items[i]) { item = b.items[i]; break; }
        }
      }
      if (!item && LEGACY_BLOCKS[blockId] && LEGACY_BLOCKS[blockId][i]) item = LEGACY_BLOCKS[blockId][i];
      if (!item && blocks[blockId] && blocks[blockId].items[i]) item = blocks[blockId].items[i];
      if (item) {
        log.ex[key] = { id: (log.swaps && log.swaps[key]) || item.ex, reps: item.reps };
        changed = true;
      }
    }
  }
  if (changed) saveLogs();
})();

function suggestionFor(dateStr, block, itemIdx) {
  const item = block.items[itemIdx];
  const ex = resolveEx(dateStr, block, itemIdx);
  if (!ex) return { weight: item.weight, reps: item.reps, note: '' };
  if (!settings.autoProgress) return { weight: item.weight, reps: item.reps, note: '' };
  const hist = exerciseHistory(ex.id).filter(h => h.date < dateStr);
  return suggestNext(ex, hist, item);
}

// ── Tabs ──────────────────────────────────────────────────────
function showTab(tab) {
  for (const t of ['week', 'schedule', 'progress', 'settings']) {
    document.getElementById('view-' + t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
  }
  if (tab === 'schedule') renderSchedule();
  if (tab === 'week') renderWeek();
  if (tab === 'progress') renderProgress();
  if (tab === 'settings') renderSettings();
}

// ── Schedule view ─────────────────────────────────────────────
function shiftDay(n) { selectedDate = addDays(selectedDate, n); renderSchedule(); }

function selectDate(dateStr) {
  selectedDate = new Date(dateStr + 'T12:00');
  renderSchedule();
}

function dayCompletion(dateStr) {
  // returns {total, done} counting working sets in non-skipped blocks
  const day = dayFor(new Date(dateStr + 'T12:00'));
  if (!day || day.rest || !day.blocks.length) return { total: 0, done: 0 };
  const log = dayLog(dateStr);
  let total = 0, done = 0;
  for (const block of day.blocks) {
    if (block.type === 'warmup' || (log.skipped || []).includes(block.id)) continue;
    block.items.forEach((item, i) => {
      total += item.sets;
      const sets = (log.sets || {})[setKey(block.id, i)] || [];
      done += sets.filter(s => s && s.done).length;
    });
  }
  return { total, done };
}

function renderSchedule() {
  const dateStr = iso(selectedDate);
  const today = iso(new Date());
  const monday = mondayOf(selectedDate);
  const sunday = addDays(monday, 6);
  const day = dayFor(selectedDate);
  const log = dayLog(dateStr);

  document.getElementById('dayTitle').textContent =
    DOW_FULL[selectedDate.getDay()] + ', ' + fmtShort(selectedDate);
  document.getElementById('weekRange').textContent = fmtShort(monday) + ' – ' + fmtShort(sunday);

  // date strip
  let strip = '';
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const ds = iso(d);
    const pd = dayFor(d);
    const isTrain = pd && !pd.rest && pd.blocks.length;
    const c = dayCompletion(ds);
    const dotClass = !isTrain ? 'none' : (isDayDone(ds) ? 'done' : '');
    strip += `<div class="date-cell ${ds === dateStr ? 'selected' : ''} ${ds === today ? 'today' : ''}" onclick="selectDate('${ds}')">
      <span class="dow">${DOWS[d.getDay()]}</span><span class="dnum">${d.getDate()}</span><span class="dot ${dotClass}"></span></div>`;
  }
  document.getElementById('dateStrip').innerHTML = strip;

  // day header
  const c = dayCompletion(dateStr);
  const isDone = isDayDone(dateStr);
  let head = `<h2>${day.name}</h2><span class="focus">${day.focus}</span>`;
  head += `<span class="pill">${weekLabel(selectedDate)}</span>`;
  if (day.minutes) head += `<span class="pill time">~${day.minutes}m</span>`;
  if (isDone) head += `<span class="pill done">DONE</span>`;
  head += `<button class="link-btn" onclick="openMove()">move</button>`;
  document.getElementById('dayHeader').innerHTML = head;
  document.getElementById('dayProgressFill').style.width = c.total ? (100 * c.done / c.total) + '%' : '0';
  document.getElementById('addBlockBtn').classList.toggle('hidden', !!day.rest);

  const fin = document.getElementById('finishBtn');
  fin.classList.toggle('hidden', !!day.rest);
  fin.textContent = isDone ? '✓ Workout complete — tap to undo' : '✓ Finish workout';
  fin.className = 'wide ' + (isDone ? 'btn-outline' : 'btn-accent');
  if (day.rest) fin.classList.add('hidden');

  // blocks
  document.getElementById('blocks').innerHTML = day.rest
    ? `<div class="card"><p class="subtle" style="padding:6px 2px">😌 Rest day. ${day.focus}</p></div>`
    : day.blocks.map(b => renderBlock(dateStr, b, log)).join('');
}

function renderBlock(dateStr, block, log) {
  const skipped = (log.skipped || []).includes(block.id);

  if (block.type === 'warmup') {
    const done = (log.warmup || {})[block.id] || [];
    const steps = block.steps.map((s, i) => `
      <div class="wu-step ${done.includes(i) ? 'done' : ''}" onclick="toggleWarmup('${dateStr}','${block.id}',${i})">
        <span class="n">${done.includes(i) ? '✓' : i + 1}</span>
        <span class="t">${s.text}</span>
        <span class="amt">${s.amount}</span>
      </div>`).join('');
    return `<div class="block">
      <div class="block-head">
        <span class="block-chip warmup">WARM-UP</span>
        <h3>${block.name}</h3>
        <span class="block-meta">${block.steps.length} steps</span>
      </div>
      <div style="margin-top:8px">${steps}</div>
    </div>`;
  }

  const chip = block.type === 'circuit' ? 'CIRCUIT' : 'SUPERSET';
  const meta = `${block.rounds} rounds, ${block.rest}s rest`;
  const items = skipped ? '' : block.items.map((item, i) => renderExercise(dateStr, block, i, log)).join('');

  return `<div class="block ${skipped ? 'skipped' : ''}">
    <div class="block-head">
      <span class="block-chip ${block.type}">${chip}</span>
      <h3>${block.name}</h3>
      <button class="link-btn" onclick="toggleSkip('${dateStr}','${block.id}')">${skipped ? 'unskip' : 'skip'}</button>
    </div>
    <div class="block-note">${block.note || meta}</div>
    ${items}
    ${skipped ? '' : `<button class="add-ex-btn" onclick="openAddExercise('${block.id}')">＋ Add exercise</button>`}
  </div>`;
}

function renderExercise(dateStr, block, itemIdx, log) {
  const item = block.items[itemIdx];
  const ex = resolveEx(dateStr, block, itemIdx);
  if (!ex) return '';
  const key = setKey(block.id, itemIdx);
  const logged = (log.sets || {})[key] || [];
  const sug = suggestionFor(dateStr, block, itemIdx);
  const doneCount = logged.filter(s => s && s.done).length;

  const isBW = ex.load === 'bw';
  const isTime = ex.load === 'time';
  const repUnit = ex.repUnit || (isTime ? 'sec' : 'rep');
  const wDisplay = isBW || isTime ? 'BW' : toDisplayW(sug.weight || 0) + unitLabel();
  const rx = `${item.sets}×${item.reps} @ ${wDisplay}` + (item.rpe ? ` <span class="rpe">RPE ${item.rpe}</span>` : '');

  let rows = '';
  for (let s = 0; s < item.sets; s++) {
    const sl = logged[s] || {};
    const done = !!sl.done;
    const pf = prefillFor(logged, s, sug);
    const wVal = pf.weight;
    const rVal = pf.reps;
    const weightField = (isBW || isTime)
      ? `<div class="set-field"><input value="BW" disabled /><span class="unit">&nbsp;</span></div>`
      : `<div class="set-field"><input type="number" inputmode="decimal" value="${toDisplayW(wVal)}" step="${isKg() ? 1.25 : 2.5}" min="0"
            onchange="logField('${dateStr}','${key}',${s},'weight',this.value)" /><span class="unit">${unitLabel()}</span></div>`;
    rows += `<div class="set-row">
      <button class="set-check ${done ? 'done' : ''}" onclick="toggleSet('${dateStr}','${block.id}',${itemIdx},${s})"></button>
      <span class="set-label">Set ${s + 1} — ${item.reps} ${repUnit === 'rep' ? 'reps' : repUnit}${item.rpe ? ` <span class="rpe">RPE ${item.rpe}</span>` : ''}</span>
      ${weightField}
      <div class="set-field"><input type="number" inputmode="numeric" value="${rVal}" min="0"
          onchange="logField('${dateStr}','${key}',${s},'reps',this.value)" /><span class="unit">${repUnit}</span></div>
    </div>`;
  }

  return `<div class="exercise">
    <div class="ex-head">
      <h4>${ex.name}</h4>
      <span class="ex-count">${doneCount}/${item.sets}</span>
      <span class="spacer"></span>
      <button class="link-btn" onclick="openSwap('${dateStr}','${block.id}',${itemIdx})">swap</button>
    </div>
    <div class="ex-rx">${rx}</div>
    ${sug.note ? `<div class="ex-note">↑ ${sug.note}</div>` : ''}
    ${rows}
  </div>`;
}

// ── Logging actions ───────────────────────────────────────────
function ensureSets(log, key, n) {
  if (!log.sets[key]) log.sets[key] = [];
  while (log.sets[key].length < n) log.sets[key].push({});
  return log.sets[key];
}

// What a set's inputs should show: an explicit logged value wins; otherwise
// the most recent weight/reps the user typed into an earlier set today;
// otherwise the progression suggestion.
function prefillFor(logged, setIdx, sug) {
  let w = sug.weight, r = sug.reps;
  for (let i = 0; i < setIdx; i++) {
    const sl = logged[i] || {};
    if (sl.weight !== undefined) w = sl.weight;
    if (sl.reps !== undefined) r = sl.reps;
  }
  const own = logged[setIdx] || {};
  return {
    weight: own.weight !== undefined ? own.weight : w,
    reps:   own.reps   !== undefined ? own.reps   : r,
  };
}

function toggleSet(dateStr, blockId, itemIdx, setIdx) {
  const day = dayFor(new Date(dateStr + 'T12:00'));
  const block = day.blocks.find(b => b.id === blockId);
  const item = block.items[itemIdx];
  const key = setKey(blockId, itemIdx);
  const log = dayLog(dateStr, true);
  const sets = ensureSets(log, key, item.sets);
  const s = sets[setIdx];

  if (s.done) {
    s.done = false;
  } else {
    const sug = suggestionFor(dateStr, block, itemIdx);
    const pf = prefillFor(sets, setIdx, sug);
    if (s.weight === undefined) s.weight = pf.weight;
    if (s.reps === undefined) s.reps = pf.reps;
    s.done = true;
    const ex = resolveEx(dateStr, block, itemIdx);
    if (ex) stampLog(log, key, ex.id, item.reps);
    // rest is between rounds — only start the timer once every exercise
    // in the block has this round's set checked off
    const roundDone = block.items.every((it, i) => {
      if (setIdx >= it.sets) return true;
      const ss = log.sets[setKey(blockId, i)] || [];
      return ss[setIdx] && ss[setIdx].done;
    });
    if (settings.restTimer && block.rest > 0 && roundDone) startRest(block.rest);
  }
  saveLogs();
  renderSchedule();
}

function logField(dateStr, key, setIdx, field, value) {
  const log = dayLog(dateStr, true);
  const sets = ensureSets(log, key, setIdx + 1);
  let v = Number(value) || 0;
  if (field === 'weight') v = fromDisplayW(v); // inputs are in display units
  sets[setIdx][field] = v;
  const block = blockMap()[key.split('|')[0]];
  if (block) {
    const itemIdx = Number(key.split('|')[1]);
    const ex = resolveEx(dateStr, block, itemIdx);
    if (ex && block.items[itemIdx]) stampLog(log, key, ex.id, block.items[itemIdx].reps);
  }
  saveLogs();
  renderSchedule(); // typed values cascade to the later sets immediately
}

function toggleWarmup(dateStr, blockId, stepIdx) {
  const log = dayLog(dateStr, true);
  if (!log.warmup) log.warmup = {};
  const arr = log.warmup[blockId] || (log.warmup[blockId] = []);
  const at = arr.indexOf(stepIdx);
  if (at >= 0) arr.splice(at, 1); else arr.push(stepIdx);
  saveLogs();
  renderSchedule();
}

function toggleSkip(dateStr, blockId) {
  const log = dayLog(dateStr, true);
  if (!log.skipped) log.skipped = [];
  const at = log.skipped.indexOf(blockId);
  if (at >= 0) log.skipped.splice(at, 1); else log.skipped.push(blockId);
  saveLogs();
  renderSchedule();
}

// ── Finish workout ────────────────────────────────────────────
function finishWorkout() {
  const dateStr = iso(selectedDate);
  const log = dayLog(dateStr, true);

  if (isDayDone(dateStr)) {
    log.completed = false; // undo
    saveLogs();
    renderSchedule();
    return;
  }

  const c = dayCompletion(dateStr);
  const remaining = c.total - c.done;
  if (remaining > 0) {
    const doAll = confirm(
      `You have ${remaining} unchecked set${remaining === 1 ? '' : 's'}.\n\n` +
      'OK — I did them: check them all off at the weights shown (counts toward your progress).\n' +
      'Cancel — skip them: mark the workout done without them (they won’t inflate your weight suggestions).');
    if (doAll) completeRemaining(dateStr, log);
  }
  log.completed = true;
  saveLogs();
  stopRest();
  renderSchedule();
}

function completeRemaining(dateStr, log) {
  const day = dayFor(new Date(dateStr + 'T12:00'));
  for (const block of day.blocks) {
    if (block.type === 'warmup' || (log.skipped || []).includes(block.id)) continue;
    block.items.forEach((item, i) => {
      const key = setKey(block.id, i);
      const sets = ensureSets(log, key, item.sets);
      const sug = suggestionFor(dateStr, block, i);
      for (let s = 0; s < item.sets; s++) {
        if (sets[s].done) continue;
        const pf = prefillFor(sets, s, sug);
        if (sets[s].weight === undefined) sets[s].weight = pf.weight;
        if (sets[s].reps === undefined) sets[s].reps = pf.reps;
        sets[s].done = true;
      }
      const ex = resolveEx(dateStr, block, i);
      if (ex) stampLog(log, key, ex.id, item.reps);
    });
  }
}

// ── Rest timer ────────────────────────────────────────────────
let restInterval = null;
function startRest(seconds) {
  stopRest();
  let left = seconds;
  const banner = document.getElementById('restBanner');
  const label = document.getElementById('restTime');
  const tick = () => {
    label.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
    if (left <= 0) { stopRest(); if (navigator.vibrate) navigator.vibrate(200); }
    left--;
  };
  banner.classList.remove('hidden');
  tick();
  restInterval = setInterval(tick, 1000);
}
function stopRest() {
  clearInterval(restInterval);
  restInterval = null;
  document.getElementById('restBanner').classList.add('hidden');
}

// ── Swap ──────────────────────────────────────────────────────
let swapCtx = null;
function openSwap(dateStr, blockId, itemIdx) {
  const day = dayFor(new Date(dateStr + 'T12:00'));
  const block = day.blocks.find(b => b.id === blockId);
  const current = resolveEx(dateStr, block, itemIdx);
  swapCtx = { dateStr, blockId, itemIdx, current };

  document.getElementById('swapTitle').textContent = 'Swap ' + current.name;
  document.getElementById('swapSearch').value = '';
  document.getElementById('swapNewName').value = '';
  document.getElementById('swapCreate').open = false;
  renderSwapList();
  document.getElementById('swapSheet').classList.remove('hidden');
}

function confirmCreateAndSwap() {
  const name = document.getElementById('swapNewName').value.trim();
  if (!name) { alert('Give the exercise a name first.'); return; }
  const exId = 'custom-' + Date.now();
  customs.push({
    id: exId,
    name,
    pattern: 'custom',
    muscles: [document.getElementById('swapNewMuscle').value],
    equip: 'custom',
    load: document.getElementById('swapNewLoad').value,
    inc: 5,
  });
  saveCustoms();
  confirmSwap(exId);
}

// Relevance to the current exercise's focus: same movement pattern and
// same primary muscle rank highest, then pattern, then shared muscles.
function swapScore(cur, e) {
  let score = 0;
  if (e.pattern === cur.pattern) score += 50;
  if (e.muscles[0] === cur.muscles[0]) score += 40;
  else if (e.muscles.some(m => cur.muscles.includes(m))) score += 20;
  return score;
}

function renderSwapList() {
  const cur = swapCtx.current;
  const q = document.getElementById('swapSearch').value.trim().toLowerCase();
  const all = allExercises().filter(e => e.id !== cur.id);
  const row = e => `<div class="swap-item" onclick="confirmSwap('${e.id}')">
      <strong>${e.name}</strong>
      <span class="tag">${e.muscles[0]}</span>
      <span class="tag">${e.equip}</span>
    </div>`;

  let html = '';
  if (q) {
    const hits = all
      .filter(e => e.name.toLowerCase().includes(q) ||
                   e.muscles.some(m => m.includes(q)) ||
                   e.pattern.includes(q) || e.equip.includes(q))
      .sort((a, b) => swapScore(cur, b) - swapScore(cur, a));
    html = hits.map(row).join('') || '<p class="subtle">No matches — try a muscle name like "glutes" or "lats".</p>';
  } else {
    const rec = all.filter(e => swapScore(cur, e) > 0)
      .sort((a, b) => swapScore(cur, b) - swapScore(cur, a))
      .slice(0, 8);
    html += '<div class="swap-section">Recommended for this slot</div>';
    html += rec.map(row).join('') || '<p class="subtle">No close matches — browse everything below.</p>';

    const groups = {};
    for (const e of all) (groups[e.muscles[0]] = groups[e.muscles[0]] || []).push(e);
    html += `<div class="swap-section">All exercises · ${all.length}</div>`;
    for (const m of Object.keys(groups).sort()) {
      html += `<details class="swap-group" open><summary>${m} <span class="subtle">${groups[m].length}</span></summary>
        ${groups[m].sort((a, b) => a.name.localeCompare(b.name)).map(row).join('')}</details>`;
    }
  }
  document.getElementById('swapList').innerHTML = html;
}

function confirmSwap(newExId) {
  const { dateStr, blockId, itemIdx } = swapCtx;
  const scope = document.querySelector('input[name="swapScope"]:checked').value;
  const day = dayFor(new Date(dateStr + 'T12:00'));
  const block = day.blocks.find(b => b.id === blockId);

  if (scope === 'always') {
    block.items[itemIdx].ex = newExId;
    const log = dayLog(dateStr, true);
    if (log.swaps) delete log.swaps[setKey(blockId, itemIdx)];
    saveProgram();
  } else {
    const log = dayLog(dateStr, true);
    if (!log.swaps) log.swaps = {};
    log.swaps[setKey(blockId, itemIdx)] = newExId;
  }
  saveLogs();
  closeSheets();
  renderSchedule();
}

// ── Add exercise ──────────────────────────────────────────────
let addCtx = null;
function openAddExercise(blockId) {
  addCtx = { blockId };
  const sel = document.getElementById('addPick');
  sel.innerHTML = allExercises()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('newExName').value = '';
  document.getElementById('addSheet').classList.remove('hidden');
}

function confirmAddExercise() {
  const day = dayFor(selectedDate);
  const block = day.blocks.find(b => b.id === addCtx.blockId);
  if (!block) return;

  let exId;
  const customName = document.getElementById('newExName').value.trim();
  if (customName) {
    exId = 'custom-' + Date.now();
    customs.push({
      id: exId,
      name: customName,
      pattern: 'custom',
      muscles: [document.getElementById('newExMuscle').value],
      equip: 'custom',
      load: document.getElementById('newExLoad').value,
      inc: 5,
    });
    saveCustoms();
  } else {
    exId = document.getElementById('addPick').value;
  }

  block.items.push({
    ex: exId,
    sets: Number(document.getElementById('addSets').value) || 3,
    reps: Number(document.getElementById('addReps').value) || 10,
    rpe: '',
    weight: fromDisplayW(Number(document.getElementById('addWeight').value) || 0),
  });
  saveProgram();
  closeSheets();
  renderSchedule();
}

// ── Add block ─────────────────────────────────────────────────
function openAddBlock() {
  document.getElementById('newBlockName').value = '';
  document.getElementById('blockSheet').classList.remove('hidden');
}

function confirmAddBlock() {
  const day = dayFor(selectedDate);
  const name = document.getElementById('newBlockName').value.trim() || 'New Block';
  day.blocks.push({
    id: 'blk-' + Date.now(),
    type: document.getElementById('newBlockType').value,
    name,
    rounds: Number(document.getElementById('newBlockRounds').value) || 3,
    rest: Number(document.getElementById('newBlockRest').value) || 60,
    items: [],
  });
  if (day.rest) { day.rest = false; day.name = name; day.minutes = 30; }
  saveProgram();
  closeSheets();
  renderSchedule();
}

function closeSheets() {
  for (const id of ['swapSheet', 'addSheet', 'blockSheet', 'moveSheet'])
    document.getElementById(id).classList.add('hidden');
}

// ── Move workout to another day ───────────────────────────────
// Operates on the week variant (A/B) that the given date falls in.
let moveCtx = null;
function openMove() { openMoveFor(iso(selectedDate)); }

function openMoveFor(dateStr) {
  const d = new Date(dateStr + 'T12:00');
  moveCtx = { wi: weekIndexFor(d), dow: d.getDay() };
  const week = program.weeks[moveCtx.wi];
  document.getElementById('moveTitle').textContent =
    'Move ' + week[moveCtx.dow].name + ' (' + weekLabel(d).toLowerCase().replace('w', 'W') + ')';
  const order = [1, 2, 3, 4, 5, 6, 0]; // Mon … Sun
  document.getElementById('moveList').innerHTML = order.map(dw => {
    const p = week[dw];
    const isCur = dw === moveCtx.dow;
    return `<div class="swap-item" ${isCur ? 'style="opacity:0.45"' : `onclick="confirmMove(${dw})"`}>
      <strong>${DOW_FULL[dw]}</strong>
      <span class="tag">${p.name}</span>
      ${isCur ? '<span class="tag">current</span>' : ''}
    </div>`;
  }).join('');
  document.getElementById('moveSheet').classList.remove('hidden');
}

function confirmMove(targetDow) {
  const { wi, dow } = moveCtx;
  const week = program.weeks[wi];
  // the two days trade places, so nothing is ever lost
  [week[dow], week[targetDow]] = [week[targetDow], week[dow]];
  saveProgram();
  closeSheets();
  renderSchedule();
  renderWeek();
}

// ── Week view ─────────────────────────────────────────────────
function shiftWeek(n) { weekOffset += n; renderWeek(); }

function renderWeek() {
  const monday = addDays(mondayOf(new Date()), weekOffset * 7);
  const today = iso(new Date());
  document.getElementById('weekRange2').textContent =
    fmtShort(monday) + ' – ' + fmtShort(addDays(monday, 6)) + ' · ' + weekLabel(monday);

  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const ds = iso(d);
    const day = dayFor(d);
    const isTrain = day && !day.rest && day.blocks.length;
    const c = dayCompletion(ds);
    const status = !isTrain ? '' :
      isDayDone(ds) ? '<span class="pill done">DONE</span>' :
      c.done > 0 ? `<span class="pill">${c.done}/${c.total} sets</span>` : '';
    html += `<div class="week-card ${isTrain ? 'train' : ''} ${ds === today ? 'today' : ''}" onclick="selectDate('${ds}');showTab('schedule')">
      <div class="wc-date"><span class="dow">${DOWS[d.getDay()]}</span><span class="dnum">${d.getDate()}</span></div>
      <div class="wc-body"><strong>${day.name}</strong><span class="subtle">${day.focus}</span></div>
      ${status}
      <button class="link-btn" onclick="event.stopPropagation();openMoveFor('${ds}')">move</button>
    </div>`;
  }
  document.getElementById('weekCards').innerHTML = html;
}

// ── Progress view ─────────────────────────────────────────────
function trainingDates() {
  return Object.keys(logs).filter(ds => {
    const c = dayCompletion(ds);
    return c.done > 0;
  }).sort();
}

function computeStreak() {
  let streak = 0;
  let d = new Date();
  for (let guard = 0; guard < 365; guard++) {
    const ds = iso(d);
    const day = dayFor(d);
    const isTrain = day && !day.rest && day.blocks.length;
    if (isTrain) {
      const c = dayCompletion(ds);
      const completed = isDayDone(ds);
      if (completed) streak++;
      else if (ds !== iso(new Date())) break; // today in progress doesn't break it
    }
    d = addDays(d, -1);
  }
  return streak;
}

function weekVolume(monday) {
  let vol = 0;
  for (let i = 0; i < 7; i++) {
    const ds = iso(addDays(monday, i));
    const log = logs[ds];
    if (!log || !log.sets) continue;
    for (const sets of Object.values(log.sets))
      for (const s of sets)
        if (s && s.done) vol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
  }
  return vol;
}

function renderProgress() {
  // stats
  const thisMonday = mondayOf(new Date());
  let doneThisWeek = 0, scheduled = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(thisMonday, i);
    const day = dayFor(d);
    if (day && !day.rest && day.blocks.length) {
      scheduled++;
      const c = dayCompletion(iso(d));
      if (isDayDone(iso(d))) doneThisWeek++;
    }
  }
  document.getElementById('statRow').innerHTML = `
    <div class="stat"><strong>${computeStreak()}</strong><span>WORKOUT STREAK</span></div>
    <div class="stat"><strong>${doneThisWeek}/${scheduled}</strong><span>THIS WEEK</span></div>
    <div class="stat"><strong>${Math.round(toDisplayW(weekVolume(thisMonday)) / 1000)}k</strong><span>${unitLabel().toUpperCase()} THIS WEEK</span></div>`;

  // exercise selector — weighted exercises with history
  const sel = document.getElementById('chartExercise');
  const tracked = allExercises().filter(e => e.load === 'weight' && exerciseHistory(e.id).length);
  const keep = sel.value;
  sel.innerHTML = tracked.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  if (tracked.some(e => e.id === keep)) sel.value = keep;

  // strength chart
  const canvas = document.getElementById('chart');
  const empty = document.getElementById('chartEmpty');
  if (!tracked.length) {
    canvas.classList.add('hidden'); empty.classList.remove('hidden');
  } else {
    canvas.classList.remove('hidden'); empty.classList.add('hidden');
    const hist = exerciseHistory(sel.value);
    const points = hist.map(h => ({
      x: h.date,
      y: toDisplayW(Math.max(...h.sets.filter(s => s.done).map(s => Number(s.weight) || 0), 0)),
    }));
    drawLineChart(canvas, points, ' ' + unitLabel());
  }

  // weekly volume bars (last 8 weeks)
  document.getElementById('volUnitLabel').textContent = `(${unitLabel()} lifted)`;
  const bars = [];
  for (let w = 7; w >= 0; w--) {
    const m = addDays(thisMonday, -7 * w);
    bars.push({ label: fmtShort(m), value: weekVolume(m) });
  }
  drawBarChart(document.getElementById('volChart'), bars);

  // handstand chart — best timed hold per date
  const hsIds = ['wall-hold-back', 'wall-hold-chest', 'crow-pose'];
  const byDate = {};
  for (const id of hsIds)
    for (const h of exerciseHistory(id)) {
      const best = Math.max(...h.sets.filter(s => s.done).map(s => Number(s.reps) || 0), 0);
      byDate[h.date] = Math.max(byDate[h.date] || 0, best);
    }
  const hsPoints = Object.entries(byDate).sort().map(([x, y]) => ({ x, y }));
  const hsCanvas = document.getElementById('hsChart');
  const hsEmpty = document.getElementById('hsEmpty');
  hsCanvas.classList.toggle('hidden', !hsPoints.length);
  hsEmpty.classList.toggle('hidden', !!hsPoints.length);
  if (hsPoints.length) drawLineChart(hsCanvas, hsPoints, 's');
}

// ── Tiny charts ───────────────────────────────────────────────
function chartCtx(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
}

function drawLineChart(canvas, points, unit) {
  const ctx = chartCtx(canvas);
  const W = canvas.width, H = canvas.height, P = 38;
  if (!points.length) return;
  const ys = points.map(p => p.y);
  const maxY = Math.max(...ys) * 1.15 || 10;
  const minY = Math.min(...ys, 0) * 0.85;
  const x = i => points.length === 1 ? W / 2 : P + (W - 2 * P) * (i / (points.length - 1));
  const y = v => H - P - (H - 2 * P) * ((v - minY) / (maxY - minY || 1));

  ctx.strokeStyle = '#26262e'; ctx.lineWidth = 1;
  for (let g = 0; g <= 3; g++) {
    const gy = P + (H - 2 * P) * (g / 3);
    ctx.beginPath(); ctx.moveTo(P, gy); ctx.lineTo(W - P, gy); ctx.stroke();
    ctx.fillStyle = '#8b8b95'; ctx.font = '11px -apple-system, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxY - (maxY - minY) * (g / 3)) + unit, P - 6, gy + 4);
  }

  ctx.strokeStyle = '#d633ff'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(x(i), y(p.y)) : ctx.moveTo(x(i), y(p.y)));
  ctx.stroke();

  points.forEach((p, i) => {
    ctx.fillStyle = '#d633ff';
    ctx.beginPath(); ctx.arc(x(i), y(p.y), 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0a0a0e';
    ctx.beginPath(); ctx.arc(x(i), y(p.y), 1.8, 0, Math.PI * 2); ctx.fill();
  });

  ctx.fillStyle = '#8b8b95'; ctx.textAlign = 'center';
  const step = Math.ceil(points.length / 5);
  points.forEach((p, i) => {
    if (i % step) return;
    const d = new Date(p.x + 'T12:00');
    ctx.fillText(MONTHS[d.getMonth()] + ' ' + d.getDate(), x(i), H - P + 18);
  });
}

function drawBarChart(canvas, bars) {
  const ctx = chartCtx(canvas);
  const W = canvas.width, H = canvas.height, P = 30;
  const maxV = Math.max(...bars.map(b => b.value), 1);
  const bw = (W - 2 * P) / bars.length;
  bars.forEach((b, i) => {
    const h = (H - 2 * P) * (b.value / maxV);
    const bx = P + i * bw + bw * 0.18;
    ctx.fillStyle = b.value ? '#d633ff' : '#26262e';
    roundRect(ctx, bx, H - P - Math.max(h, 3), bw * 0.64, Math.max(h, 3), 5);
    ctx.fillStyle = '#8b8b95'; ctx.font = '10px -apple-system, sans-serif'; ctx.textAlign = 'center';
    if (i % 2 === 0) ctx.fillText(b.label, bx + bw * 0.32, H - P + 16);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.fill();
}

// ── Settings ──────────────────────────────────────────────────
function renderSettings() {
  document.getElementById('setRestTimer').checked = !!settings.restTimer;
  document.getElementById('setAutoProgress').checked = !!settings.autoProgress;
  document.getElementById('setUnits').value = settings.units || 'lbs';
}

function saveSettings() {
  settings.restTimer = document.getElementById('setRestTimer').checked;
  settings.autoProgress = document.getElementById('setAutoProgress').checked;
  settings.units = document.getElementById('setUnits').value;
  lsSet(K_SETTINGS, settings);
}

function exportData() {
  const blob = new Blob([JSON.stringify({ settings, program, logs, customs }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'workout-backup-' + iso(new Date()) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.settings) { settings = data.settings; lsSet(K_SETTINGS, settings); }
      if (data.program && data.program.weeks) { program = data.program; saveProgram(); }
      if (data.logs)     { logs = data.logs; saveLogs(); }
      if (data.customs)  { customs = data.customs; saveCustoms(); }
      alert('Backup imported ✓');
      renderSchedule(); renderSettings();
    } catch {
      alert('That file could not be read as a backup.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetProgram() {
  if (!confirm('Reset your program to the default Week A / Week B plan? Your logged history stays.')) return;
  program = structuredClone(DEFAULT_PROGRAM);
  saveProgram();
  renderSchedule();
  alert('Program reset ✓');
}

// ── Boot ──────────────────────────────────────────────────────
renderSchedule();
