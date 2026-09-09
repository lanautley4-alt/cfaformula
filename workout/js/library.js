/* ============================================================
   Workout Tracker — Library: saved workouts & week templates
   ------------------------------------------------------------
   A *workout* is one session, saved on its own so it can be
   dropped into any day. A *week template* points seven slots at
   workouts. Weeks you haven't assigned cycle through the
   rotation, which is what keeps the old A/B alternation working.
   ============================================================ */

// ── Library tab ───────────────────────────────────────────────
let libTab = 'workouts';

function setLibTab(t) { libTab = t; renderLibrary(); }

function renderLibrary() {
  document.getElementById('libSeg').innerHTML = ['workouts', 'weeks'].map(t =>
    `<button class="${libTab === t ? 'active' : ''}" onclick="setLibTab('${t}')">${t === 'workouts' ? 'WORKOUTS' : 'WEEK TEMPLATES'}</button>`
  ).join('');
  document.getElementById('libBody').innerHTML =
    libTab === 'workouts' ? libWorkoutsHtml() : libWeeksHtml();
}

function workoutUsage(id) {
  const weeks = library.weeks.filter(w => Object.values(w.days).includes(id));
  return weeks.map(w => w.name);
}

function workoutSummary(w) {
  const work = (w.blocks || []).filter(b => b.type !== 'warmup');
  const sets = work.reduce((n, b) => n + b.items.reduce((m, i) => m + (i.sets || 0), 0), 0);
  const exs = work.reduce((n, b) => n + b.items.length, 0);
  return `${exs} exercise${exs === 1 ? '' : 's'} · ${sets} sets · ${work.length} block${work.length === 1 ? '' : 's'}`;
}

function libWorkoutsHtml() {
  const q = (document.getElementById('libSearch')?.value || '').trim().toLowerCase();
  const list = library.workouts
    .filter(w => !q || w.name.toLowerCase().includes(q) || (w.focus || '').toLowerCase().includes(q))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  let html = `<button class="btn-accent wide" onclick="newWorkout()">＋ New workout</button>`;
  if (!list.length) html += `<p class="empty">No workouts match.</p>`;

  html += list.map(w => `
    <div class="lib-card">
      <div class="lib-body" onclick="openWorkoutEditorById('${w.id}')">
        <strong>${esc(w.name)}</strong>
        <span class="subtle">${esc(w.focus || workoutSummary(w))}</span>
        <span class="lib-meta">~${w.minutes || 45}m · ${workoutSummary(w)}${
          workoutUsage(w.id).length ? ' · in ' + esc(workoutUsage(w.id).join(', ')) : ' · not in any week'}</span>
        <div class="lib-actions">
          <button class="link-btn accent" onclick="event.stopPropagation();openAddToWeek('${w.id}')">＋ add to a week</button>
          <span class="spacer"></span>
          <button class="link-btn" onclick="event.stopPropagation();openWorkoutEditorById('${w.id}')">edit</button>
          <button class="link-btn" onclick="event.stopPropagation();duplicateWorkout('${w.id}')">copy</button>
          <button class="link-btn danger" onclick="event.stopPropagation();deleteWorkout('${w.id}')">delete</button>
        </div>
      </div>
    </div>`).join('');
  return html;
}

