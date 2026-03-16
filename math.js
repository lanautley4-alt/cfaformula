/* ============================================================
   math.js  —  Lightweight LaTeX → HTML renderer
   No external dependencies. Handles common CFA formula patterns:
   fractions, superscripts, subscripts, Greek letters, roots,
   sum/prod/int with limits, accents, and common symbols.
   ============================================================ */
(function () {
'use strict';

// ── Symbol tables ─────────────────────────────────────────────
const GREEK = {
  alpha:'α', beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', varepsilon:'ε',
  zeta:'ζ', eta:'η', theta:'θ', vartheta:'ϑ', iota:'ι', kappa:'κ',
  lambda:'λ', mu:'μ', nu:'ν', xi:'ξ', pi:'π', varpi:'ϖ',
  rho:'ρ', varrho:'ϱ', sigma:'σ', varsigma:'ς', tau:'τ',
  upsilon:'υ', phi:'φ', varphi:'φ', chi:'χ', psi:'ψ', omega:'ω',
  Alpha:'Α', Beta:'Β', Gamma:'Γ', Delta:'Δ', Epsilon:'Ε', Zeta:'Ζ',
  Eta:'Η', Theta:'Θ', Iota:'Ι', Kappa:'Κ', Lambda:'Λ', Mu:'Μ',
  Nu:'Ν', Xi:'Ξ', Pi:'Π', Rho:'Ρ', Sigma:'Σ', Tau:'Τ',
  Upsilon:'Υ', Phi:'Φ', Chi:'Χ', Psi:'Ψ', Omega:'Ω',
  partial:'∂', nabla:'∇', hbar:'ℏ', ell:'ℓ',
};

const SYMS = {
  times:'×', pm:'±', mp:'∓', div:'÷', cdot:'·', ast:'∗',
  approx:'≈', sim:'∼', simeq:'≃', cong:'≅', equiv:'≡', propto:'∝',
  leq:'≤', geq:'≥', neq:'≠', ll:'≪', gg:'≫',
  subset:'⊂', supset:'⊃', subseteq:'⊆', supseteq:'⊇',
  in:'∈', notin:'∉', cup:'∪', cap:'∩',
  to:'→', rightarrow:'→', leftarrow:'←', Rightarrow:'⇒', Leftarrow:'⇐',
  leftrightarrow:'↔', uparrow:'↑', downarrow:'↓',
  infty:'∞', ldots:'…', cdots:'⋯', forall:'∀', exists:'∃',
  lfloor:'⌊', rfloor:'⌋', lceil:'⌈', rceil:'⌉',
  langle:'⟨', rangle:'⟩',
  // spacing (return non-breaking space or thin space)
  quad:'\u2002', qquad:'\u2003', ',':'\u200a', ';':'\u2009', '!':'', ' ':'',
};

const LARGE_OPS = {
  sum:'∑', prod:'∏', int:'∫', oint:'∮',
  bigcup:'⋃', bigcap:'⋂', bigvee:'⋁', bigwedge:'⋀',
  lim:'lim', max:'max', min:'min', sup:'sup', inf:'inf',
  limsup:'lim sup', liminf:'lim inf',
};

const FUNC_NAMES = new Set([
  'sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan',
  'sinh','cosh','tanh','ln','log','exp','det','dim','ker','rank',
  'Pr','E','Var','Cov','Corr',
]);

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Tokenizer ─────────────────────────────────────────────────
const TEXT_CMDS = ['text','mathrm','textrm','textbf','mathbf','textit','mathit','operatorname'];

function tokenize(src) {
  const toks = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      i++;
      if (i >= src.length) break;
      if (src[i] === '\\') { toks.push({t:'newline'}); i++; continue; }
      if (!/[a-zA-Z]/.test(src[i])) { toks.push({t:'sym', v:src[i]}); i++; continue; }
      let name = '';
      while (i < src.length && /[a-zA-Z]/.test(src[i])) { name += src[i++]; }
      // Text commands: read braced content raw so spaces are preserved
      if (TEXT_CMDS.includes(name)) {
        while (i < src.length && src[i] === ' ') i++;
        if (src[i] === '{') {
          i++;
          let raw = '', depth = 1;
          while (i < src.length) {
            if      (src[i] === '{') { depth++; raw += src[i++]; }
            else if (src[i] === '}') { depth--; if (depth === 0) { i++; break; } raw += src[i++]; }
            else                     { raw += src[i++]; }
          }
          toks.push({t:'textraw', cmd:name, v:raw});
        } else {
          toks.push({t:'cmd', v:name});
        }
        continue;
      }
      toks.push({t:'cmd', v:name});
    } else if (c === '{') { toks.push({t:'lb'}); i++; }
    else if (c === '}')   { toks.push({t:'rb'}); i++; }
    else if (c === '^')   { toks.push({t:'hat'}); i++; }
    else if (c === '_')   { toks.push({t:'und'}); i++; }
    else if (c === '&' || c === '\n' || c === '\r') { i++; }
    else if (c === ' ' || c === '\t') { i++; }
    else { toks.push({t:'ch', v:c}); i++; }
  }
  return toks;
}

