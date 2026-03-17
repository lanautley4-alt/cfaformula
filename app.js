/* ============================================================
   CFA Formula Board — App Logic
   ============================================================ */

// ── CFA exam categories ───────────────────────────────────────
const CFA_CATEGORIES = [
  'Ethical and Professional Standards',
  'Quantitative Methods',
  'Economics',
  'Financial Statement Analysis',
  'Corporate Issuers',
  'Equity Investments',
  'Fixed Income',
  'Derivatives',
  'Alternative Investments',
  'Portfolio Management & Wealth Planning',
];

// ── Storage helpers ───────────────────────────────────────────
const STORAGE_KEY = 'cfa_formulas_v2';
const DRAFT_KEY   = 'cfa_formula_draft';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveDraft() {
  if (editingId) return; // only draft new cards
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    title:    document.getElementById('fTitle').value,
    category: document.getElementById('fCategory').value,
    custom:   document.getElementById('fCategoryCustom').value,
    formula:  document.getElementById('fFormula').value,
    desc:     document.getElementById('fDesc').value,
  }));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
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
  // CFA order first, then any custom ones the user has added
  const custom = [...new Set(formulas.map(f => f.category).filter(Boolean))]
    .filter(c => !CFA_CATEGORIES.includes(c))
    .sort();
  return [...CFA_CATEGORIES.filter(c => formulas.some(f => f.category === c)), ...custom];
}

function getActive() {
  return activeFilter === 'all'
    ? formulas
    : formulas.filter(f => f.category === activeFilter);
}

// ── Escape HTML ───────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
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

  // Keep CFA order for columns
  const sortedCats = Object.keys(groups).sort((a, b) => {
    const ai = CFA_CATEGORIES.indexOf(a);
    const bi = CFA_CATEGORIES.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  board.innerHTML = sortedCats.map(cat => `
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

  renderFilters();
}

function renderLines(text) {
  return text.split('\n').map(line => renderMath(line)).join('<br>');
}

function cardHTML(f) {
  return `
    <div class="formula-card" id="card-${f.id}" data-id="${f.id}" onclick="toggleCard(this)">
      <div class="card-title">${esc(f.title)}<span class="card-chevron">›</span></div>
      <div class="card-body">
        ${f.formula ? `<div class="card-formula">${renderLines(f.formula)}</div>` : ''}
        ${f.desc ? `<div class="card-desc">${f.desc.split('\n').map(esc).join('<br>')}</div>` : ''}
        <div class="card-actions">
          <button class="btn btn-ghost" onclick="editFormula('${f.id}'); event.stopPropagation()">Edit</button>
          <button class="btn btn-danger" onclick="deleteFormula('${f.id}'); event.stopPropagation()">Delete</button>
        </div>
      </div>
    </div>`;
}

function toggleCard(el) {
  el.classList.toggle('expanded');
}


// ── Filters ───────────────────────────────────────────────────
function renderFilters() {
  const wrap = document.getElementById('categoryFilters');
  const cats = categories();
  const allBtn = `<button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">All</button>`;
  const catBtns = cats.map(c =>
    `<button class="filter-btn ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${esc(c)}')">${esc(c)}</button>`
  ).join('');
  wrap.innerHTML = allBtn + catBtns;
}

function setFilter(cat) {
  activeFilter = cat;
  renderBoard();
}

// ── Category dropdown ─────────────────────────────────────────
function onCatSelectChange() {
  const sel    = document.getElementById('fCategory');
  const custom = document.getElementById('fCategoryCustom');
  if (sel.value === '__custom__') {
    custom.classList.remove('hidden');
    custom.focus();
  } else {
    custom.classList.add('hidden');
  }
}

function getCategoryValue() {
  const sel = document.getElementById('fCategory');
  if (sel.value === '__custom__') {
    return document.getElementById('fCategoryCustom').value.trim();
  }
  return sel.value;
}

function setCategorySelect(value) {
  const sel = document.getElementById('fCategory');
  const custom = document.getElementById('fCategoryCustom');
  // Check if value is one of the standard options
  const opt = [...sel.options].find(o => o.value === value || o.text === value);
  if (opt) {
    sel.value = opt.value || opt.text;
    custom.classList.add('hidden');
  } else if (value) {
    // Custom category — add it as an option if not there and select __custom__
    sel.value = '__custom__';
    custom.classList.remove('hidden');
    custom.value = value;
  }
}

// ── Add / Edit Modal ──────────────────────────────────────────
let previewTimer = null;

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'New Formula';
  const draft = (() => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch { return {}; } })();
  document.getElementById('fTitle').value    = draft.title    || '';
  document.getElementById('fCategory').value = draft.category || '';
  document.getElementById('fCategoryCustom').value = draft.custom || '';
  document.getElementById('fCategoryCustom').classList.toggle('hidden', !draft.custom);
  document.getElementById('fFormula').value  = draft.formula  || '';
  document.getElementById('fDesc').value     = draft.desc     || '';
  document.getElementById('previewContent').innerHTML = draft.formula ? renderLines(draft.formula) : '';
  document.getElementById('formulaModal').classList.remove('hidden');
  document.getElementById('fTitle').focus();
}