function libWeeksHtml() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  let html = `<button class="btn-accent wide" onclick="newWeek()">＋ New week template</button>`;

  html += library.weeks.map(wk => {
    const dots = order.map(dw => {
      const w = workoutById(wk.days[dw]);
      return `<span class="mini ${w ? 'on' : ''}" title="${esc(w ? w.name : 'Rest')}">${DOWS[dw][0]}</span>`;
    }).join('');
    const trainDays = order.filter(dw => workoutById(wk.days[dw])).length;
    const mins = order.reduce((n, dw) => n + ((workoutById(wk.days[dw]) || {}).minutes || 0), 0);
    const inRotation = (plan.rotation || []).includes(wk.id);
    return `
      <div class="lib-card" onclick="openWeekEditor('${wk.id}')">
        <div class="lib-body">
          <strong>${esc(wk.name)}</strong>
          <span class="subtle">${esc(wk.focus || '')}</span>
          <span class="lib-meta">${trainDays} training day${trainDays === 1 ? '' : 's'} · ~${mins}m total</span>
          <div class="mini-week">${dots}</div>
        </div>
        <button class="link-btn ${inRotation ? 'on' : ''}" onclick="event.stopPropagation();toggleRotation('${wk.id}')">${inRotation ? '✓ rotation' : 'rotation'}</button>
        <button class="link-btn" onclick="event.stopPropagation();duplicateWeek('${wk.id}')">copy</button>
      </div>`;
  }).join('');

  const rot = (plan.rotation || []).map(id => (weekById(id) || {}).name).filter(Boolean);
  html += `<div class="card"><div class="card-head"><h2>Automatic rotation</h2></div>
    <p class="subtle">Any week you haven't picked a template for cycles through these, in order:
    <strong>${rot.length ? esc(rot.join(' → ')) : 'nothing — those weeks show as rest'}</strong>.
    Tap “rotation” on a template above to add or remove it.</p></div>`;
  return html;
}

function toggleRotation(id) {
  plan.rotation = plan.rotation || [];
  const at = plan.rotation.indexOf(id);
  if (at >= 0) plan.rotation.splice(at, 1); else plan.rotation.push(id);
  savePlan();
  renderLibrary();
}

function duplicateWorkout(id) {
  const w = workoutById(id);
  if (!w) return;
  const copy = structuredClone(w);
  copy.id = newId('w');
  copy.name = w.name + ' (copy)';
  copy.blocks.forEach(b => { b.id = 'blk-' + Math.random().toString(36).slice(2, 9); });
  library.workouts.push(copy);
  saveLibrary();
  renderLibrary();
}

function deleteWorkout(id) {
  const w = workoutById(id);
  if (!w) return;
  const used = workoutUsage(id);
  if (!confirm(`Delete “${w.name}”?` + (used.length ? `\n\nIt's used by: ${used.join(', ')} — those days become rest days.` : '') + '\n\nYour logged history is kept.')) return;
  library.workouts = library.workouts.filter(x => x.id !== id);
  for (const wk of library.weeks)
    for (const dw of Object.keys(wk.days)) if (wk.days[dw] === id) wk.days[dw] = null;
  saveLibrary();
  renderLibrary();
  renderSchedule();
}

function newWorkout() {
  const draft = { id: newId('w'), name: 'New Workout', focus: '', minutes: 45, blocks: [] };
  openWorkoutEditor(draft, d => {
    library.workouts.push(d);
    saveLibrary();
    renderLibrary();
  });
}

function openWorkoutEditorById(id) {
  const w = workoutById(id);
  if (!w) return;
  openWorkoutEditor(w, d => {
    const i = library.workouts.findIndex(x => x.id === id);
    library.workouts[i] = d;
    saveLibrary();
    renderLibrary();
    renderSchedule();
  });
}

// ── Week templates ────────────────────────────────────────────
function newWeek() {
  const wk = { id: newId('wk'), name: 'New Week', focus: '', days: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null } };
  library.weeks.push(wk);
  saveLibrary();
  openWeekEditor(wk.id);
}

function duplicateWeek(id) {
  const wk = weekById(id);
  if (!wk) return;
  const copy = structuredClone(wk);
  copy.id = newId('wk');
  copy.name = wk.name + ' (copy)';
  library.weeks.push(copy);
  saveLibrary();
  renderLibrary();
}

let weekEditId = null;

function openWeekEditor(id) {
  weekEditId = id;
  renderWeekEditor();
  document.getElementById('weekEditSheet').classList.remove('hidden');
}

