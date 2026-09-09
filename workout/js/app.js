/* ============================================================
   Workout Tracker — App Logic
   ============================================================ */

// ── Storage ───────────────────────────────────────────────────
const K_SETTINGS = 'wt_settings';
const K_PROGRAM  = 'wt_program_v2';   // legacy — read once, then migrated
const K_LIBRARY  = 'wt_library_v3';   // { workouts: [...], weeks: [...] }
const K_PLAN     = 'wt_plan_v3';      // { assign: {mondayISO: weekId}, rotation: [weekId] }
const K_DAYS     = 'wt_days_v3';      // { dateISO: workout }  — this-day-only versions
const K_LOGS     = 'wt_logs';
const K_CUSTOM   = 'wt_custom_exercises';
const K_UNITS    = 'wt_units'; // per-exercise unit overrides

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let settings = lsGet(K_SETTINGS, { restTimer: true, autoProgress: true });
let logs     = lsGet(K_LOGS, {});
let customs  = lsGet(K_CUSTOM, []);
let unitOverrides = lsGet(K_UNITS, {});

// ── Library & plan (with one-time migration from the v2 program) ──
let library = lsGet(K_LIBRARY, null);
let plan    = lsGet(K_PLAN, null);
let days    = lsGet(K_DAYS, {});

if (!library || !Array.isArray(library.workouts) || !library.workouts.length) {
  const old = lsGet(K_PROGRAM, null);
  library = (old && old.weeks)
    ? libraryFromProgram(old, ['Week A · Barbell base', 'Week B · Power & Olympic'])
    : defaultLibrary();
  lsSet(K_LIBRARY, library);
}
if (!plan || !plan.rotation) {
  plan = { assign: {}, rotation: library.weeks.map(w => w.id) };
  lsSet(K_PLAN, plan);
}

const REST_DAY = { id: '__rest', name: 'Rest Day', focus: 'Recovery — sleep, protein, hydrate', minutes: 0, blocks: [], rest: true };
const REST_WEEK = { id: '__rest', name: 'Rest Week', focus: 'A full week off', days: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null } };

function saveLibrary() { lsSet(K_LIBRARY, library); }
function savePlan()    { lsSet(K_PLAN, plan); }
function saveDays()    { lsSet(K_DAYS, days); }
function saveLogs()    { lsSet(K_LOGS, logs); }
function saveCustoms() { lsSet(K_CUSTOM, customs); }
function saveUnits()   { lsSet(K_UNITS, unitOverrides); }

function workoutById(id) { return library.workouts.find(w => w.id === id) || null; }
function weekById(id)    { return id === '__rest' ? REST_WEEK : (library.weeks.find(w => w.id === id) || null); }
function newId(p)        { return p + '-' + Date.now().toString(36) + Math.floor(Math.random() * 900 + 100); }

// ── Which week template covers a given date ───────────────────
function weekIdFor(date) {
  const mk = iso(mondayOf(date));
  if (plan.assign[mk] && weekById(plan.assign[mk])) return plan.assign[mk];
  const rot = (plan.rotation || []).filter(id => weekById(id));
  if (!rot.length) return null;
  const anchor = mondayOf(new Date(EPOCH_MONDAY + 'T12:00'));
  const n = Math.round((mondayOf(date) - anchor) / (7 * 864e5));
  return rot[((n % rot.length) + rot.length) % rot.length];
}
function weekFor(date) { return weekById(weekIdFor(date)); }
function weekLabel(date) {
  const w = weekFor(date);
  return w ? w.name.toUpperCase() : 'NO WEEK SET';
}
function isAssigned(date) { return !!plan.assign[iso(mondayOf(date))]; }

// The workout shown on a date: a this-day-only version wins, otherwise
// the week template's slot for that weekday.
function dayFor(date) {
  const ds = iso(date);
  if (days[ds]) return days[ds];
  const wk = weekFor(date);
  const w = wk ? workoutById(wk.days[date.getDay()]) : null;
  return w || REST_DAY;
}
// Where a date's workout comes from: 'day' (detached), 'library', or 'none'
function daySource(dateStr) {
  if (days[dateStr]) return 'day';
  const d = new Date(dateStr + 'T12:00');
  const wk = weekFor(d);
  return wk && workoutById(wk.days[d.getDay()]) ? 'library' : 'none';
}

// ── Exercise lookup ───────────────────────────────────────────
function allExercises() { return BUILTIN_EXERCISES.concat(customs); }
function exById(id) { return allExercises().find(e => e.id === id); }

