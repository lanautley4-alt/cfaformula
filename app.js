/* ============================================================
   CFA Formula Board — App Logic
   ============================================================ */

// ── Storage helpers ───────────────────────────────────────────
const STORAGE_KEY = 'cfa_formulas_v2';   // v2 = fresh start

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let formulas = load();

// ── State ─────────────────────────────────────────────────────
let editingId    = null;
let activeFilter = 'all';

// Flashcard state
let fcDeck      = [];
let fcIndex     = 0;
let fcFlipped   = false;
let fcCorrect   = 0;
let fcMissed    = [];
let fcMissedSet = null;

// ── Utilities ─────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function categories() {
  return [...new Set(formulas.map(f => f.category).filter(Boolean))].sort();
}

function getActive() {
  return activeFilter === 'all'
    ? formulas
    : formulas.filter(f => f.category === activeFilter);
}

// ── MathJax helpers ───────────────────────────────────────────
function typesetEl(el) {
  if (!window.MathJax) return;
  // Clear any previous render so MathJax will re-process the element
  if (MathJax.typesetClear) MathJax.typesetClear([el]);
  if (MathJax.typesetPromise) MathJax.typesetPromise([el]).catch(console.warn);
}

function typeset(elements) {
  if (!window.MathJax || !MathJax.typesetPromise) return;
  MathJax.typesetPromise(elements).catch(console.warn);
}

