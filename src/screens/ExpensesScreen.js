import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FormField, PrimaryButton, FilterChip } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { fmt, todayISO } from '../utils/format';
import { EXPENSE_CATEGORIES } from '../data/mockData';

const EMPTY = { title: '', category: 'Rent', amount: '', date: todayISO(), note: '' };

export default function ExpensesScreen({ navigation }) {
  const { t, currency, expenses, addExpense, deleteExpense } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [filterCat, setFilterCat] = useState('All');

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const currentMonthPrefix = todayISO().slice(0, 7);
  const thisMonth = expenses.filter((e) => e.date.startsWith(currentMonthPrefix)).reduce((s, e) => s + e.amount, 0);
  const filtered = filterCat === 'All' ? expenses : expenses.filter((e) => e.category === filterCat);

  const catColors = {
    Rent: t.danger, Utilities: t.warning, Salaries: t.purple, Marketing: t.accent,
    Transport: t.success, Equipment: t.textSec, Maintenance: t.warning, Other: t.textMuted,
  };

  const handleAdd = () => {
    if (!form.title || !form.amount || isNaN(parseFloat(form.amount))) return;
    addExpense(form);
    setForm(EMPTY);
    setAddOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: t.text, flex: 1 }]}>Expenses</Text>
          <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.addBtn, { backgroundColor: t.danger }]}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCell, { backgroundColor: t.dangerLight }]}>
            <Text style={{ fontSize: 11, color: t.danger, marginBottom: 4 }}>Total Expenses</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: t.danger }}>{fmt(totalExpenses, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.warningLight }]}>
            <Text style={{ fontSize: 11, color: t.warning, marginBottom: 4 }}>This Month</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: t.warning }}>{fmt(thisMonth, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ fontSize: 11, color: t.textSec, marginBottom: 4 }}>Records</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: t.text }}>{expenses.length}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {['All', ...EXPENSE_CATEGORIES].map((c) => (
            <FilterChip key={c} label={c} active={filterCat === c} onPress={() => setFilterCat(c)} t={t} />
          ))}
        </ScrollView>

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>💸</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.textMuted }}>No expense records yet</Text>
            <Text style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>Tap + to add your first expense</Text>
          </View>
        )}

        {filtered.map((e) => (
          <TouchableOpacity key={e.id} onLongPress={() => deleteExpense(e.id)}>
            <Card t={t} style={{ marginBottom: 10 }}>
              <View style={styles.expenseTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.tagRow}>
                    <Text style={[styles.idTag, { backgroundColor: t.surfaceAlt, color: t.textSec }]}>{e.id}</Text>
                    <Text style={[styles.catTag, { backgroundColor: (catColors[e.category] || t.textSec) + '22', color: catColors[e.category] || t.textSec }]}>{e.category}</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: t.text, marginBottom: 2 }}>{e.title}</Text>
                  <Text style={{ fontSize: 12, color: t.textSec }}>{e.date}</Text>
                  {!!e.note && <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{e.note}</Text>}
                </View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: t.danger, marginLeft: 12 }}>{fmt(e.amount, currency)}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomModal open={addOpen} onClose={() => setAddOpen(false)} title="Add Expense" t={t}>
        <FormField t={t} label="Title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="e.g. Monthly Rent" />
        <Text style={[styles.fieldLabel, { color: t.textSec }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {EXPENSE_CATEGORIES.map((c) => (
            <FilterChip key={c} label={c} active={form.category === c} onPress={() => setForm({ ...form, category: c })} t={t} />
          ))}
        </ScrollView>
        <FormField t={t} label={`Amount (${currency})`} value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
        <FormField t={t} label="Note (optional)" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} placeholder="e.g. Office space Q2" />
        <PrimaryButton t={t} label="Add Expense" onPress={handleAdd} style={{ backgroundColor: t.danger }} />
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  backBtn: { borderRadius: 10, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  addBtn: { borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  summaryCell: { flex: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  expenseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  idTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  catTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, overflow: 'hidden' },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
});
