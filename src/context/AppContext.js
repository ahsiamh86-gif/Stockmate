import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '../theme/themes';
import {
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_PURCHASES,
  INITIAL_EXPENSES,
  INITIAL_INVESTORS,
  INITIAL_LOANS,
  INITIAL_LENT_MONEY,
} from '../data/mockData';
import { genId, todayISO } from '../utils/format';

const AppContext = createContext(null);

const STORAGE_KEY = '@stockmate_state_v1';

export function AppProvider({ children }) {
  const [themeName, setThemeName] = useState('dark');
  const [currency, setCurrency] = useState('USD');
  const [locked, setLocked] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [sales, setSales] = useState(MOCK_SALES);
  const [purchases, setPurchases] = useState(MOCK_PURCHASES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [investors, setInvestors] = useState(INITIAL_INVESTORS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [lentMoney, setLentMoney] = useState(INITIAL_LENT_MONEY);

  // Load persisted state once on boot
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.themeName) setThemeName(saved.themeName);
          if (saved.currency) setCurrency(saved.currency);
          if (saved.products) setProducts(saved.products);
          if (saved.sales) setSales(saved.sales);
          if (saved.purchases) setPurchases(saved.purchases);
          if (saved.expenses) setExpenses(saved.expenses);
          if (saved.investors) setInvestors(saved.investors);
          if (saved.loans) setLoans(saved.loans);
          if (saved.lentMoney) setLentMoney(saved.lentMoney);
          if (typeof saved.pinEnabled === 'boolean') setPinEnabled(saved.pinEnabled);
          if (typeof saved.fingerprintEnabled === 'boolean') setFingerprintEnabled(saved.fingerprintEnabled);
        }
      } catch (e) {
        // ignore corrupt storage
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on change (debounced-lite via effect)
  useEffect(() => {
    if (!hydrated) return;
    const state = {
      themeName, currency, products, sales, purchases,
      expenses, investors, loans, lentMoney, pinEnabled, fingerprintEnabled,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [hydrated, themeName, currency, products, sales, purchases, expenses, investors, loans, lentMoney, pinEnabled, fingerprintEnabled]);

  const t = THEMES[themeName] || THEMES.dark;

  // ── Product actions ──────────────────────────────────────────────
  const addProduct = (p) => {
    const qty = Number(p.qty) || 0;
    const minStock = Number(p.minStock) || 0;
    const status = qty === 0 ? 'out_of_stock' : qty < minStock ? 'low_stock' : 'in_stock';
    const id = p.id && p.id.trim() ? p.id.trim() : genId('PRD');
    const product = {
      id,
      name: p.name || 'Unnamed Product',
      brand: p.brand || '',
      category: p.category || 'General',
      qty,
      minStock,
      buyPrice: Number(p.buyPrice) || 0,
      sellPrice: Number(p.sellPrice) || 0,
      supplier: p.supplier || '',
      location: p.location || '',
      purchaseDate: p.purchaseDate || todayISO(),
      status,
    };
    setProducts((prev) => [product, ...prev]);
    if (product.buyPrice && product.qty) {
      setPurchases((prev) => [
        { id: genId('PO'), supplier: product.supplier || 'Unknown', product: product.name, qty: product.qty, cost: product.buyPrice * product.qty, date: product.purchaseDate },
        ...prev,
      ]);
    }
    return product;
  };

  const updateProduct = (id, patch) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const merged = { ...p, ...patch };
      const qty = Number(merged.qty) || 0;
      const minStock = Number(merged.minStock) || 0;
      merged.status = qty === 0 ? 'out_of_stock' : qty < minStock ? 'low_stock' : 'in_stock';
      return merged;
    }));
  };

  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const stockIn = (id, amount) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const qty = p.qty + (Number(amount) || 0);
      const status = qty === 0 ? 'out_of_stock' : qty < p.minStock ? 'low_stock' : 'in_stock';
      return { ...p, qty, status };
    }));
  };

  const recordSale = ({ product, qty, sellPrice }) => {
    const q = Number(qty) || 1;
    const price = Number(sellPrice) || product.sellPrice;
    const total = price * q;
    const profit = (price - product.buyPrice) * q;
    const sale = { id: genId('SL'), date: todayISO(), product: product.name, qty: q, total, profit };
    setSales((prev) => [sale, ...prev]);
    stockIn(product.id, -q);
    return sale;
  };

  // ── Generic list-with-transactions helpers (expenses, investors, loans, lent money) ──
  const addExpense = (e) => {
    const entry = { id: genId('EXP'), title: e.title || 'Expense', category: e.category || 'Other', amount: Number(e.amount) || 0, date: e.date || todayISO(), note: e.note || '' };
    setExpenses((prev) => [entry, ...prev]);
    return entry;
  };
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  const addInvestor = (i) => {
    const entry = {
      id: genId('INV'), name: i.name || 'Investor', phone: i.phone || '', email: i.email || '',
      investAmount: Number(i.investAmount) || 0, date: i.date || todayISO(),
      profitShare: Number(i.profitShare) || 0, status: 'active', note: i.note || '', withdrawals: [],
    };
    setInvestors((prev) => [entry, ...prev]);
    return entry;
  };
  const addInvestorWithdrawal = (investorId, w) => {
    setInvestors((prev) => prev.map((inv) => inv.id === investorId
      ? { ...inv, withdrawals: [{ id: genId('WD'), amount: Number(w.amount) || 0, date: w.date || todayISO(), note: w.note || '' }, ...inv.withdrawals] }
      : inv));
  };

  const addLoan = (l) => {
    const amount = Number(l.amount) || 0;
    const entry = {
      id: genId('LN'), lender: l.lender || 'Lender', type: l.type || 'bank', phone: l.phone || '',
      amount, remaining: amount, interestRate: Number(l.interestRate) || 0,
      startDate: l.startDate || todayISO(), dueDate: l.dueDate || todayISO(),
      monthlyPayment: Number(l.monthlyPayment) || 0, purpose: l.purpose || '', status: 'active', payments: [],
    };
    setLoans((prev) => [entry, ...prev]);
    return entry;
  };
  const addLoanPayment = (loanId, p) => {
    setLoans((prev) => prev.map((ln) => {
      if (ln.id !== loanId) return ln;
      const amount = Number(p.amount) || 0;
      const remaining = Math.max(0, ln.remaining - amount);
      return {
        ...ln,
        remaining,
        status: remaining === 0 ? 'paid_off' : ln.status,
        payments: [{ id: genId('PMT'), amount, date: p.date || todayISO(), note: p.note || '' }, ...ln.payments],
      };
    }));
  };

  const addLentMoney = (l) => {
    const amount = Number(l.amount) || 0;
    const entry = {
      id: genId('LT'), person: l.person || 'Person', phone: l.phone || '', amount, remaining: amount,
      date: l.date || todayISO(), dueDate: l.dueDate || todayISO(), reason: l.reason || '', status: 'pending', returns: [],
    };
    setLentMoney((prev) => [entry, ...prev]);
    return entry;
  };
  const addLentReturn = (lentId, r) => {
    setLentMoney((prev) => prev.map((lt) => {
      if (lt.id !== lentId) return lt;
      const amount = Number(r.amount) || 0;
      const remaining = Math.max(0, lt.remaining - amount);
      return {
        ...lt,
        remaining,
        status: remaining === 0 ? 'fully_returned' : 'partially_returned',
        returns: [{ id: genId('RT'), amount, date: r.date || todayISO(), note: r.note || '' }, ...lt.returns],
      };
    }));
  };

  const value = useMemo(() => ({
    themeName, setThemeName, t, currency, setCurrency,
    locked, setLocked, pinEnabled, setPinEnabled, fingerprintEnabled, setFingerprintEnabled,
    products, addProduct, updateProduct, deleteProduct, stockIn,
    sales, recordSale,
    purchases,
    expenses, addExpense, deleteExpense,
    investors, addInvestor, addInvestorWithdrawal,
    loans, addLoan, addLoanPayment,
    lentMoney, addLentMoney, addLentReturn,
  }), [themeName, t, currency, locked, pinEnabled, fingerprintEnabled, products, sales, purchases, expenses, investors, loans, lentMoney]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
