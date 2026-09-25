export const CURRENCY_SYMBOLS = { USD: '$', BDT: '৳' };

export const fmt = (amount, currency) => {
  const sym = CURRENCY_SYMBOLS[currency] || currency + ' ';
  const n = Number(amount) || 0;
  const formatted = Number.isInteger(n)
    ? n.toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return sym + formatted;
};

export const genId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const todayISO = () => new Date().toISOString().split('T')[0];