function renderWeekEditor() {
  const wk = weekById(weekEditId);
  if (!wk) return;
  document.getElementById('weekEditName').value = wk.name;
  document.getElementById('weekEditFocus').value = wk.focus || '';
  const order = [1, 2, 3, 4, 5, 6, 0];
  document.getElementById('weekEditDays').innerHTML = order.map(dw => {
    const w = workoutById(wk.days[dw]);
    return `<div class="swap-item" onclick="pickForWeekSlot(${dw})">
      <strong>${DOW_FULL[dw]}</strong>
      <span class="tag">${esc(w ? w.name : 'Rest')}</span>
      ${w ? `<span class="tag">~${w.minutes || 45}m</span>` : ''}
    </div>`;
  }).join('');
}

function weekEditMeta() {
  const wk = weekById(weekEditId);
  if (!wk) return;
  wk.name = document.getElementById('weekEditName').value.trim() || 'Week';
  wk.focus = document.getElementById('weekEditFocus').value.trim();
  saveLibrary();
}

function pickForWeekSlot(dw) {
  const wk = weekById(weekEditId);
  openWorkoutPicker('Choose a workout for ' + DOW_FULL[dw], id => {
    wk.days[dw] = id; // null = rest
    saveLibrary();
    renderWeekEditor();
    renderSchedule();
    renderWeek();
  });
}

function closeWeekEditor() {
  weekEditMeta();
  document.getElementById('weekEditSheet').classList.add('hidden');
  renderLibrary();
  renderSchedule();
  renderWeek();
}

function deleteWeekTemplate() {
  const wk = weekById(weekEditId);
  if (!wk) return;
  if (!confirm(`Delete the week template “${wk.name}”? The workouts in it stay in your library.`)) return;
  library.weeks = library.weeks.filter(x => x.id !== weekEditId);
  plan.rotation = (plan.rotation || []).filter(id => id !== weekEditId);
  for (const k of Object.keys(plan.assign)) if (plan.assign[k] === weekEditId) delete plan.assign[k];
  saveLibrary(); savePlan();
  document.getElementById('weekEditSheet').classList.add('hidden');
  renderLibrary(); renderSchedule(); renderWeek();
}

/* ── Add a workout straight into a week, from the Library ─────
   Two stages in one sheet: which week, then which day. "This week"
   and "next week" pin the single date; a template changes that day
   in every week running it. */
let addWeekCtx = null;

function openAddToWeek(workoutId) {
  addWeekCtx = { workoutId, target: null };
  renderAddToWeek();
  document.getElementById('addWeekSheet').classList.remove('hidden');
}

function renderAddToWeek() {
  const w = workoutById(addWeekCtx.workoutId);
  if (!w) return;
  const mon = mondayOf(new Date());
  const next = addDays(mon, 7);

  if (!addWeekCtx.target) {
    document.getElementById('addWeekTitle').textContent = 'Add ' + w.name;
    document.getElementById('addWeekNote').textContent = 'Where should it go?';
    document.getElementById('addWeekList').innerHTML =
      `<div class="swap-section">One week only</div>
       <div class="swap-item" onclick="pickAddTarget('date:${iso(mon)}')">
         <strong>This week</strong><span class="tag">${esc(fmtShort(mon))} – ${esc(fmtShort(addDays(mon, 6)))}</span></div>
       <div class="swap-item" onclick="pickAddTarget('date:${iso(next)}')">
         <strong>Next week</strong><span class="tag">${esc(fmtShort(next))} – ${esc(fmtShort(addDays(next, 6)))}</span></div>
       <div class="swap-section">Every week running a template</div>` +
      library.weeks.map(wk => `<div class="swap-item" onclick="pickAddTarget('week:${wk.id}')">
         <strong>${esc(wk.name)}</strong>
         <span class="tag">${[1,2,3,4,5,6,0].filter(dw => workoutById(wk.days[dw])).length}d</span></div>`).join('');
    return;
  }

  const [kind, val] = addWeekCtx.target.split(':');
  const order = [1, 2, 3, 4, 5, 6, 0];
  const label = kind === 'week' ? weekById(val).name : 'week of ' + fmtShort(new Date(val + 'T12:00'));
  document.getElementById('addWeekTitle').textContent = 'Which day?';
  document.getElementById('addWeekNote').textContent = w.name + ' → ' + label;
  document.getElementById('addWeekList').innerHTML =
    `<div class="swap-item" onclick="backToAddTarget()"><strong>‹ Back</strong></div>` +
    order.map(dw => {
      let cur;
      if (kind === 'week') { const x = workoutById(weekById(val).days[dw]); cur = x ? x.name : 'Rest'; }
      else cur = dayFor(new Date(iso(addDays(new Date(val + 'T12:00'), (dw + 6) % 7)) + 'T12:00')).name;
      return `<div class="swap-item" onclick="confirmAddToWeek(${dw})">
        <strong>${DOW_FULL[dw]}</strong><span class="tag">${esc(cur)}</span></div>`;
    }).join('');
}

