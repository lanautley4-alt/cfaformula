/* ============================================================
   Workout Tracker — App Logic
   ============================================================ */

// ── Storage ───────────────────────────────────────────────────
const K_SETTINGS = 'wt_settings';
const K_PROGRAM  = 'wt_program_v1';
const K_LOGS     = 'wt_logs';
const K_CUSTOM   = 'wt_custom_exercises';

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let settings = lsGet(K_SETTINGS, { restTimer: true, autoProgress: true });
let program  = lsGet(K_PROGRAM, null) || structuredClone(DEFAULT_PROGRAM);
let logs     = lsGet(K_LOGS, {});
let customs  = lsGet(K_CUSTOM, []);

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

// Resolve the exercise for an item on a date (today-only swaps live in the log)
function resolveEx(dateStr, block, itemIdx) {
  const log = dayLog(dateStr);
  const swapped = log.swaps && log.swaps[setKey(block.id, itemIdx)];
  return exById(swapped || block.items[itemIdx].ex);
}

// ── History & suggestions ─────────────────────────────────────
function exerciseHistory(exId) {
  const out = [];
  for (const [date, log] of Object.entries(logs)) {
    if (!log.sets) continue;
    const day = program[new Date(date + 'T12:00').getDay()];
    if (!day || !day.blocks) continue;
    for (const block of day.blocks) {
      if (!block.items) continue;
      block.items.forEach((item, i) => {
        const actualId = (log.swaps && log.swaps[setKey(block.id, i)]) || item.ex;
        if (actualId !== exId) return;
        const sets = log.sets[setKey(block.id, i)];
        if (sets && sets.some(s => s.done)) out.push({ date, sets, targetReps: item.reps });
      });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

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
  const day = program[new Date(dateStr + 'T12:00').getDay()];
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
  const day = program[selectedDate.getDay()];
  const log = dayLog(dateStr);

  document.getElementById('dayTitle').textContent =
    DOW_FULL[selectedDate.getDay()] + ', ' + fmtShort(selectedDate);
  document.getElementById('weekRange').textContent = fmtShort(monday) + ' – ' + fmtShort(sunday);

  // date strip
  let strip = '';
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const ds = iso(d);
    const pd = program[d.getDay()];
    const isTrain = pd && !pd.rest && pd.blocks.length;
    const c = dayCompletion(ds);
    const dotClass = !isTrain ? 'none' : (c.total && c.done >= c.total ? 'done' : '');
    strip += `<div class="date-cell ${ds === dateStr ? 'selected' : ''} ${ds === today ? 'today' : ''}" onclick="selectDate('${ds}')">
      <span class="dow">${DOWS[d.getDay()]}</span><span class="dnum">${d.getDate()}</span><span class="dot ${dotClass}"></span></div>`;
  }
  document.getElementById('dateStrip').innerHTML = strip;

  // day header
  const c = dayCompletion(dateStr);
  const isDone = c.total > 0 && c.done >= c.total;
  let head = `<h2>${day.name}</h2><span class="focus">${day.focus}</span>`;
  if (day.minutes) head += `<span class="pill time">~${day.minutes}m</span>`;
  if (isDone) head += `<span class="pill done">DONE</span>`;
  document.getElementById('dayHeader').innerHTML = head;
  document.getElementById('dayProgressFill').style.width = c.total ? (100 * c.done / c.total) + '%' : '0';
  document.getElementById('addBlockBtn').classList.toggle('hidden', !!day.rest);

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
  const wDisplay = isBW || isTime ? 'BW' : (sug.weight || 0) + 'lbs';
  const rx = `${item.sets}×${item.reps} @ ${wDisplay}` + (item.rpe ? ` <span class="rpe">RPE ${item.rpe}</span>` : '');

  let rows = '';
  for (let s = 0; s < item.sets; s++) {
    const sl = logged[s] || {};
    const done = !!sl.done;
    const wVal = sl.weight !== undefined ? sl.weight : sug.weight;
    const rVal = sl.reps !== undefined ? sl.reps : sug.reps;
    const weightField = (isBW || isTime)
      ? `<div class="set-field"><input value="BW" disabled /><span class="unit">&nbsp;</span></div>`
      : `<div class="set-field"><input type="number" inputmode="decimal" value="${wVal}" step="2.5" min="0"
            onchange="logField('${dateStr}','${key}',${s},'weight',this.value)" /><span class="unit">lbs</span></div>`;
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

function toggleSet(dateStr, blockId, itemIdx, setIdx) {
  const day = program[new Date(dateStr + 'T12:00').getDay()];
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
    if (s.weight === undefined) s.weight = sug.weight;
    if (s.reps === undefined) s.reps = sug.reps;
    s.done = true;
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
  sets[setIdx][field] = Number(value) || 0;
  saveLogs();
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
  const day = program[new Date(dateStr + 'T12:00').getDay()];
  const block = day.blocks.find(b => b.id === blockId);
  const current = resolveEx(dateStr, block, itemIdx);
  swapCtx = { dateStr, blockId, itemIdx };

  document.getElementById('swapTitle').textContent = 'Swap ' + current.name;
  const prim = current.muscles[0];
  const alts = allExercises().filter(e =>
    e.id !== current.id &&
    (e.pattern === current.pattern || e.muscles[0] === prim)
  );
  document.getElementById('swapList').innerHTML = alts.map(e => `
    <div class="swap-item" onclick="confirmSwap('${e.id}')">
      <strong>${e.name}</strong>
      <span class="tag">${e.muscles[0]}</span>
      <span class="tag">${e.equip}</span>
    </div>`).join('') || '<p class="subtle">No alternatives found — add one with ＋ Add exercise.</p>';
  document.getElementById('swapSheet').classList.remove('hidden');
}

function confirmSwap(newExId) {
  const { dateStr, blockId, itemIdx } = swapCtx;
  const scope = document.querySelector('input[name="swapScope"]:checked').value;
  const day = program[new Date(dateStr + 'T12:00').getDay()];
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
  const day = program[selectedDate.getDay()];
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
    weight: Number(document.getElementById('addWeight').value) || 0,
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
  const day = program[selectedDate.getDay()];
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
  for (const id of ['swapSheet', 'addSheet', 'blockSheet'])
    document.getElementById(id).classList.add('hidden');
}

// ── Week view ─────────────────────────────────────────────────
function shiftWeek(n) { weekOffset += n; renderWeek(); }

function renderWeek() {
  const monday = addDays(mondayOf(new Date()), weekOffset * 7);
  const today = iso(new Date());
  document.getElementById('weekRange2').textContent = fmtShort(monday) + ' – ' + fmtShort(addDays(monday, 6));

  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const ds = iso(d);
    const day = program[d.getDay()];
    const isTrain = day && !day.rest && day.blocks.length;
    const c = dayCompletion(ds);
    const status = !isTrain ? '' :
      c.done >= c.total && c.total > 0 ? '<span class="pill done">DONE</span>' :
      c.done > 0 ? `<span class="pill">${c.done}/${c.total} sets</span>` : '';
    html += `<div class="week-card ${isTrain ? 'train' : ''} ${ds === today ? 'today' : ''}" onclick="selectDate('${ds}');showTab('schedule')">
      <div class="wc-date"><span class="dow">${DOWS[d.getDay()]}</span><span class="dnum">${d.getDate()}</span></div>
      <div class="wc-body"><strong>${day.name}</strong><span class="subtle">${day.focus}</span></div>
      ${status}
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
    const day = program[d.getDay()];
    const isTrain = day && !day.rest && day.blocks.length;
    if (isTrain) {
      const c = dayCompletion(ds);
      const completed = c.total > 0 && c.done >= c.total;
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
    const day = program[d.getDay()];
    if (day && !day.rest && day.blocks.length) {
      scheduled++;
      const c = dayCompletion(iso(d));
      if (c.total > 0 && c.done >= c.total) doneThisWeek++;
    }
  }
  document.getElementById('statRow').innerHTML = `
    <div class="stat"><strong>${computeStreak()}</strong><span>WORKOUT STREAK</span></div>
    <div class="stat"><strong>${doneThisWeek}/${scheduled}</strong><span>THIS WEEK</span></div>
    <div class="stat"><strong>${Math.round(weekVolume(thisMonday) / 1000)}k</strong><span>LBS THIS WEEK</span></div>`;

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
      y: Math.max(...h.sets.filter(s => s.done).map(s => Number(s.weight) || 0), 0),
    }));
    drawLineChart(canvas, points, ' lbs');
  }

  // weekly volume bars (last 8 weeks)
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
}

function saveSettings() {
  settings.restTimer = document.getElementById('setRestTimer').checked;
  settings.autoProgress = document.getElementById('setAutoProgress').checked;
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
      if (data.program)  { program = data.program; saveProgram(); }
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
  if (!confirm('Reset your program to the default 5-day plan? Your logged history stays.')) return;
  program = structuredClone(DEFAULT_PROGRAM);
  saveProgram();
  renderSchedule();
  alert('Program reset ✓');
}

// ── Boot ──────────────────────────────────────────────────────
renderSchedule();