function editFormula(id) {
  const f = formulas.find(x => x.id === id);
  if (!f) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Formula';
  document.getElementById('fTitle').value   = f.title;
  document.getElementById('fFormula').value = f.formula;
  document.getElementById('fDesc').value    = f.desc || '';
  setCategorySelect(f.category);
  document.getElementById('formulaModal').classList.remove('hidden');
  updatePreview();
}

function closeModal() {
  document.getElementById('formulaModal').classList.add('hidden');
  editingId = null;
}

function saveFormula() {
  const title    = document.getElementById('fTitle').value.trim();
  const category = getCategoryValue();
  const formula  = document.getElementById('fFormula').value.trim();
  const desc     = document.getElementById('fDesc').value.trim();

  if (!title)           { alert('Please enter a title.'); return; }
  if (!category)        { alert('Please select a category.'); return; }
  if (!formula && !desc){ alert('Please enter a formula or description.'); return; }

  if (editingId) {
    const idx = formulas.findIndex(f => f.id === editingId);
    if (idx !== -1) formulas[idx] = { id: editingId, title, category, formula, desc };
  } else {
    formulas.push({ id: uid(), title, category, formula, desc });
  }

  save(formulas);
  clearDraft();
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
    el.innerHTML = renderLines(raw);
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fFormula').addEventListener('input', updatePreview);
  ['fTitle', 'fCategory', 'fCategoryCustom', 'fFormula', 'fDesc'].forEach(id => {
    document.getElementById(id).addEventListener('input', saveDraft);
  });
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
  document.getElementById('fcCardWrap').style.display     = '';
  document.querySelector('.fc-nav').style.display         = '';
  document.getElementById('fcSelfGrade').classList.add('hidden');

  showCard();
}

function showCard() {
  // Reset to front
  fcFlipped = false;
  document.getElementById('fcFront').classList.remove('fc-hidden');
  document.getElementById('fcBack').classList.add('fc-hidden');
  document.getElementById('fcSelfGrade').classList.add('hidden');
  document.getElementById('btnFlip').textContent = 'Flip';

  if (fcDeck.length === 0) {
    document.getElementById('fcTitle').textContent     = 'No formulas yet — add some first!';
    document.getElementById('fcCounter').textContent   = '0 / 0';
    document.getElementById('progressFill').style.width = '0%';
    return;
  }

  if (fcIndex >= fcDeck.length) { showDone(); return; }

  const f = fcDeck[fcIndex];

  // Front
  document.getElementById('fcTitle').textContent = f.title;

  // Back — if no formula, show desc as main content
  const formulaEl = document.getElementById('fcFormula');
  if (f.formula) {
    formulaEl.innerHTML = renderLines(f.formula);
    document.getElementById('fcDesc').innerHTML = (f.desc || '').split('\n').map(esc).join('<br>');
  } else {
    formulaEl.innerHTML = '';
    document.getElementById('fcDesc').innerHTML = (f.desc || '').split('\n').map(esc).join('<br>');
  }

  // Progress
  document.getElementById('fcCounter').textContent    = `${fcIndex + 1} / ${fcDeck.length}`;
  document.getElementById('progressFill').style.width = `${((fcIndex + 1) / fcDeck.length) * 100}%`;
}