// ── Escape HTML ───────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── Wrap LaTeX ────────────────────────────────────────────────
function wrapMath(raw) {
  if (!raw) return '';
  if (/\$\$/.test(raw) || /\\\[/.test(raw)) return raw;
  if (/^\$[^$].*[^$]\$$/.test(raw.trim())) return raw;
  return `$$${raw}$$`;
}

// ── Render board ──────────────────────────────────────────────
function renderBoard() {
  const query = (document.getElementById('searchInput').value || '').toLowerCase();
  const board = document.getElementById('board');

  let visible = getActive().filter(f =>
    !query ||
    f.title.toLowerCase().includes(query) ||
    (f.desc  || '').toLowerCase().includes(query) ||
    (f.formula || '').toLowerCase().includes(query)
  );

  const groups = {};
  visible.forEach(f => {
    const cat = f.category || 'Uncategorised';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(f);
  });

  if (Object.keys(groups).length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <h3>No formulas yet</h3>
        <p>Click <strong>+ New Formula</strong> to add your first one.</p>
      </div>`;
    renderFilters();
    return;
  }

  board.innerHTML = Object.keys(groups).sort().map(cat => `
    <div class="column" data-category="${esc(cat)}">
      <div class="column-header">
        <span class="column-title">${esc(cat)}</span>
        <span class="column-count">${groups[cat].length}</span>
      </div>
      <div class="column-cards" data-category="${esc(cat)}">
        ${groups[cat].map(cardHTML).join('')}
      </div>
    </div>
  `).join('');

  typeset();
  renderFilters();
  initSortable();
}

function cardHTML(f) {
  return `
    <div class="formula-card" id="card-${f.id}" data-id="${f.id}">
      <div class="drag-handle" title="Drag to move">⠿</div>
      <div class="card-title">${esc(f.title)}</div>
      <div class="card-formula">${wrapMath(f.formula)}</div>
      ${f.desc ? `<div class="card-desc">${esc(f.desc)}</div>` : ''}
      <div class="card-actions">
        <button class="btn btn-ghost" onclick="editFormula('${f.id}'); event.stopPropagation()">Edit</button>
        <button class="btn btn-danger" onclick="deleteFormula('${f.id}'); event.stopPropagation()">Delete</button>
      </div>
    </div>`;
}

// ── Drag & drop (SortableJS) ──────────────────────────────────
function initSortable() {
  if (typeof Sortable === 'undefined') return;

  document.querySelectorAll('.column-cards').forEach(container => {
    new Sortable(container, {
      group:       'formulas',
      animation:   150,
      handle:      '.drag-handle',
      ghostClass:  'card-ghost',
      chosenClass: 'card-chosen',
      onEnd(evt) {
        const formulaId   = evt.item.dataset.id;
        const newCat      = evt.to.dataset.category;
        const formula     = formulas.find(f => f.id === formulaId);
        if (!formula || !newCat) return;

        if (formula.category !== newCat) {
          formula.category = newCat;
          save(formulas);
          renderBoard();   // refresh counts + filters
        }
      }
    });
  });
}

// ── Filters ───────────────────────────────────────────────────
function renderFilters() {
  const wrap = document.getElementById('categoryFilters');
  const cats = categories();
  const allBtn = `<button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="setFilter('all',this)">All</button>`;
  const catBtns = cats.map(c =>
    `<button class="filter-btn ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${esc(c)}',this)">${esc(c)}</button>`
  ).join('');
  wrap.innerHTML = allBtn + catBtns;
}

function setFilter(cat) {
  activeFilter = cat;
  renderBoard();
}

// ── Add / Edit Modal ──────────────────────────────────────────
let previewTimer = null;

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'New Formula';
  document.getElementById('fTitle').value    = '';
  document.getElementById('fCategory').value = '';
  document.getElementById('fFormula').value  = '';
  document.getElementById('fDesc').value     = '';
  document.getElementById('previewContent').innerHTML = '';
  refreshCatList();
  document.getElementById('formulaModal').classList.remove('hidden');
  document.getElementById('fTitle').focus();
}

function editFormula(id) {
  const f = formulas.find(x => x.id === id);
  if (!f) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Formula';
  document.getElementById('fTitle').value    = f.title;
  document.getElementById('fCategory').value = f.category;
  document.getElementById('fFormula').value  = f.formula;
  document.getElementById('fDesc').value     = f.desc || '';
  refreshCatList();
  document.getElementById('formulaModal').classList.remove('hidden');
  updatePreview();
}

function closeModal() {
  document.getElementById('formulaModal').classList.add('hidden');
  editingId = null;
}

function saveFormula() {
  const title    = document.getElementById('fTitle').value.trim();
  const category = document.getElementById('fCategory').value.trim();
  const formula  = document.getElementById('fFormula').value.trim();
  const desc     = document.getElementById('fDesc').value.trim();

  if (!title)    { alert('Please enter a title.'); return; }
  if (!category) { alert('Please enter a category.'); return; }
  if (!formula)  { alert('Please enter a formula.'); return; }

  if (editingId) {
    const idx = formulas.findIndex(f => f.id === editingId);
    if (idx !== -1) formulas[idx] = { id: editingId, title, category, formula, desc };
  } else {
    formulas.push({ id: uid(), title, category, formula, desc });
  }

  save(formulas);
  closeModal();
  renderBoard();
}

function deleteFormula(id) {
  if (!confirm('Delete this formula?')) return;
  formulas = formulas.filter(f => f.id !== id);
  save(formulas);
  renderBoard();
}

// ── Live preview ──────────────────────────────────────────────
function updatePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const raw = document.getElementById('fFormula').value.trim();
    const el  = document.getElementById('previewContent');
    el.innerHTML = wrapMath(raw);
    typesetEl(el);
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fFormula').addEventListener('input', updatePreview);
  renderBoard();
});

// ── Quick-insert LaTeX ────────────────────────────────────────
function insertLatex(snippet) {
  const ta = document.getElementById('fFormula');
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  ta.value = ta.value.slice(0, start) + snippet + ta.value.slice(end);
  ta.selectionStart = ta.selectionEnd = start + snippet.length;
  ta.focus();
  updatePreview();
}

function refreshCatList() {
  const dl = document.getElementById('catList');
  dl.innerHTML = categories().map(c => `<option value="${esc(c)}"></option>`).join('');
}

// ── Flashcards ────────────────────────────────────────────────
function openFlashcards() {
  const sel = document.getElementById('fcCatSelect');
  sel.innerHTML = '<option value="all">All</option>' +
    categories().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  document.getElementById('flashcardModal').classList.remove('hidden');
  fcMissedSet = null;
  startDeck();
}

function closeFlashcards() {
  document.getElementById('flashcardModal').classList.add('hidden');
}

function startDeck(missedOnly = false) {
  fcFlipped = false;
  fcCorrect = 0;
  fcMissed  = [];

  const catVal = document.getElementById('fcCatSelect').value;
  let pool = catVal === 'all' ? [...formulas] : formulas.filter(f => f.category === catVal);

  if (missedOnly && fcMissedSet && fcMissedSet.length > 0) {
    pool = pool.filter(f => fcMissedSet.includes(f.id));
  }

  fcDeck  = pool.sort(() => Math.random() - .5);
  fcIndex = 0;

  document.getElementById('fcDone').classList.add('hidden');
  document.getElementById('fcCardWrap').style.display = '';
  document.querySelector('.fc-nav').style.display      = '';
  document.querySelector('.fc-self-grade').style.display = '';

  showCard();
}

function showCard() {
  fcFlipped = false;
  document.getElementById('fcCard').classList.remove('flipped');
  document.getElementById('fcSelfGrade').classList.add('hidden');

  if (fcDeck.length === 0) {
    document.getElementById('fcTitle').textContent    = 'No formulas yet — add some first!';
    document.getElementById('fcCounter').textContent  = '0 / 0';
    document.getElementById('progressFill').style.width = '0%';
    return;
  }

  if (fcIndex >= fcDeck.length) { showDone(); return; }

  const f = fcDeck[fcIndex];

  // Front
  document.getElementById('fcTitle').textContent = f.title;

  // Back — set raw LaTeX then typeset after a frame so DOM is ready
  const formulaEl = document.getElementById('fcFormula');
  const descEl    = document.getElementById('fcDesc');

  formulaEl.innerHTML = wrapMath(f.formula);
  descEl.textContent  = f.desc || '';

  // Progress bar
  document.getElementById('fcCounter').textContent   = `${fcIndex + 1} / ${fcDeck.length}`;
  document.getElementById('progressFill').style.width = `${((fcIndex + 1) / fcDeck.length) * 100}%`;

  // Typeset immediately (back face is in DOM even while rotated)
  typesetEl(formulaEl);
}

function flipCard() {
  if (fcDeck.length === 0) return;
  fcFlipped = !fcFlipped;
  document.getElementById('fcCard').classList.toggle('flipped', fcFlipped);

  if (fcFlipped) {
    document.getElementById('fcSelfGrade').classList.remove('hidden');
    // Re-typeset after the flip animation finishes (450 ms) to fix any
    // sizing glitches that happen while the element was facing away
    setTimeout(() => {
      typesetEl(document.getElementById('fcFormula'));
    }, 460);
  } else {
    document.getElementById('fcSelfGrade').classList.add('hidden');
  }
}

function nextCard() {
  if (fcIndex < fcDeck.length - 1) { fcIndex++; showCard(); }
  else showDone();
}

function prevCard() {
  if (fcIndex > 0) { fcIndex--; showCard(); }
}

function gradeCard(correct) {
  if (correct) fcCorrect++;
  else fcMissed.push(fcDeck[fcIndex].id);
  nextCard();
}

function showDone() {
  fcMissedSet = fcMissed.slice();
  document.getElementById('fcCardWrap').style.display     = 'none';
  document.querySelector('.fc-nav').style.display         = 'none';
  document.querySelector('.fc-self-grade').style.display  = 'none';

  const total = fcDeck.length;
  const pct   = total > 0 ? Math.round((fcCorrect / total) * 100) : 0;
  document.getElementById('fcScore').textContent = `You got ${fcCorrect} / ${total} correct (${pct}%)`;

  const missedBtn = document.querySelector('.fc-done .btn-accent');
  if (missedBtn) missedBtn.style.display = fcMissed.length > 0 ? '' : 'none';

  document.getElementById('fcDone').classList.remove('hidden');
}

// ── Close modals on overlay click ────────────────────────────
document.addEventListener('click', e => {
  if (e.target.id === 'formulaModal')   closeModal();
  if (e.target.id === 'flashcardModal') closeFlashcards();
});

// ── Keyboard shortcuts ────────────────────────────────────────
document.addEventListener('keydown', e => {
  const fcOpen = !document.getElementById('flashcardModal').classList.contains('hidden');
  if (fcOpen) {
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft')  prevCard();
    if (e.key === ' ')          { e.preventDefault(); flipCard(); }
    if (e.key === 'Escape')     closeFlashcards();
  } else {
    if (e.key === 'Escape') closeModal();
  }
});
