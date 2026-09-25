import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FormField, PrimaryButton, FilterChip } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { fmt, todayISO } from '../utils/format';

const EMPTY = { lender: '', type: 'bank', phone: '', amount: '', interestRate: '', startDate: todayISO(), dueDate: todayISO(), monthlyPayment: '', purpose: '' };
const EMPTY_PMT = { amount: '', date: todayISO(), note: '' };

export default function LoansScreen({ navigation }) {
  const { t, currency, loans, addLoan, addLoanPayment } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [payTarget, setPayTarget] = useState(null);
  const [pForm, setPForm] = useState(EMPTY_PMT);

  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0);
  const totalRemaining = loans.reduce((s, l) => s + l.remaining, 0);
  const totalPaid = totalBorrowed - totalRemaining;

  const handleAdd = () => {
    if (!form.lender || !form.amount || isNaN(parseFloat(form.amount))) return;
    addLoan(form);
    setForm(EMPTY);
    setAddOpen(false);
  };

  const handlePay = () => {
    if (!pForm.amount || isNaN(parseFloat(pForm.amount))) return;
    addLoanPayment(payTarget.id, pForm);
    setPForm(EMPTY_PMT);
    setPayTarget(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: t.text, flex: 1 }]}>🏦 Loans</Text>
          <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.addBtn, { backgroundColor: t.warning }]}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCell, { backgroundColor: t.warningLight }]}>
            <Text style={{ fontSize: 10, color: t.warning, marginBottom: 4, fontWeight: '600' }}>Total Borrowed</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.warning }}>{fmt(totalBorrowed, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.successLight }]}>
            <Text style={{ fontSize: 10, color: t.success, marginBottom: 4, fontWeight: '600' }}>Paid</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.success }}>{fmt(totalPaid, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.dangerLight }]}>
            <Text style={{ fontSize: 10, color: t.danger, marginBottom: 4, fontWeight: '600' }}>Remaining</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.danger }}>{fmt(totalRemaining, currency)}</Text>
          </View>
        </View>

        {loans.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🏦</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.textMuted }}>No loans recorded</Text>
            <Text style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>Tap + to add a bank or personal loan</Text>
          </View>
        )}

        {loans.map((ln) => {
          const pct = ln.amount ? ((ln.amount - ln.remaining) / ln.amount) * 100 : 0;
          const paidOff = ln.remaining === 0;
          return (
            <Card key={ln.id} t={t} style={{ marginBottom: 10 }}>
              <View style={styles.loanTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.tagRow}>
                    <Text style={[styles.typeTag, { backgroundColor: ln.type === 'bank' ? t.accentLight : t.purpleLight, color: ln.type === 'bank' ? t.accent : t.purple }]}>
                      {ln.type === 'bank' ? 'Bank Loan' : 'Personal Loan'}
                    </Text>
                    {paidOff && <Text style={[styles.typeTag, { backgroundColor: t.successLight, color: t.success }]}>Paid Off</Text>}
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>{ln.lender}</Text>
                  {!!ln.purpose && <Text style={{ fontSize: 12, color: t.textSec }}>{ln.purpose}</Text>}
                  <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Due {ln.dueDate} {ln.interestRate ? `· ${ln.interestRate}% interest` : ''}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: t.text }}>{fmt(ln.remaining, currency)}</Text>
                  <Text style={{ fontSize: 11, color: t.textMuted }}>of {fmt(ln.amount, currency)}</Text>
                </View>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: t.surfaceAlt }]}>
                <View style={{ width: `${pct}%`, height: 6, borderRadius: 4, backgroundColor: t.success }} />
              </View>
              {!paidOff && (
                <TouchableOpacity onPress={() => { setPForm(EMPTY_PMT); setPayTarget(ln); }} style={[styles.payBtn, { backgroundColor: t.successLight }]}>
                  <Text style={{ color: t.success, fontWeight: '600', fontSize: 13 }}>Record Payment</Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })}
      </ScrollView>

      <BottomModal open={addOpen} onClose={() => setAddOpen(false)} title="Add Loan" t={t}>
        <Text style={[styles.fieldLabel, { color: t.textSec }]}>Type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
          <FilterChip label="Bank Loan" active={form.type === 'bank'} onPress={() => setForm({ ...form, type: 'bank' })} t={t} />
          <FilterChip label="Personal Loan" active={form.type === 'person'} onPress={() => setForm({ ...form, type: 'person' })} t={t} />
        </View>
        <FormField t={t} label="Lender Name" value={form.lender} onChangeText={(v) => setForm({ ...form, lender: v })} placeholder="e.g. Dutch-Bangla Bank" />
        {form.type === 'person' && (
          <FormField t={t} label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="01xxx-xxxxxx" />
        )}
        <FormField t={t} label={`Loan Amount (${currency})`} value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Interest Rate % (0 if none)" value={form.interestRate} onChangeText={(v) => setForm({ ...form, interestRate: v })} keyboardType="decimal-pad" />
        <FormField t={t} label="Monthly Payment" value={form.monthlyPayment} onChangeText={(v) => setForm({ ...form, monthlyPayment: v })} keyboardType="decimal-pad" />
        <FormField t={t} label="Start Date" value={form.startDate} onChangeText={(v) => setForm({ ...form, startDate: v })} />
        <FormField t={t} label="Due Date" value={form.dueDate} onChangeText={(v) => setForm({ ...form, dueDate: v })} />
        <FormField t={t} label="Purpose" value={form.purpose} onChangeText={(v) => setForm({ ...form, purpose: v })} placeholder="e.g. Business expansion" />
        <PrimaryButton t={t} label="Add Loan" onPress={handleAdd} style={{ backgroundColor: t.warning }} />
      </BottomModal>

      <BottomModal open={!!payTarget} onClose={() => setPayTarget(null)} title={`Payment: ${payTarget?.lender || ''}`} t={t}>
        <FormField t={t} label={`Amount (${currency})`} value={pForm.amount} onChangeText={(v) => setPForm({ ...pForm, amount: v })} keyboardType="decimal-pad" />
        <FormField t={t} label="Date" value={pForm.date} onChangeText={(v) => setPForm({ ...pForm, date: v })} />
        <FormField t={t} label="Note (optional)" value={pForm.note} onChangeText={(v) => setPForm({ ...pForm, note: v })} />
        <PrimaryButton t={t} label="Record Payment" onPress={handlePay} style={{ backgroundColor: t.success }} />
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
  loanTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  typeTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, overflow: 'hidden' },
  progressTrack: { height: 6, borderRadius: 4, marginTop: 10 },
  payBtn: { marginTop: 10, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
});