function pickAddTarget(t) { addWeekCtx.target = t; renderAddToWeek(); }
function backToAddTarget() { addWeekCtx.target = null; renderAddToWeek(); }

function confirmAddToWeek(dw) {
  const { workoutId, target } = addWeekCtx;
  const [kind, val] = target.split(':');
  if (kind === 'week') {
    const wk = weekById(val);
    if (!wk || wk.id === '__rest') return;
    wk.days[dw] = workoutId;
    saveLibrary();
  } else {
    const date = iso(addDays(new Date(val + 'T12:00'), (dw + 6) % 7));
    days[date] = detachWorkout(workoutById(workoutId));
    saveDays();
  }
  closeSheets();
  renderLibrary(); renderSchedule(); renderWeek();
  const w = workoutById(workoutId);
  alert(w.name + ' added to ' + DOW_FULL[dw] + ' ✓');
}

// ── Assign a week template to a calendar week ─────────────────
let weekPickMonday = null;

function openWeekPicker(mondayISO) {
  weekPickMonday = mondayISO;
  const cur = weekIdFor(new Date(mondayISO + 'T12:00'));
  const assigned = !!plan.assign[mondayISO];
  document.getElementById('weekPickTitle').textContent =
    'Program for ' + fmtShort(new Date(mondayISO + 'T12:00')) + ' week';
  document.getElementById('weekPickList').innerHTML =
    library.weeks.map(wk => {
      const order = [1, 2, 3, 4, 5, 6, 0];
      const trainDays = order.filter(dw => workoutById(wk.days[dw])).length;
      const mins = order.reduce((n, dw) => n + ((workoutById(wk.days[dw]) || {}).minutes || 0), 0);
      return `<div class="swap-item" onclick="assignWeek('${wk.id}')">
        <strong>${esc(wk.name)}</strong>
        <span class="tag">${trainDays}d</span>
        <span class="tag">~${mins}m</span>
        ${wk.id === cur ? `<span class="tag">${assigned ? 'current' : 'on rotation'}</span>` : ''}
      </div>`;
    }).join('') +
    `<div class="swap-item" onclick="assignWeek('__rest')"><strong>Full rest week</strong><span class="tag">no training</span></div>` +
    (assigned ? `<div class="swap-item" onclick="assignWeek(null)"><strong>Back to automatic rotation</strong></div>` : '');
  document.getElementById('weekPickSheet').classList.remove('hidden');
}

function assignWeek(id) {
  if (id === null || id === 'null') delete plan.assign[weekPickMonday];
  else plan.assign[weekPickMonday] = id;
  savePlan();
  closeSheets();
  renderWeek();
  renderSchedule();
}

// ── Pick a workout for one date ───────────────────────────────
let pickCb = null;

function openWorkoutPicker(title, cb) {
  pickCb = cb;
  document.getElementById('pickTitle').textContent = title;
  document.getElementById('pickSearch').value = '';
  renderPickList();
  document.getElementById('pickSheet').classList.remove('hidden');
}