// ── Dates ─────────────────────────────────────────────────────
let selectedDate = new Date();
let weekOffset = 0; // for week view

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

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
// Each exercise can have its own unit (tap the lbs/kg label on its card);
// the Settings choice is just the default for exercises without one.
const LB_PER_KG = 2.20462;
function unitLabel(ex) {
  if (ex && unitOverrides[ex.id]) return unitOverrides[ex.id];
  return settings.units || 'lbs';
}
function isKg(ex) { return unitLabel(ex) === 'kg'; }
function toDisplayW(lbs, ex) { return Math.round((isKg(ex) ? lbs / LB_PER_KG : lbs) * 2) / 2; }
function fromDisplayW(v, ex) { return isKg(ex) ? v * LB_PER_KG : v; }
function fmtWt(lbs, ex) { return toDisplayW(lbs, ex) + ' ' + unitLabel(ex); }

function toggleUnit(exId) {
  const ex = exById(exId);
  unitOverrides[exId] = unitLabel(ex) === 'kg' ? 'lbs' : 'kg';
  saveUnits();
  renderSchedule();
}

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
  const add = w => { for (const block of (w.blocks || [])) if (block.items) map[block.id] = block; };
  for (const w of library.workouts) add(w);
  for (const w of Object.values(days)) add(w);
  return map;
}

