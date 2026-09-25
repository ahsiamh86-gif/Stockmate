import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Shared';
import { BarChart } from '../components/Charts';
import { fmt } from '../utils/format';

const SALES_DATA = {
  daily: [42, 58, 71, 63, 89, 95, 77],
  weekly: [380, 510, 620, 490, 710, 840, 680],
  monthly: [1200, 1850, 1420, 2100, 1780, 2340, 1950, 2680, 2210, 2900, 2450, 3100],
  yearly: [18400, 24600, 31200, 38900],
};
const PROFIT_DATA = {
  daily: [18, 25, 31, 27, 38, 42, 33],
  weekly: [160, 215, 270, 210, 305, 360, 290],
  monthly: [520, 800, 610, 910, 770, 1010, 840, 1160, 950, 1250, 1060, 1340],
  yearly: [7200, 10100, 13400, 17220],
};
const LABELS = {
  daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekly: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
  monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yearly: ['2022', '2023', '2024', '2025'],
};
const TOP_PRODUCTS = [
  { name: 'USB-C Cable 2m', sold: 142, revenue: 1844.58, profit: 1351.58 },
  { name: 'HDMI Cable 1.5m', sold: 93, revenue: 1487.07, profit: 1068.57 },
  { name: 'Desk Lamp LED', sold: 61, revenue: 3049.39, profit: 1952.39 },
  { name: 'Wireless Mouse', sold: 44, revenue: 1539.56, profit: 1011.56 },
  { name: 'Coffee Mug 350ml', sold: 38, revenue: 379.62, profit: 265.62 },
];
const NET_PROFIT_YEAR = 7320;

export default function ReportsScreen({ navigation }) {
  const { t, currency, expenses, investors, loans, lentMoney } = useApp();
  const [period, setPeriod] = useState('monthly');

  const totalSales = SALES_DATA[period].reduce((a, b) => a + b, 0);
  const totalProfit = PROFIT_DATA[period].reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalProfit - totalExpenses;
  const margin = totalSales ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

  const totalInvestorShare = investors.reduce((s, i) => s + (NET_PROFIT_YEAR * (i.profitShare || 0)) / 100, 0);
  const ownerProfit = NET_PROFIT_YEAR - totalInvestorShare;
  const totalLoanRemaining = loans.filter((l) => l.status === 'active').reduce((s, l) => s + l.remaining, 0);
  const totalLentOut = lentMoney.reduce((s, l) => s + l.remaining, 0);

  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
          <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: t.text }]}>Reports</Text>
      </View>

      <View style={[styles.tabBar, { backgroundColor: t.surfaceAlt }]}>
        {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
          <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.tabBtn, period === p && { backgroundColor: t.card }]}>
            <Text style={{ color: period === p ? t.text : t.textSec, fontWeight: period === p ? '700' : '500', fontSize: 12, textTransform: 'capitalize' }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.netBanner, { backgroundColor: netProfit >= 0 ? t.successLight : t.dangerLight }]}>
        <View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: netProfit >= 0 ? t.success : t.danger }}>NET PROFIT (after expenses)</Text>
          <Text style={{ fontSize: 11, color: netProfit >= 0 ? t.success : t.danger, opacity: 0.7, marginTop: 2 }}>
            Gross {fmt(totalProfit, currency)} − Exp {fmt(totalExpenses, currency)}
          </Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '900', color: netProfit >= 0 ? t.success : t.danger }}>
          {netProfit >= 0 ? '+' : ''}{fmt(netProfit, currency)}
        </Text>
      </View>

      <View style={styles.kpiGrid}>
        {[
          { label: `${period[0].toUpperCase()}${period.slice(1)} Revenue`, value: fmt(totalSales, currency), color: t.accent },
          { label: 'Gross Profit', value: fmt(totalProfit, currency), color: t.success },
          { label: 'Margin', value: `${margin}%`, color: t.purple },
          { label: 'Expenses', value: fmt(totalExpenses, currency), color: t.danger },
        ].map((k) => (
          <View key={k.label} style={[styles.kpiCell, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: k.color }}>{k.value}</Text>
            <Text style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>{k.label}</Text>
          </View>
        ))}
      </View>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Revenue Trend</Text>
        <BarChart data={SALES_DATA[period]} labels={LABELS[period]} colors={t.chartBar} height={100} t={t} />
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Top Products</Text>
        {TOP_PRODUCTS.map((p, i) => (
          <View key={p.name} style={[styles.topRow, { borderBottomColor: t.border, borderBottomWidth: i === TOP_PRODUCTS.length - 1 ? 0 : 1 }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: t.text }}>{p.name}</Text>
              <Text style={{ fontSize: 11, color: t.textSec }}>{p.sold} sold</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{fmt(p.revenue, currency)}</Text>
              <Text style={{ fontSize: 11, color: t.success }}>+{fmt(p.profit, currency)}</Text>
            </View>
          </View>
        ))}
      </Card>

      {Object.keys(expenseByCategory).length > 0 && (
        <Card t={t} style={{ marginBottom: 14 }}>
          <Text style={[styles.cardTitle, { color: t.text }]}>Expenses by Category</Text>
          {Object.entries(expenseByCategory).map(([cat, amount]) => (
            <View key={cat} style={styles.topRow}>
              <Text style={{ fontSize: 13, color: t.textSec }}>{cat}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: t.danger }}>{fmt(amount, currency)}</Text>
            </View>
          ))}
        </Card>
      )}

      <Card t={t}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Business Financial Position</Text>
        {[
          { label: 'Annual Net Profit', value: fmt(NET_PROFIT_YEAR, currency), color: t.text },
          { label: 'Investor Profit Share', value: fmt(totalInvestorShare, currency), color: t.purple },
          { label: "Owner's Profit", value: fmt(ownerProfit, currency), color: t.success },
          { label: 'Active Loan Remaining', value: fmt(totalLoanRemaining, currency), color: t.warning },
          { label: 'Money Lent Out (Outstanding)', value: fmt(totalLentOut, currency), color: t.accent },
        ].map((row) => (
          <View key={row.label} style={[styles.topRow, { borderBottomColor: t.border }]}>
            <Text style={{ fontSize: 13, color: t.textSec }}>{row.label}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: row.color }}>{row.value}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  backBtn: { borderRadius: 10, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 3, marginBottom: 14 },
  tabBtn: { flex: 1, borderRadius: 9, paddingVertical: 9, alignItems: 'center' },
  netBanner: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  kpiCell: { flexBasis: '48%', flexGrow: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12 },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'transparent' },
});