function renderPickList() {
  const q = (document.getElementById('pickSearch').value || '').trim().toLowerCase();
  const list = library.workouts
    .filter(w => !q || w.name.toLowerCase().includes(q) || (w.focus || '').toLowerCase().includes(q))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById('pickList').innerHTML =
    `<div class="swap-item" onclick="choosePick(null)"><strong>Rest day</strong><span class="tag">nothing scheduled</span></div>` +
    (list.map(w => `<div class="swap-item" onclick="choosePick('${w.id}')">
        <strong>${esc(w.name)}</strong>
        <span class="tag">~${w.minutes || 45}m</span>
        <span class="tag">${esc((w.focus || '').split('·')[0].trim() || 'workout')}</span>
      </div>`).join('') || '<p class="empty">No workouts match.</p>');
}

function choosePick(id) {
  const cb = pickCb; pickCb = null;
  document.getElementById('pickSheet').classList.add('hidden');
  if (cb && id !== undefined) cb(id); // undefined = dismissed
}

// From the day / week view: put a different workout on this date
function openPickWorkout(dateStr) {
  const d = new Date(dateStr + 'T12:00');
  openWorkoutPicker('Workout for ' + DOW_FULL[d.getDay()] + ', ' + fmtShort(d), async id => {
    const wk = weekFor(d);
    const choice = await askScope(dateStr, 'Change workout', 'Just ' + fmtShort(d),
      wk ? 'Every ' + DOW_FULL[d.getDay()] + ' in ' + wk.name : null, true);
    if (!choice) return;

    if (choice === 'library') {
      wk.days[d.getDay()] = id;
      delete days[dateStr];           // the week template now decides this date
      saveLibrary(); saveDays();
    } else {
      if (id === null) days[dateStr] = { id: newId('d'), sourceId: null, name: 'Rest Day', focus: 'Recovery', minutes: 0, blocks: [], rest: true };
      else days[dateStr] = detachWorkout(workoutById(id));
      saveDays();
    }
    renderSchedule(); renderWeek();
  });
}

// ── Save this day's version into the library ──────────────────
function openSaveDay(dateStr) {
  const w = days[dateStr];
  if (!w) return;
  const src = w.sourceId ? workoutById(w.sourceId) : null;
  document.getElementById('saveDayName').value = w.name + (src ? ' v2' : '');
  document.getElementById('saveDayOver').classList.toggle('hidden', !src);
  if (src) document.getElementById('saveDayOver').textContent = 'Update “' + src.name + '”';
  document.getElementById('saveDaySheet').dataset.date = dateStr;
  document.getElementById('saveDaySheet').classList.remove('hidden');
}

function saveDayAsNew() {
  const dateStr = document.getElementById('saveDaySheet').dataset.date;
  const w = days[dateStr];
  if (!w) return;
  const copy = structuredClone(w);
  copy.id = newId('w');
  copy.sourceId = null;
  copy.name = document.getElementById('saveDayName').value.trim() || 'Saved Workout';
  delete copy.rest;
  library.workouts.push(copy);
  saveLibrary();
  // this date now points at the saved workout rather than a loose copy
  days[dateStr].sourceId = copy.id;
  saveDays();
  closeSheets();
  renderSchedule();
  alert('Saved to your library ✓');
}

function saveDayOverwrite() {
  const dateStr = document.getElementById('saveDaySheet').dataset.date;
  const w = days[dateStr];
  const src = w && w.sourceId ? workoutById(w.sourceId) : null;
  if (!src) return;
  const keepId = src.id;
  const updated = structuredClone(w);
  updated.id = keepId;
  updated.sourceId = null;
  updated.name = src.name;
  delete updated.rest;
  library.workouts[library.workouts.findIndex(x => x.id === keepId)] = updated;
  saveLibrary();
  delete days[dateStr];  // back on the library version, which now matches
  saveDays();
  closeSheets();
  renderSchedule();
  renderWeek();
  alert('“' + src.name + '” updated ✓');
}

