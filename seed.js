/* Run this once in the browser console to seed sample CFA formulas */
/* Or open seed.html to auto-seed */

const SEED_FORMULAS = [
  // ── Quantitative Methods ──────────────────────────────────────
  {
    title: 'Future Value (Single CF)',
    category: 'Quantitative Methods',
    formula: '$$FV = PV \\cdot (1+r)^{n}$$',
    desc: 'PV = present value, r = interest rate per period, n = number of periods'
  },
  {
    title: 'Present Value (Single CF)',
    category: 'Quantitative Methods',
    formula: '$$PV = \\frac{FV}{(1+r)^{n}}$$',
    desc: 'Discounts a future cash flow back to today'
  },
  {
    title: 'Annuity — Present Value',
    category: 'Quantitative Methods',
    formula: '$$PV = PMT \\cdot \\frac{1 - (1+r)^{-n}}{r}$$',
    desc: 'PMT = periodic payment, r = rate per period, n = periods'
  },
  {
    title: 'Effective Annual Rate',
    category: 'Quantitative Methods',
    formula: '$$EAR = \\left(1 + \\frac{r_s}{m}\\right)^{m} - 1$$',
    desc: 'r_s = stated annual rate, m = compounding periods per year'
  },
  {
    title: 'Continuously Compounded EAR',
    category: 'Quantitative Methods',
    formula: '$$EAR = e^{r_s} - 1$$',
    desc: 'Limit of compounding as m → ∞'
  },
  {
    title: 'Holding Period Return',
    category: 'Quantitative Methods',
    formula: '$$HPR = \\frac{P_1 - P_0 + D_1}{P_0}$$',
    desc: 'P0 = beginning price, P1 = ending price, D1 = dividend/income'
  },
  {
    title: 'Geometric Mean Return',
    category: 'Quantitative Methods',
    formula: '$$\\bar{R}_G = \\left(\\prod_{t=1}^{n}(1+R_t)\\right)^{1/n} - 1$$',
    desc: 'Best measure of compound growth over time'
  },
  {
    title: 'Variance (Population)',
    category: 'Quantitative Methods',
    formula: '$$\\sigma^2 = \\frac{\\sum_{i=1}^{N}(X_i - \\mu)^2}{N}$$',
    desc: 'Average squared deviation from the mean'
  },
  {
    title: 'Coefficient of Variation',
    category: 'Quantitative Methods',
    formula: '$$CV = \\frac{\\sigma}{\\bar{X}}$$',
    desc: 'Relative measure of dispersion; lower is better risk/return'
  },

  // ── Equity ────────────────────────────────────────────────────
  {
    title: 'Gordon Growth Model (GGM)',
    category: 'Equity',
    formula: '$$V_0 = \\frac{D_1}{r - g}$$',
    desc: 'D1 = next dividend, r = required return, g = constant growth rate. Requires r > g.'
  },
  {
    title: 'P/E Ratio (Justified)',
    category: 'Equity',
    formula: '$$\\frac{P_0}{E_1} = \\frac{b}{r - g}$$',
    desc: 'b = dividend payout ratio (1 − retention ratio)'
  },
  {
    title: 'Dividend Discount Model (Multi-stage)',
    category: 'Equity',
    formula: '$$V_0 = \\sum_{t=1}^{T}\\frac{D_t}{(1+r)^t} + \\frac{P_T}{(1+r)^T}$$',
    desc: 'PT = terminal price at end of high-growth stage'
  },
  {
    title: 'Free Cash Flow to Equity',
    category: 'Equity',
    formula: '$$FCFE = NI - (1-DR)\\cdot(FCInv - Dep) - (1-DR)\\cdot\\Delta WC$$',
    desc: 'DR = debt ratio; FCInv = capex; Dep = depreciation; ΔWC = working capital change'
  },
  {
    title: 'EV / EBITDA',
    category: 'Equity',
    formula: '$$EV = \\text{Market Cap} + \\text{Debt} - \\text{Cash}$$',
    desc: 'Enterprise Value; used with EBITDA as a capital-structure-neutral multiple'
  },

  // ── Fixed Income ──────────────────────────────────────────────
  {
    title: 'Bond Price',
    category: 'Fixed Income',
    formula: '$$P = \\sum_{t=1}^{N}\\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^N}$$',
    desc: 'C = coupon, r = yield per period, N = periods, FV = face value'
  },
  {
    title: 'Modified Duration',
    category: 'Fixed Income',
    formula: '$$MD = \\frac{MacDur}{1 + \\frac{y}{m}}$$',
    desc: 'MacDur = Macaulay duration, y = YTM, m = periods per year'
  },
  {
    title: 'Price Change (Duration)',
    category: 'Fixed Income',
    formula: '$$\\Delta P \\approx -MD \\cdot \\Delta y \\cdot P$$',
    desc: 'First-order approximation of bond price change for small yield moves'
  },
  {
    title: 'Convexity Adjustment',
    category: 'Fixed Income',
    formula: '$$\\Delta P \\approx -MD\\cdot\\Delta y\\cdot P + \\tfrac{1}{2}\\cdot C_{\\text{vex}}\\cdot(\\Delta y)^2\\cdot P$$',
    desc: 'Adds second-order accuracy for larger yield changes'
  },
  {
    title: 'Forward Rate',
    category: 'Fixed Income',
    formula: '$$(1+z_B)^B = (1+z_A)^A \\cdot (1+{}_{A}f_{B-A})^{B-A}$$',
    desc: 'Bootstrapped forward rate from spot (zero) rates zA and zB'
  },

  // ── Derivatives ───────────────────────────────────────────────
  {
    title: 'Put-Call Parity',
    category: 'Derivatives',
    formula: '$$c + \\frac{X}{(1+r)^T} = p + S_0$$',
    desc: 'c = call, p = put, X = strike, S0 = spot, r = risk-free, T = time to expiry'
  },
  {
    title: 'Black-Scholes Call',
    category: 'Derivatives',
    formula: '$$c = S_0 N(d_1) - X e^{-rT} N(d_2)$$',
    desc: 'd1 and d2 involve ln(S/X), r, σ, T; N() = standard normal CDF'
  },
  {
    title: 'Option Delta',
    category: 'Derivatives',
    formula: '$$\\Delta = \\frac{\\partial V}{\\partial S}$$',
    desc: 'Rate of change of option value with respect to underlying price'
  },

  // ── Portfolio Management ──────────────────────────────────────
  {
    title: 'Sharpe Ratio',
    category: 'Portfolio Management',
    formula: '$$SR = \\frac{R_p - R_f}{\\sigma_p}$$',
    desc: 'Rp = portfolio return, Rf = risk-free rate, σp = portfolio std deviation'
  },
  {
    title: 'Treynor Ratio',
    category: 'Portfolio Management',
    formula: '$$T = \\frac{R_p - R_f}{\\beta_p}$$',
    desc: 'Uses systematic risk (beta) instead of total risk'
  },
  {
    title: "Jensen's Alpha",
    category: 'Portfolio Management',
    formula: '$$\\alpha = R_p - \\left[R_f + \\beta_p(R_m - R_f)\\right]$$',
    desc: 'Excess return above CAPM-predicted return'
  },
  {
    title: 'CAPM',
    category: 'Portfolio Management',
    formula: '$$E(R_i) = R_f + \\beta_i \\left[E(R_m) - R_f\\right]$$',
    desc: 'β = systematic risk; [E(Rm)−Rf] = equity risk premium'
  },
  {
    title: 'Portfolio Variance (2 assets)',
    category: 'Portfolio Management',
    formula: '$$\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1 w_2 \\sigma_1\\sigma_2\\rho_{12}$$',
    desc: 'ρ12 = correlation between asset 1 and asset 2'
  },

  // ── Financial Reporting ───────────────────────────────────────
  {
    title: 'Current Ratio',
    category: 'Financial Reporting',
    formula: '$$\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}$$',
    desc: 'Measures short-term liquidity; > 1 means current assets exceed liabilities'
  },
  {
    title: 'Quick Ratio',
    category: 'Financial Reporting',
    formula: '$$\\text{Quick Ratio} = \\frac{\\text{Cash} + \\text{Marketable Securities} + \\text{Receivables}}{\\text{Current Liabilities}}$$',
    desc: 'Excludes inventory from numerator — more conservative than current ratio'
  },
  {
    title: 'Return on Equity (DuPont)',
    category: 'Financial Reporting',
    formula: '$$ROE = \\underbrace{\\frac{NI}{S}}_{\\text{Net Margin}} \\times \\underbrace{\\frac{S}{A}}_{\\text{Asset TO}} \\times \\underbrace{\\frac{A}{E}}_{\\text{Leverage}}$$',
    desc: 'Three-factor DuPont decomposition'
  },
];

(function seedIfEmpty() {
  const key = 'cfa_formulas_v1';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  if (existing.length === 0) {
    const seeded = SEED_FORMULAS.map((f, i) => ({
      id: Date.now().toString(36) + i,
      ...f
    }));
    localStorage.setItem(key, JSON.stringify(seeded));
    console.log('Seeded', seeded.length, 'sample CFA formulas.');
  }
})();
