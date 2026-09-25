export const MOCK_PRODUCTS = [
  { id: 'PRD-0001', name: 'USB-C Cable 2m', brand: 'Anker', category: 'Electronics', qty: 142, minStock: 20, buyPrice: 3.5, sellPrice: 12.99, supplier: 'TechSupply Co', location: 'A1-01', status: 'in_stock', purchaseDate: '2026-05-10' },
  { id: 'PRD-0002', name: 'Wireless Mouse', brand: 'Logitech', category: 'Electronics', qty: 8, minStock: 15, buyPrice: 12.0, sellPrice: 34.99, supplier: 'GadgetWorld', location: 'A1-02', status: 'low_stock', purchaseDate: '2026-05-12' },
  { id: 'PRD-0003', name: 'Notebook A5', brand: '', category: 'Stationery', qty: 0, minStock: 30, buyPrice: 0.8, sellPrice: 3.5, supplier: 'PaperPlus', location: 'B2-01', status: 'out_of_stock', purchaseDate: '2026-04-20' },
  { id: 'PRD-0004', name: 'Desk Lamp LED', brand: 'Philips', category: 'Furniture', qty: 23, minStock: 5, buyPrice: 18.0, sellPrice: 49.99, supplier: 'LightHouse', location: 'C3-01', status: 'in_stock', purchaseDate: '2026-05-01' },
  { id: 'PRD-0005', name: 'Hand Sanitizer 500ml', brand: '', category: 'Health', qty: 5, minStock: 10, buyPrice: 2.2, sellPrice: 7.99, supplier: 'CleanCo', location: 'D1-02', status: 'low_stock', purchaseDate: '2026-05-15' },
  { id: 'PRD-0006', name: 'Sticky Notes Pack', brand: '3M', category: 'Stationery', qty: 88, minStock: 20, buyPrice: 0.6, sellPrice: 2.99, supplier: 'PaperPlus', location: 'B2-02', status: 'in_stock', purchaseDate: '2026-04-28' },
  { id: 'PRD-0007', name: 'HDMI Cable 1.5m', brand: '', category: 'Electronics', qty: 31, minStock: 10, buyPrice: 4.5, sellPrice: 15.99, supplier: 'TechSupply Co', location: 'A1-03', status: 'in_stock', purchaseDate: '2026-05-08' },
  { id: 'PRD-0008', name: 'Coffee Mug 350ml', brand: '', category: 'Kitchen', qty: 12, minStock: 8, buyPrice: 3.0, sellPrice: 9.99, supplier: 'HomeGoods', location: 'E2-01', status: 'in_stock', purchaseDate: '2026-05-03' },
];

export const MOCK_SALES = [
  { id: 'SL-001', date: '2026-05-30', product: 'USB-C Cable 2m', qty: 5, total: 64.95, profit: 47.45 },
  { id: 'SL-002', date: '2026-05-30', product: 'Wireless Mouse', qty: 2, total: 69.98, profit: 45.98 },
  { id: 'SL-003', date: '2026-05-29', product: 'Desk Lamp LED', qty: 1, total: 49.99, profit: 31.99 },
  { id: 'SL-004', date: '2026-05-29', product: 'HDMI Cable 1.5m', qty: 3, total: 47.97, profit: 33.47 },
  { id: 'SL-005', date: '2026-05-28', product: 'Sticky Notes Pack', qty: 10, total: 29.9, profit: 23.9 },
  { id: 'SL-006', date: '2026-05-28', product: 'Coffee Mug 350ml', qty: 4, total: 39.96, profit: 27.96 },
];

export const MOCK_PURCHASES = [
  { id: 'PO-001', supplier: 'TechSupply Co', product: 'USB-C Cable 2m', qty: 200, cost: 700, date: '2026-05-28' },
  { id: 'PO-002', supplier: 'GadgetWorld', product: 'Wireless Mouse', qty: 30, cost: 360, date: '2026-05-27' },
  { id: 'PO-003', supplier: 'PaperPlus', product: 'Notebook A5', qty: 500, cost: 400, date: '2026-05-26' },
  { id: 'PO-004', supplier: 'LightHouse', product: 'Desk Lamp LED', qty: 20, cost: 360, date: '2026-05-25' },
];