// ── Edit the workout on a given date (asks scope first) ───────
async function editDayWorkout(dateStr) {
  const choice = await askScope(dateStr, 'Edit workout', 'Edit just this day', null);
  if (!choice) return;
  const d = new Date(dateStr + 'T12:00');

  if (choice === 'library') {
    const wk = weekFor(d);
    const w = workoutById(wk.days[d.getDay()]);
    openWorkoutEditor(w, draft => {
      library.workouts[library.workouts.findIndex(x => x.id === w.id)] = draft;
      saveLibrary(); renderSchedule(); renderWeek();
    });
  } else {
    if (!days[dateStr]) days[dateStr] = detachWorkout(dayFor(d));
    const cur = days[dateStr];
    openWorkoutEditor(cur, draft => {
      draft.id = cur.id;
      draft.sourceId = cur.sourceId || null;
      days[dateStr] = draft;
      saveDays(); renderSchedule(); renderWeek();
    });
  }
}

/* ============================================================
   Workout editor
   ============================================================ */
let ed = null; // { draft, onSave }

function openWorkoutEditor(workout, onSave) {
  ed = { draft: structuredClone(workout), onSave };
  delete ed.draft.rest;
  if (!Array.isArray(ed.draft.blocks)) ed.draft.blocks = [];
  document.getElementById('editorView').classList.remove('hidden');
  document.body.classList.add('editing');
  renderEditor();
}

function closeEditor(save) {
  if (save) {
    const d = ed.draft;
    d.name = document.getElementById('edName').value.trim() || 'Workout';
    d.focus = document.getElementById('edFocus').value.trim();
    d.minutes = Number(document.getElementById('edMinutes').value) || 0;
    const cb = ed.onSave;
    if (cb) cb(d);
  }
  ed = null;
  document.getElementById('editorView').classList.add('hidden');
  document.body.classList.remove('editing');
}

function edSyncMeta() {
  if (!ed) return;
  ed.draft.name = document.getElementById('edName').value;
  ed.draft.focus = document.getElementById('edFocus').value;
  ed.draft.minutes = Number(document.getElementById('edMinutes').value) || 0;
}