function flipCard() {
  if (fcDeck.length === 0) return;
  fcFlipped = !fcFlipped;

  if (fcFlipped) {
    document.getElementById('fcFront').classList.add('fc-hidden');
    document.getElementById('fcBack').classList.remove('fc-hidden');
    document.getElementById('fcSelfGrade').classList.remove('hidden');
    document.getElementById('btnFlip').textContent = 'Unflip';
  } else {
    document.getElementById('fcFront').classList.remove('fc-hidden');
    document.getElementById('fcBack').classList.add('fc-hidden');
    document.getElementById('fcSelfGrade').classList.add('hidden');
    document.getElementById('btnFlip').textContent = 'Flip';
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
  document.getElementById('fcCardWrap').style.display   = 'none';
  document.querySelector('.fc-nav').style.display       = 'none';
  document.getElementById('fcSelfGrade').classList.add('hidden');

  const total = fcDeck.length;
  const pct   = total > 0 ? Math.round((fcCorrect / total) * 100) : 0;
  document.getElementById('fcScore').textContent = `You got ${fcCorrect} / ${total} correct (${pct}%)`;

  const missedBtn = document.querySelector('.fc-done .btn-accent');
  if (missedBtn) missedBtn.style.display = fcMissed.length > 0 ? '' : 'none';

  document.getElementById('fcDone').classList.remove('hidden');
}

// ── Help modal (sync / export / import) ──────────────────────
function openHelpModal() {
  document.getElementById('helpModal').classList.remove('hidden');
}
function closeHelpModal() {
  document.getElementById('helpModal').classList.add('hidden');
}

// ── LaTeX Reference Modal ─────────────────────────────────────
function openRefModal() {
  const modal = document.getElementById('refModal');
  modal.classList.remove('hidden');
  modal.querySelectorAll('.ref-preview').forEach(cell => {
    if (!cell.dataset.rendered) {
      const code = cell.closest('tr').querySelector('code').textContent;
      cell.innerHTML = renderMath(code);
      cell.dataset.rendered = '1';
    }
  });
}
function closeRefModal() {
  document.getElementById('refModal').classList.add('hidden');
}

// ── Export ────────────────────────────────────────────────────
function exportFormulas() {
  const data = JSON.stringify(formulas, null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `cfa-formulas-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import ────────────────────────────────────────────────────
function importFormulas(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('Invalid format');
      const merge = confirm(
        `Found ${imported.length} formula(s).\n\nMerge with your existing ${formulas.length}? (OK = merge, Cancel = replace all)`
      );
      if (merge) {
        const existingIds = new Set(formulas.map(f => f.id));
        const newOnes = imported.filter(f => !existingIds.has(f.id));
        formulas = [...formulas, ...newOnes];
        alert(`Added ${newOnes.length} new formula(s). ${imported.length - newOnes.length} duplicate(s) skipped.`);
      } else {
        formulas = imported;
        alert(`Replaced board with ${formulas.length} formula(s).`);
      }
      save(formulas);
      renderBoard();
    } catch(err) {
      alert('Could not read file. Make sure it\'s a valid CFA Formulas export (.json).');
    }
    evt.target.value = '';
  };
  reader.readAsText(file);
}

// ── Close modals on overlay click ────────────────────────────
document.addEventListener('click', e => {
  if (e.target.id === 'formulaModal')   closeModal();
  if (e.target.id === 'flashcardModal') closeFlashcards();
  if (e.target.id === 'refModal')       closeRefModal();
  if (e.target.id === 'helpModal')      closeHelpModal();
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
    if (e.key === 'Escape') { closeModal(); closeRefModal(); closeHelpModal(); }
  }
});
