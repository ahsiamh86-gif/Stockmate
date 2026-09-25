import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FormField, PrimaryButton } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { fmt, todayISO } from '../utils/format';

const EMPTY = { name: '', phone: '', email: '', investAmount: '', date: todayISO(), profitShare: '', note: '' };
const EMPTY_WD = { amount: '', date: todayISO(), note: '' };
const NET_PROFIT = 7320;

export default function InvestorsScreen({ navigation }) {
  const { t, currency, investors, addInvestor, addInvestorWithdrawal } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [wForm, setWForm] = useState(EMPTY_WD);

  const totalInvested = investors.reduce((s, i) => s + i.investAmount, 0);
  const totalWithdrawn = investors.reduce((s, i) => s + (i.withdrawals || []).reduce((a, w) => a + w.amount, 0), 0);
  const netInvested = totalInvested - totalWithdrawn;
  const profitShareInvestors = investors.filter((i) => i.profitShare > 0);

  const handleAdd = () => {
    if (!form.name || !form.investAmount || isNaN(parseFloat(form.investAmount))) return;
    addInvestor(form);
    setForm(EMPTY);
    setAddOpen(false);
  };

  const handleWithdraw = () => {
    if (!wForm.amount || isNaN(parseFloat(wForm.amount))) return;
    addInvestorWithdrawal(withdrawTarget.id, wForm);
    setWForm(EMPTY_WD);
    setWithdrawTarget(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: t.text, flex: 1 }]}>👥 Investors</Text>
          <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.addBtn, { backgroundColor: t.purple }]}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCell, { backgroundColor: t.purpleLight || t.accentLight }]}>
            <Text style={{ fontSize: 10, color: t.purple, marginBottom: 4, fontWeight: '600' }}>Total Invested</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.purple }}>{fmt(totalInvested, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.dangerLight }]}>
            <Text style={{ fontSize: 10, color: t.danger, marginBottom: 4, fontWeight: '600' }}>Withdrawn</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.danger }}>{fmt(totalWithdrawn, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.successLight }]}>
            <Text style={{ fontSize: 10, color: t.success, marginBottom: 4, fontWeight: '600' }}>Net Active</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.success }}>{fmt(netInvested, currency)}</Text>
          </View>
        </View>

        {investors.length > 0 && (
          <View style={[styles.shareBox, { backgroundColor: t.purpleLight || t.accentLight }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: t.purple, marginBottom: 8 }}>
              💰 Profit Share Summary (Net Profit: {fmt(NET_PROFIT, currency)})
            </Text>
            {profitShareInvestors.length === 0 ? (
              <Text style={{ fontSize: 12, color: t.textMuted }}>No profit share % set on any investor yet.</Text>
            ) : (
              <>
                {profitShareInvestors.map((i) => (
                  <View key={i.id} style={[styles.shareRow, { borderBottomColor: t.purple + '22' }]}>
                    <Text style={{ fontSize: 12, color: t.text }}>{i.name} <Text style={{ color: t.textSec, fontSize: 11 }}>({i.profitShare}%)</Text></Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: t.purple }}>{fmt(NET_PROFIT * (i.profitShare / 100), currency)}</Text>
                  </View>
                ))}
                <View style={[styles.shareRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: t.purple }}>Total Profit Distributed</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: t.purple }}>
                    {fmt(profitShareInvestors.reduce((s, i) => s + NET_PROFIT * (i.profitShare / 100), 0), currency)}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {investors.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>👥</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.textMuted }}>No investors yet</Text>
            <Text style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>Tap + to add your first investor</Text>
          </View>
        )}

        {investors.map((inv) => {
          const withdrawn = (inv.withdrawals || []).reduce((a, w) => a + w.amount, 0);
          return (
            <Card key={inv.id} t={t} style={{ marginBottom: 10 }}>
              <View style={styles.invTop}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>{inv.name}</Text>
                  {!!inv.phone && <Text style={{ fontSize: 12, color: t.textSec }}>{inv.phone}</Text>}
                  <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Since {inv.date}</Text>
                  {!!inv.note && <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{inv.note}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: t.purple }}>{fmt(inv.investAmount, currency)}</Text>
                  {inv.profitShare > 0 && <Text style={{ fontSize: 11, color: t.accent, fontWeight: '600' }}>{inv.profitShare}% share</Text>}
                </View>
              </View>
              {withdrawn > 0 && (
                <Text style={{ fontSize: 11, color: t.danger, marginTop: 6 }}>Withdrawn: {fmt(withdrawn, currency)}</Text>
              )}
              <TouchableOpacity onPress={() => { setWForm(EMPTY_WD); setWithdrawTarget(inv); }} style={[styles.withdrawBtn, { backgroundColor: t.dangerLight }]}>
                <Text style={{ color: t.danger, fontWeight: '600', fontSize: 13 }}>Record Withdrawal</Text>
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>

      <BottomModal open={addOpen} onClose={() => setAddOpen(false)} title="Add Investor" t={t}>
        <FormField t={t} label="Name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Full name" />
        <FormField t={t} label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="01xxx-xxxxxx" />
        <FormField t={t} label="Email (optional)" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} placeholder="name@example.com" />
        <FormField t={t} label={`Investment Amount (${currency})`} value={form.investAmount} onChangeText={(v) => setForm({ ...form, investAmount: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Profit Share %" value={form.profitShare} onChangeText={(v) => setForm({ ...form, profitShare: v })} placeholder="e.g. 20" keyboardType="decimal-pad" />
        <FormField t={t} label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
        <FormField t={t} label="Note (optional)" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} multiline />
        <PrimaryButton t={t} label="Add Investor" onPress={handleAdd} style={{ backgroundColor: t.purple }} />
      </BottomModal>

      <BottomModal open={!!withdrawTarget} onClose={() => setWithdrawTarget(null)} title={`Withdrawal: ${withdrawTarget?.name || ''}`} t={t}>
        <FormField t={t} label={`Amount (${currency})`} value={wForm.amount} onChangeText={(v) => setWForm({ ...wForm, amount: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Date" value={wForm.date} onChangeText={(v) => setWForm({ ...wForm, date: v })} />
        <FormField t={t} label="Note (optional)" value={wForm.note} onChangeText={(v) => setWForm({ ...wForm, note: v })} />
        <PrimaryButton t={t} label="Record Withdrawal" onPress={handleWithdraw} style={{ backgroundColor: t.danger }} />
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
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  summaryCell: { flex: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  shareBox: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1 },
  invTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  withdrawBtn: { marginTop: 10, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
});