// ── Parser ────────────────────────────────────────────────────
let T, P;

function peek()  { return T[P]; }
function eat(t)  { if (T[P]?.t === t) P++; }

function parseBraced() {
  // reads {content} or a single atom
  if (T[P]?.t === 'lb') {
    P++; // eat {
    const ch = [];
    while (P < T.length && T[P]?.t !== 'rb') ch.push(...parseExpr());
    eat('rb');
    return {t:'grp', ch};
  }
  const a = parseAtom();
  return {t:'grp', ch: a ? [a] : []};
}

function parseAtom() {
  if (P >= T.length) return null;
  const tok = T[P];

  if (tok.t === 'rb' || tok.t === 'hat' || tok.t === 'und') return null;

  if (tok.t === 'ch')      { P++; return {t:'ch', v:tok.v}; }
  if (tok.t === 'sym')     { P++; return {t:'sym', v:tok.v}; }
  if (tok.t === 'newline') { P++; return {t:'br'}; }
  if (tok.t === 'textraw') { P++; return {t:'txtraw', cmd:tok.cmd, v:tok.v}; }

  if (tok.t === 'lb') {
    P++; // eat {
    const ch = [];
    while (P < T.length && T[P]?.t !== 'rb') ch.push(...parseExpr());
    eat('rb');
    return {t:'grp', ch};
  }

  if (tok.t === 'cmd') {
    P++;
    const n = tok.v;

    if (n === 'frac') {
      const num = parseBraced();
      const den = parseBraced();
      return {t:'frac', num, den};
    }
    if (n === 'sqrt') {
      // optional [n] — skip if present
      if (T[P]?.t === 'ch' && T[P]?.v === '[') {
        while (P < T.length && !(T[P]?.t === 'ch' && T[P]?.v === ']')) P++;
        eat('ch');
      }
      return {t:'sqrt', cont:parseBraced()};
    }
    if (['bar','hat','vec','dot','ddot','tilde','overline','underline','widehat','widetilde'].includes(n)) {
      return {t:'acc', cmd:n, cont:parseBraced()};
    }
    if (['text','mathrm','textrm','textbf','mathbf','textit','mathit','mathbb','mathcal','operatorname'].includes(n)) {
      return {t:'txt', cmd:n, cont:parseBraced()};
    }
    if (n === 'underbrace' || n === 'overbrace') {
      return {t:'brace', cmd:n, cont:parseBraced()};
    }
    if (n === 'left') {
      // consume delimiter character
      let d = '';
      const dt = T[P];
      if (dt) {
        if (dt.t === 'ch') { d = dt.v; P++; }
        else if (dt.t === 'sym') { d = dt.v; P++; }
        else if (dt.t === 'cmd') {
          d = ({lfloor:'⌊',rfloor:'⌋',lceil:'⌈',rceil:'⌉',langle:'⟨',rangle:'⟩'})[dt.v] || '';
          P++;
        }
      }
      return {t:'delim', side:'l', v: d === '.' ? '' : esc(d)};
    }
    if (n === 'right') {
      let d = '';
      const dt = T[P];
      if (dt) {
        if (dt.t === 'ch') { d = dt.v; P++; }
        else if (dt.t === 'sym') { d = dt.v; P++; }
        else if (dt.t === 'cmd') {
          d = ({lfloor:'⌊',rfloor:'⌋',lceil:'⌈',rceil:'⌉',langle:'⟨',rangle:'⟩'})[dt.v] || '';
          P++;
        }
      }
      return {t:'delim', side:'r', v: d === '.' ? '' : esc(d)};
    }
    if (n === 'begin' || n === 'end') { parseBraced(); return null; }
    if (n === 'nonumber' || n === 'notag') return null;
    return {t:'cmd', v:n};
  }
  // fallthrough — skip unknown token
  P++;
  return null;
}

function parseExpr() {
  const results = [];
  while (P < T.length) {
    const tok = T[P];
    if (tok.t === 'rb') break; // end of group
    const prev = P;
    let base = parseAtom();
    if (base === null) { if (P === prev) P++; break; } // safety

    // collect ^ and _ for this base
    let sup = null, sub = null;
    while (P < T.length && (T[P]?.t === 'hat' || T[P]?.t === 'und')) {
      const tt = T[P].t; P++;
      if (tt === 'hat') sup = parseBraced();
      else              sub = parseBraced();
    }
    if (sup !== null || sub !== null) {
      results.push({t:'ss', base, sup, sub});
    } else {
      results.push(base);
    }
  }
  return results;
}

function parse(src) {
  // Strip math delimiters
  src = src.replace(/^\s*\$\$\s*|\s*\$\$\s*$/g, '')
           .replace(/^\s*\$|\$\s*$/g, '')
           .replace(/^\s*\\\[|\\\]\s*$/g, '')
           .replace(/^\s*\\\(|\\\)\s*$/g, '')
           .trim();
  T = tokenize(src);
  P = 0;
  const nodes = [];
  while (P < T.length) nodes.push(...parseExpr());
  return nodes;
}