function renderEditor() {
  const d = ed.draft;
  document.getElementById('edName').value = d.name || '';
  document.getElementById('edFocus').value = d.focus || '';
  document.getElementById('edMinutes').value = d.minutes || 45;

  document.getElementById('edBlocks').innerHTML = d.blocks.map((b, bi) => {
    const head = `
      <div class="ed-block-head">
        <select class="ed-type" onchange="edBlockField(${bi},'type',this.value)">
          ${['warmup', 'superset', 'circuit'].map(t =>
            `<option value="${t}" ${b.type === t ? 'selected' : ''}>${t.toUpperCase()}</option>`).join('')}
        </select>
        <input class="ed-name" value="${esc(b.name || '')}" placeholder="Block name"
               onchange="edBlockField(${bi},'name',this.value)" />
        <button class="link-btn" onclick="edMoveBlock(${bi},-1)">↑</button>
        <button class="link-btn" onclick="edMoveBlock(${bi},1)">↓</button>
        <button class="link-btn danger" onclick="edDelBlock(${bi})">✕</button>
      </div>`;

    if (b.type === 'warmup') {
      const steps = (b.steps || []).map((s, si) => `
        <div class="ed-row">
          <input class="grow" value="${esc(s.text)}" placeholder="Movement"
                 onchange="edStepField(${bi},${si},'text',this.value)" />
          <input class="w70" value="${esc(s.amount || '')}" placeholder=":30"
                 onchange="edStepField(${bi},${si},'amount',this.value)" />
          <button class="link-btn danger" onclick="edDelStep(${bi},${si})">✕</button>
        </div>`).join('');
      return `<div class="ed-block">${head}${steps}
        <button class="add-ex-btn" onclick="edAddStep(${bi})">＋ Add warm-up step</button></div>`;
    }

    const meta = `
      <div class="ed-row meta">
        <label>Rounds</label><input class="w60" type="number" min="1" max="15" value="${b.rounds || 3}"
          onchange="edBlockField(${bi},'rounds',+this.value)" />
        <label>Rest (s)</label><input class="w60" type="number" min="0" max="600" step="15" value="${b.rest || 60}"
          onchange="edBlockField(${bi},'rest',+this.value)" />
      </div>
      <input class="ed-note" value="${esc(b.note || '')}" placeholder="Note (optional)"
             onchange="edBlockField(${bi},'note',this.value)" />`;

    const items = (b.items || []).map((it, ii) => {
      const ex = exById(it.ex);
      const weighted = ex && ex.load === 'weight';
      return `<div class="ed-item">
        <div class="ed-row">
          <button class="ed-ex" onclick="edPickEx(${bi},${ii})">${esc(ex ? ex.name : 'Pick exercise')} ⇄</button>
          <button class="link-btn" onclick="edMoveItem(${bi},${ii},-1)">↑</button>
          <button class="link-btn" onclick="edMoveItem(${bi},${ii},1)">↓</button>
          <button class="link-btn danger" onclick="edDelItem(${bi},${ii})">✕</button>
        </div>
        <div class="ed-nums">
          <div class="np"><label>Sets</label>
            <input type="number" min="1" max="20" value="${it.sets || 3}"
              onchange="edItemField(${bi},${ii},'sets',+this.value)" /></div>
          <div class="np"><label>${ex && ex.repUnit ? esc(ex.repUnit) : 'Reps'}</label>
            <input type="number" min="1" max="999" value="${it.reps || 10}"
              onchange="edItemField(${bi},${ii},'reps',+this.value)" /></div>
          <div class="np"><label>${weighted ? unitLabel(ex) : 'Load'}</label>
            ${weighted
              ? `<input type="number" min="0" step="${isKg(ex) ? 1.25 : 2.5}"
                   value="${toDisplayW(it.weight || 0, ex)}" onchange="edItemWeight(${bi},${ii},this.value)" />`
              : `<input value="BW" disabled />`}</div>
          <div class="np"><label>RPE</label>
            <input value="${esc(it.rpe || '')}" placeholder="7-8"
              onchange="edItemField(${bi},${ii},'rpe',this.value)" /></div>
        </div>
      </div>`;
    }).join('');

    return `<div class="ed-block">${head}${meta}${items}
      <button class="add-ex-btn" onclick="edAddItem(${bi})">＋ Add exercise</button></div>`;
  }).join('');
}

function edBlockField(bi, f, v) {
  const b = ed.draft.blocks[bi];
  b[f] = v;
  // rounds and per-exercise sets are the same number — keep them together,
  // otherwise the day view still shows the old number of set rows
  if (f === 'rounds') {
    for (const it of (b.items || [])) it.sets = v;
    renderEditor();
  }
  if (f === 'type') {
    if (v === 'warmup' && !b.steps) b.steps = [{ text: '', amount: '' }];
    if (v !== 'warmup' && !b.items) { b.items = []; b.rounds = b.rounds || 3; b.rest = b.rest || 60; }
    renderEditor();
  }
}
function edItemField(bi, ii, f, v) { ed.draft.blocks[bi].items[ii][f] = v; }
function edItemWeight(bi, ii, v) {
  const it = ed.draft.blocks[bi].items[ii];
  it.weight = fromDisplayW(Number(v) || 0, exById(it.ex));
}
function edStepField(bi, si, f, v) { ed.draft.blocks[bi].steps[si][f] = v; }