export const WEEKLY_SALES = [42, 58, 71, 63, 89, 95, 77];
export const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHLY_PROFIT = [1200, 1850, 1420, 2100, 1780, 2340, 1950, 2680, 2210, 2900, 2450, 3100];
export const MONTHLY_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const CATEGORY_DATA = [
  { name: 'Electronics', value: 42 },
  { name: 'Stationery', value: 24 },
  { name: 'Furniture', value: 15 },
  { name: 'Health', value: 10 },
  { name: 'Kitchen', value: 9 },
];

export const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Salaries', 'Marketing', 'Transport', 'Equipment', 'Maintenance', 'Other'];

export const BACKUP_HISTORY = [
  { id: 'BK-001', date: '2026-05-29', time: '14:32', size: '2.4 MB', items: 8, status: 'success', label: 'Auto Backup' },
  { id: 'BK-002', date: '2026-05-28', time: '14:32', size: '2.3 MB', items: 8, status: 'success', label: 'Auto Backup' },
  { id: 'BK-003', date: '2026-05-27', time: '09:15', size: '2.1 MB', items: 7, status: 'success', label: 'Manual Backup' },
  { id: 'BK-004', date: '2026-05-25', time: '14:32', size: '1.9 MB', items: 7, status: 'success', label: 'Auto Backup' },
];

export const INITIAL_EXPENSES = [
  { id: 'EXP-001', title: 'Office Rent', category: 'Rent', amount: 800, date: '2026-06-01', note: 'Monthly office space' },
  { id: 'EXP-002', title: 'Electricity Bill', category: 'Utilities', amount: 120, date: '2026-06-05', note: '' },
  { id: 'EXP-003', title: 'Staff Salaries', category: 'Salaries', amount: 2400, date: '2026-06-01', note: '2 staff members' },
  { id: 'EXP-004', title: 'Facebook Ads', category: 'Marketing', amount: 200, date: '2026-06-10', note: 'June campaign' },
];

export const INITIAL_INVESTORS = [
  {
    id: 'INV-001', name: 'Karim Hossain', phone: '01711-111222', email: 'karim@example.com',
    investAmount: 50000, date: '2026-01-15', profitShare: 25, status: 'active', note: 'Silent partner',
    withdrawals: [{ id: 'WD-001', amount: 5000, date: '2026-03-01', note: 'Q1 profit payout' }],
  },
  {
    id: 'INV-002', name: 'Nasrin Begum', phone: '01811-333444', email: '',
    investAmount: 30000, date: '2026-02-10', profitShare: 15, status: 'active', note: 'Equipment investor',
    withdrawals: [],
  },
];

export const INITIAL_LOANS = [
  {
    id: 'LN-001', lender: 'Dutch-Bangla Bank', type: 'bank', amount: 100000, remaining: 85000,
    interestRate: 12, startDate: '2026-01-01', dueDate: '2027-01-01', monthlyPayment: 9000,
    purpose: 'Business expansion', status: 'active',
    payments: [
      { id: 'PMT-001', amount: 9000, date: '2026-02-01', note: 'January installment' },
      { id: 'PMT-002', amount: 9000, date: '2026-03-01', note: 'February installment' },
    ],
  },
  {
    id: 'LN-002', lender: 'Rahim Mia', type: 'person', phone: '01711-999888', amount: 20000, remaining: 20000,
    interestRate: 0, startDate: '2026-03-15', dueDate: '2026-09-15', monthlyPayment: 0,
    purpose: 'Emergency stock purchase', status: 'active', payments: [],
  },
];

export const INITIAL_LENT_MONEY = [
  {
    id: 'LT-001', person: 'Sabbir Ahmed', phone: '01611-222333', amount: 5000, remaining: 3000,
    date: '2026-05-01', dueDate: '2026-08-01', reason: 'Medical emergency help', status: 'partially_returned',
    returns: [{ id: 'RT-001', amount: 2000, date: '2026-06-01', note: 'First return' }],
  },
  {
    id: 'LT-002', person: 'Fatema Khanam', phone: '01911-444555', amount: 2000, remaining: 2000,
    date: '2026-07-10', dueDate: '2026-09-10', reason: 'Shop rent help', status: 'pending', returns: [],
  },
];