// ── Renderer ──────────────────────────────────────────────────
function rNodes(ns) { return ns.map(rNode).join(''); }

function rNode(n) {
  if (!n) return '';
  switch (n.t) {

    case 'ch': {
      const v = esc(n.v);
      return /[a-zA-Z]/.test(n.v) ? `<i>${v}</i>` : v;
    }

    case 'sym': {
      const s = SYMS[n.v];
      return s !== undefined ? s : esc(n.v);
    }

    case 'br': return '<br>';

    case 'grp': return rNodes(n.ch);

    case 'frac': {
      const num = rNodes(n.num.ch || [n.num]);
      const den = rNodes(n.den.ch || [n.den]);
      return `<span class="mfrac"><span class="mnum">${num}</span><span class="mden">${den}</span></span>`;
    }

    case 'sqrt': {
      const c = rNodes(n.cont.ch || [n.cont]);
      return `<span class="msqrt"><span class="msqrt-rad">√</span><span class="msqrt-body">${c}</span></span>`;
    }

    case 'ss': {
      const isLarge = n.base.t === 'cmd' && LARGE_OPS[n.base.v];
      if (isLarge) {
        const op  = `<span class="mlop-sym">${LARGE_OPS[n.base.v]}</span>`;
        const sup = n.sup ? `<span class="mlop-sup">${rNode(n.sup)}</span>` : '';
        const sub = n.sub ? `<span class="mlop-sub">${rNode(n.sub)}</span>` : '';
        return `<span class="mlop">${sup}${op}${sub}</span>`;
      }
      let h = `<span class="matom">${rNode(n.base)}`;
      // stack sup and sub together when both present
      if (n.sup && n.sub) {
        h += `<span class="msupsub"><sup>${rNode(n.sup)}</sup><sub>${rNode(n.sub)}</sub></span>`;
      } else if (n.sup) {
        h += `<sup class="msup">${rNode(n.sup)}</sup>`;
      } else if (n.sub) {
        h += `<sub class="msub">${rNode(n.sub)}</sub>`;
      }
      h += `</span>`;
      return h;
    }

    case 'acc': {
      const c = rNodes(n.cont.ch || [n.cont]);
      if (n.cmd === 'overline' || n.cmd === 'bar')       return `<span class="mover">${c}</span>`;
      if (n.cmd === 'underline')                         return `<span class="munder">${c}</span>`;
      if (n.cmd === 'hat' || n.cmd === 'widehat')        return `<span class="mhat">${c}</span>`;
      if (n.cmd === 'tilde' || n.cmd === 'widetilde')    return `<span class="mtilde">${c}</span>`;
      if (n.cmd === 'vec')                               return `<span class="mvec">${c}</span>`;
      if (n.cmd === 'dot')                               return `<span class="mdot">${c}</span>`;
      return c;
    }

    case 'brace': {
      const c = rNodes(n.cont.ch || [n.cont]);
      return n.cmd === 'underbrace'
        ? `<span class="munderbrace">${c}</span>`
        : `<span class="moverbrace">${c}</span>`;
    }

    case 'txtraw': {
      const v = esc(n.v);
      if (n.cmd === 'textbf' || n.cmd === 'mathbf') return `<b class="mtext">${v}</b>`;
      if (n.cmd === 'textit' || n.cmd === 'mathit') return `<i class="mtext">${v}</i>`;
      return `<span class="mtext">${v}</span>`;
    }

    case 'txt': {
      const c = rNodes(n.cont.ch || [n.cont]);
      if (n.cmd === 'textbf' || n.cmd === 'mathbf') return `<b>${c}</b>`;
      if (n.cmd === 'textit' || n.cmd === 'mathit') return `<i>${c}</i>`;
      return `<span class="mtext">${c}</span>`;
    }

    case 'delim':
      return n.v ? `<span class="mdelim">${n.v}</span>` : '';

    case 'cmd': {
      const v = n.v;
      if (GREEK[v])            return `<i>${GREEK[v]}</i>`;
      if (SYMS[v] !== undefined) return SYMS[v];
      if (LARGE_OPS[v])        return `<span class="mlop-sym">${LARGE_OPS[v]}</span>`;
      if (FUNC_NAMES.has(v))   return `<span class="mfunc">${esc(v)}</span>`;
      // fallback: show name as-is
      return `<span class="mfunc">${esc(v)}</span>`;
    }

    default: return '';
  }
}

// ── Public API ────────────────────────────────────────────────
window.renderMath = function (latex) {
  if (!latex) return '';
  try {
    return `<span class="mmath">${rNodes(parse(latex))}</span>`;
  } catch (e) {
    console.warn('renderMath error:', e, latex);
    return `<code class="mraw">${esc(latex)}</code>`;
  }
};

})();