function edMoveBlock(bi, dir) {
  const a = ed.draft.blocks, j = bi + dir;
  if (j < 0 || j >= a.length) return;
  [a[bi], a[j]] = [a[j], a[bi]];
  renderEditor();
}
function edDelBlock(bi) {
  if (!confirm('Remove “' + (ed.draft.blocks[bi].name || 'this block') + '” from this workout?')) return;
  ed.draft.blocks.splice(bi, 1);
  renderEditor();
}
function edAddBlock(type) {
  const b = { id: 'blk-' + Math.random().toString(36).slice(2, 9), type, name: type === 'warmup' ? 'Warm-up' : 'New Block' };
  if (type === 'warmup') b.steps = [{ text: '', amount: '' }];
  else { b.rounds = 3; b.rest = 60; b.items = []; }
  ed.draft.blocks.push(b);
  renderEditor();
}
function edAddStep(bi) { (ed.draft.blocks[bi].steps ||= []).push({ text: '', amount: '' }); renderEditor(); }
function edDelStep(bi, si) { ed.draft.blocks[bi].steps.splice(si, 1); renderEditor(); }

function edMoveItem(bi, ii, dir) {
  const a = ed.draft.blocks[bi].items, j = ii + dir;
  if (j < 0 || j >= a.length) return;
  [a[ii], a[j]] = [a[j], a[ii]];
  renderEditor();
}
function edDelItem(bi, ii) { ed.draft.blocks[bi].items.splice(ii, 1); renderEditor(); }

function edAddItem(bi) {
  openExPicker('Add an exercise', exId => {
    const ex = exById(exId);
    ed.draft.blocks[bi].items.push({
      ex: exId,
      sets: ed.draft.blocks[bi].rounds || 3,
      reps: ex && ex.load === 'time' ? 30 : 10,
      rpe: '',
      weight: 0,
    });
    renderEditor();
  });
}

function edPickEx(bi, ii) {
  openExPicker('Change exercise', exId => {
    ed.draft.blocks[bi].items[ii].ex = exId;
    renderEditor();
  });
}

/* ── Exercise picker (used by the editor) ───────────────────── */
let exPickCb = null;

function openExPicker(title, cb) {
  exPickCb = cb;
  document.getElementById('exPickTitle').textContent = title;
  document.getElementById('exPickSearch').value = '';
  document.getElementById('exPickNew').value = '';
  renderExPickList();
  document.getElementById('exPickSheet').classList.remove('hidden');
}

function renderExPickList() {
  const q = (document.getElementById('exPickSearch').value || '').trim().toLowerCase();
  const all = allExercises();
  const hits = q
    ? all.filter(e => e.name.toLowerCase().includes(q) || e.muscles.some(m => m.includes(q)) ||
                      e.pattern.includes(q) || e.equip.includes(q))
    : all;
  const groups = {};
  for (const e of hits) (groups[e.muscles[0]] = groups[e.muscles[0]] || []).push(e);
  const row = e => `<div class="swap-item" onclick="chooseEx('${e.id}')">
      <strong>${esc(e.name)}</strong><span class="tag">${esc(e.muscles[0])}</span><span class="tag">${esc(e.equip)}</span></div>`;

  let html = '';
  if (!hits.length) html = '<p class="empty">No matches.</p>';
  else if (q) html = hits.slice(0, 60).map(row).join('');
  else for (const m of Object.keys(groups).sort())
    html += `<details class="swap-group"><summary>${esc(m)} <span class="subtle">${groups[m].length}</span></summary>
      ${groups[m].sort((a, b) => a.name.localeCompare(b.name)).map(row).join('')}</details>`;
  document.getElementById('exPickList').innerHTML = html;
}

function chooseEx(id) {
  const cb = exPickCb; exPickCb = null;
  document.getElementById('exPickSheet').classList.add('hidden');
  if (cb) cb(id);
}

function createExFromPicker() {
  const name = document.getElementById('exPickNew').value.trim();
  if (!name) { alert('Give the exercise a name first.'); return; }
  const id = 'custom-' + Date.now();
  customs.push({
    id, name, pattern: 'custom',
    muscles: [document.getElementById('exPickMuscle').value],
    equip: 'custom',
    load: document.getElementById('exPickLoad').value,
    inc: 5,
  });
  saveCustoms();
  chooseEx(id);
}

function closeExPicker() {
  exPickCb = null;
  document.getElementById('exPickSheet').classList.add('hidden');
}