// The block object as it exists on a specific date (day version wins)
function blockOn(dateStr, blockId) {
  const day = dayFor(new Date(dateStr + 'T12:00'));
  return (day.blocks || []).find(b => b.id === blockId) || blockMap()[blockId] || null;
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
  for (const t of ['week', 'schedule', 'library', 'progress', 'settings']) {
    document.getElementById('view-' + t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
  }
  if (tab === 'schedule') renderSchedule();
  if (tab === 'week') renderWeek();
  if (tab === 'library') renderLibrary();
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
  const src = daySource(dateStr);
  let head = `<h2>${esc(day.name)}</h2><span class="focus">${esc(day.focus || '')}</span>`;
  head += `<span class="pill">${esc(weekLabel(selectedDate))}</span>`;
  if (day.minutes) head += `<span class="pill time">~${day.minutes}m</span>`;
  if (src === 'day') head += `<span class="pill edited">THIS DAY ONLY</span>`;
  if (isDone) head += `<span class="pill done">DONE</span>`;
  head += `<div class="day-actions">
    <button class="link-btn" onclick="openPickWorkout('${dateStr}')">change workout</button>
    ${day.rest ? '' : `<button class="link-btn" onclick="editDayWorkout('${dateStr}')">edit</button>`}
    ${day.rest ? '' : `<button class="link-btn" onclick="openMove()">move</button>`}
    ${src === 'day' ? `<button class="link-btn" onclick="openSaveDay('${dateStr}')">save to library</button>
                       <button class="link-btn" onclick="revertDay('${dateStr}')">revert</button>` : ''}
  </div>`;
  document.getElementById('dayHeader').innerHTML = head;
  document.getElementById('dayProgressFill').style.width = c.total ? (100 * c.done / c.total) + '%' : '0';
  document.getElementById('addBlockBtn').classList.remove('hidden');

  const fin = document.getElementById('finishBtn');
  fin.classList.toggle('hidden', !!day.rest);
  fin.textContent = isDone ? '✓ Workout complete — tap to undo' : '✓ Finish workout';
  fin.className = 'wide ' + (isDone ? 'btn-outline' : 'btn-accent');
  if (day.rest) fin.classList.add('hidden');

  // blocks
  document.getElementById('blocks').innerHTML = day.rest
    ? `<div class="card"><p class="subtle" style="padding:6px 2px">😌 Rest day. ${esc(day.focus || '')}<br><br>Tap <strong>change workout</strong> above to pull one in from your library, or <strong>add block</strong> to build one here.</p></div>`
    : day.blocks.map(b => renderBlock(dateStr, b, log)).join('');
}

function renderBlock(dateStr, block, log) {
  const skipped = (log.skipped || []).includes(block.id);

  if (block.type === 'warmup') {
    const done = (log.warmup || {})[block.id] || [];
    const steps = block.steps.map((s, i) => `
      <div class="wu-step ${done.includes(i) ? 'done' : ''}" onclick="toggleWarmup('${dateStr}','${block.id}',${i})">
        <span class="n">${done.includes(i) ? '✓' : i + 1}</span>
        <span class="t">${esc(s.text)}</span>
        <span class="amt">${esc(s.amount)}</span>
      </div>`).join('');
    return `<div class="block">
      <div class="block-head">
        <span class="block-chip warmup">WARM-UP</span>
        <h3>${esc(block.name)}</h3>
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
      <h3>${esc(block.name)}</h3>
      <button class="link-btn" onclick="toggleSkip('${dateStr}','${block.id}')">${skipped ? 'unskip' : 'skip'}</button>
    </div>
    <div class="block-note">${esc(block.note || meta)}</div>
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
  const wDisplay = isBW || isTime ? 'BW' : toDisplayW(sug.weight || 0, ex) + unitLabel(ex);
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
      : `<div class="set-field"><input type="number" inputmode="decimal" value="${toDisplayW(wVal, ex)}" step="${isKg(ex) ? 1.25 : 2.5}" min="0"
            onchange="logField('${dateStr}','${key}',${s},'weight',this.value)" /><span class="unit">${unitLabel(ex)}</span></div>`;
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
      <h4>${esc(ex.name)}</h4>
      <span class="ex-count">${doneCount}/${item.sets}</span>
      <span class="spacer"></span>
      ${ex.load === 'weight' ? `<button class="link-btn" onclick="toggleUnit('${ex.id}')">${unitLabel(ex)} ⇄</button>` : ''}
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
  const block = blockOn(dateStr, key.split('|')[0]);
  const itemIdx = Number(key.split('|')[1]);
  const ex = block ? resolveEx(dateStr, block, itemIdx) : null;
  let v = Number(value) || 0;
  if (field === 'weight') v = fromDisplayW(v, ex); // inputs are in the exercise's display unit
  sets[setIdx][field] = v;
  if (ex && block.items[itemIdx]) stampLog(log, key, ex.id, block.items[itemIdx].reps);
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

// ── Edit scope: this day only vs. the saved workout ───────────
// Every structural edit routes through here, so a change she makes
// mid-workout never silently rewrites the saved version (or vice versa).
let scopeResolve = null;

function askScope(dateStr, title, todayLabel, libLabel, always) {
  const src = daySource(dateStr);
  const d = new Date(dateStr + 'T12:00');
  const wk = weekFor(d);

  if (!always) {
    if (src === 'day')  return Promise.resolve('day');  // already a one-off
    if (src === 'none') return Promise.resolve('new');  // nothing scheduled
  }
  // no editable week template behind this date — the change can only be local
  if (!wk || wk.id === '__rest') return Promise.resolve(src === 'day' ? 'day' : 'new');

  const day = dayFor(d);
  const body = src === 'library'
    ? `This day is running the saved workout <strong>${esc(day.name)}</strong>. Where should this go?`
    : src === 'day'
      ? `This day already has its own version. Keep it here, or push it to <strong>${esc(wk.name)}</strong>?`
      : `Nothing is scheduled here. Just this day, or every ${DOW_FULL[d.getDay()]} in <strong>${esc(wk.name)}</strong>?`;

  document.getElementById('scopeTitle').textContent = title;
  document.getElementById('scopeBody').innerHTML = `<p class="subtle">${body}</p>`;
  document.getElementById('scopeDayBtn').textContent = todayLabel || ('Just ' + fmtShort(d));
  document.getElementById('scopeLibBtn').textContent = libLabel ||
    (src === 'library' ? 'Update “' + day.name + '” everywhere' : 'Every ' + DOW_FULL[d.getDay()] + ' in ' + wk.name);
  document.getElementById('scopeSheet').classList.remove('hidden');
  return new Promise(res => { scopeResolve = res; });
}

function resolveScope(choice) {
  document.getElementById('scopeSheet').classList.add('hidden');
  const r = scopeResolve; scopeResolve = null;
  if (r) r(choice || null);
}

function detachWorkout(w) {
  const c = structuredClone(w);
  c.sourceId = (w.id && w.id !== '__rest') ? (w.sourceId || w.id) : null;
  c.id = newId('d');
  delete c.rest;
  return c;
}

// Runs fn on whichever workout object the edit should land in.
async function editDay(dateStr, title, fn, todayLabel, libLabel) {
  const choice = await askScope(dateStr, title, todayLabel, libLabel);
  if (!choice) return false;
  const d = new Date(dateStr + 'T12:00');

  if (choice === 'library') {
    const wk = weekFor(d);
    const target = workoutById(wk.days[d.getDay()]);
    if (!target) return false;
    fn(target);
    saveLibrary();
  } else if (choice === 'day') {
    if (!days[dateStr]) days[dateStr] = detachWorkout(dayFor(d));
    fn(days[dateStr]);
    saveDays();
  } else { // 'new' — nothing scheduled, build a workout just for this date
    days[dateStr] = { id: newId('d'), sourceId: null, name: 'Custom Workout', focus: '', minutes: 30, blocks: [] };
    fn(days[dateStr]);
    saveDays();
  }
  renderSchedule();
  renderWeek();
  return true;
}

function revertDay(dateStr) {
  if (!days[dateStr]) return;
  if (!confirm('Drop this day’s custom version and go back to what your week template says?')) return;
  delete days[dateStr];
  saveDays();
  renderSchedule();
  renderWeek();
}

// ── Swap ──────────────────────────────────────────────────────
let swapCtx = null;
function openSwap(dateStr, blockId, itemIdx) {
  const day = dayFor(new Date(dateStr + 'T12:00'));
  const block = day.blocks.find(b => b.id === blockId);
  const current = resolveEx(dateStr, block, itemIdx);
  swapCtx = { dateStr, blockId, itemIdx, current };

  const src = daySource(dateStr);
  document.getElementById('swapScopeRow').classList.toggle('hidden', src !== 'library');
  const always = document.querySelector('input[name="swapScope"][value="always"]');
  if (always) always.parentElement.lastChild.textContent = ' Save to “' + day.name + '”';
  const today = document.querySelector('input[name="swapScope"][value="today"]');
  if (today) today.checked = true;

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
  const picked = document.querySelector('input[name="swapScope"]:checked');
  const scope = daySource(dateStr) === 'library' && picked ? picked.value : 'today';

  if (scope === 'always') {
    const d = new Date(dateStr + 'T12:00');
    const wk = weekFor(d);
    const target = workoutById(wk.days[d.getDay()]);
    const block = target && target.blocks.find(b => b.id === blockId);
    if (block) { block.items[itemIdx].ex = newExId; saveLibrary(); }
    const log = dayLog(dateStr, true);
    if (log.swaps) delete log.swaps[setKey(blockId, itemIdx)];
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
  let exId; // weight input below is converted with this exercise's unit
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

  const item = {
    ex: exId,
    sets: Number(document.getElementById('addSets').value) || 3,
    reps: Number(document.getElementById('addReps').value) || 10,
    rpe: '',
    weight: fromDisplayW(Number(document.getElementById('addWeight').value) || 0, exById(exId)),
  };
  const dateStr = iso(selectedDate);
  const blockId = addCtx.blockId;
  closeSheets();
  editDay(dateStr, 'Add ' + (exById(exId) || {}).name, w => {
    const block = w.blocks.find(b => b.id === blockId);
    if (block) block.items.push(structuredClone(item));
  });
}

// ── Add block ─────────────────────────────────────────────────
function openAddBlock() {
  document.getElementById('newBlockName').value = '';
  document.getElementById('blockSheet').classList.remove('hidden');
}

function confirmAddBlock() {
  const name = document.getElementById('newBlockName').value.trim() || 'New Block';
  const block = {
    id: 'blk-' + Date.now(),
    type: document.getElementById('newBlockType').value,
    name,
    rounds: Number(document.getElementById('newBlockRounds').value) || 3,
    rest: Number(document.getElementById('newBlockRest').value) || 60,
    items: [],
  };
  const dateStr = iso(selectedDate);
  closeSheets();
  editDay(dateStr, 'Add block “' + name + '”', w => {
    const wasEmpty = !(w.blocks || []).length;
    w.blocks.push(structuredClone(block));
    // first block on an empty/rest day: the day takes the block's name
    if (wasEmpty && (w.rest || w.name === 'Rest Day' || w.name === 'Custom Workout')) {
      delete w.rest;
      w.name = name;
      w.minutes = w.minutes || 30;
    }
  });
}

function closeSheets() {
  for (const id of ['swapSheet', 'addSheet', 'blockSheet', 'moveSheet',
                    'pickSheet', 'saveDaySheet', 'weekPickSheet', 'weekEditSheet'])
    document.getElementById(id)?.classList.add('hidden');
}

// ── Move workout to another day ───────────────────────────────
// Operates on the week variant (A/B) that the given date falls in.
let moveCtx = null;
function openMove() { openMoveFor(iso(selectedDate)); }

function openMoveFor(dateStr) {
  const d = new Date(dateStr + 'T12:00');
  const week = weekFor(d);
  if (!week) { alert('No week template is set for this week yet.'); return; }
  moveCtx = { weekId: week.id, dow: d.getDay() };
  const nameOf = dw => { const w = workoutById(week.days[dw]); return w ? w.name : 'Rest'; };
  document.getElementById('moveTitle').textContent = 'Move ' + nameOf(moveCtx.dow);
  document.getElementById('moveNote').textContent =
    'This reorders “' + week.name + '”, so it applies to every week using that template.';
  const order = [1, 2, 3, 4, 5, 6, 0]; // Mon … Sun
  document.getElementById('moveList').innerHTML = order.map(dw => {
    const isCur = dw === moveCtx.dow;
    return `<div class="swap-item" ${isCur ? 'style="opacity:0.45"' : `onclick="confirmMove(${dw})"`}>
      <strong>${DOW_FULL[dw]}</strong>
      <span class="tag">${esc(nameOf(dw))}</span>
      ${isCur ? '<span class="tag">current</span>' : ''}
    </div>`;
  }).join('');
  document.getElementById('moveSheet').classList.remove('hidden');
}

function confirmMove(targetDow) {
  const { weekId, dow } = moveCtx;
  const week = weekById(weekId);
  if (!week) return;
  // the two days trade places, so nothing is ever lost
  [week.days[dow], week.days[targetDow]] = [week.days[targetDow], week.days[dow]];
  saveLibrary();
  closeSheets();
  renderSchedule();
  renderWeek();
}

// ── Week view ─────────────────────────────────────────────────
function shiftWeek(n) { weekOffset += n; renderWeek(); }

function renderWeek() {
  const monday = addDays(mondayOf(new Date()), weekOffset * 7);
  const today = iso(new Date());
  const wk = weekFor(monday);
  document.getElementById('weekRange2').textContent =
    fmtShort(monday) + ' – ' + fmtShort(addDays(monday, 6));

  // week template selector
  document.getElementById('weekProgram').innerHTML = `
    <div class="wp-row">
      <div class="wp-body">
        <span class="wp-label">PROGRAM THIS WEEK</span>
        <strong>${esc(wk ? wk.name : 'Nothing set')}</strong>
        <span class="subtle">${esc(wk ? (wk.focus || '') : 'Pick a week template to fill these days')}${
          wk && !isAssigned(monday) ? ' · on rotation' : ''}</span>
      </div>
      <button class="btn-outline" onclick="openWeekPicker('${iso(monday)}')">change</button>
    </div>`;

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
    const tag = days[ds] ? '<span class="pill edited">DAY</span>' : '';
    html += `<div class="week-card ${isTrain ? 'train' : ''} ${ds === today ? 'today' : ''}" onclick="selectDate('${ds}');showTab('schedule')">
      <div class="wc-date"><span class="dow">${DOWS[d.getDay()]}</span><span class="dnum">${d.getDate()}</span></div>
      <div class="wc-body"><strong>${esc(day.name)}</strong><span class="subtle">${esc(day.focus || '')}</span></div>
      ${tag}${status}
      <button class="link-btn" onclick="event.stopPropagation();openPickWorkout('${ds}')">change</button>
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
    const chartEx = exById(sel.value);
    const hist = exerciseHistory(sel.value);
    const points = hist.map(h => ({
      x: h.date,
      y: toDisplayW(Math.max(...h.sets.filter(s => s.done).map(s => Number(s.weight) || 0), 0), chartEx),
    }));
    drawLineChart(canvas, points, ' ' + unitLabel(chartEx));
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
  const blob = new Blob([JSON.stringify({ v: 3, settings, library, plan, days, logs, customs, unitOverrides }, null, 2)], { type: 'application/json' });
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
      if (data.library && data.library.workouts) { library = data.library; saveLibrary(); }
      else if (data.program && data.program.weeks) { // v2 backup
        library = libraryFromProgram(data.program, ['Week A', 'Week B']); saveLibrary();
        plan = { assign: {}, rotation: library.weeks.map(w => w.id) }; savePlan();
      }
      if (data.plan && data.plan.rotation) { plan = data.plan; savePlan(); }
      if (data.days)     { days = data.days; saveDays(); }
      if (data.logs)     { logs = data.logs; saveLogs(); }
      if (data.customs)  { customs = data.customs; saveCustoms(); }
      if (data.unitOverrides) { unitOverrides = data.unitOverrides; saveUnits(); }
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
  if (!confirm('Reset your library to the default Week A / Week B plan? Every saved workout and week template you made will be lost. Your logged history stays.')) return;
  library = defaultLibrary();
  plan = { assign: {}, rotation: library.weeks.map(w => w.id) };
  days = {};
  saveLibrary(); savePlan(); saveDays();
  renderSchedule();
  alert('Library reset ✓');
}

// ── Boot ──────────────────────────────────────────────────────
renderSchedule();
