import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FormField, PrimaryButton } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { fmt, todayISO } from '../utils/format';

const EMPTY = { person: '', phone: '', amount: '', date: todayISO(), dueDate: todayISO(), reason: '' };
const EMPTY_RT = { amount: '', date: todayISO(), note: '' };

const STATUS_LABEL = {
  pending: 'Pending',
  partially_returned: 'Partially Returned',
  fully_returned: 'Fully Returned',
};

export default function LentMoneyScreen({ navigation }) {
  const { t, currency, lentMoney, addLentMoney, addLentReturn } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [returnTarget, setReturnTarget] = useState(null);
  const [rForm, setRForm] = useState(EMPTY_RT);

  const totalLent = lentMoney.reduce((s, l) => s + l.amount, 0);
  const totalOutstanding = lentMoney.reduce((s, l) => s + l.remaining, 0);
  const totalReturned = totalLent - totalOutstanding;

  const handleAdd = () => {
    if (!form.person || !form.amount || isNaN(parseFloat(form.amount))) return;
    addLentMoney(form);
    setForm(EMPTY);
    setAddOpen(false);
  };

  const handleReturn = () => {
    if (!rForm.amount || isNaN(parseFloat(rForm.amount))) return;
    addLentReturn(returnTarget.id, rForm);
    setRForm(EMPTY_RT);
    setReturnTarget(null);
  };

  const statusColor = (status) =>
    status === 'fully_returned' ? t.success : status === 'partially_returned' ? t.warning : t.danger;
  const statusBg = (status) =>
    status === 'fully_returned' ? t.successLight : status === 'partially_returned' ? t.warningLight : t.dangerLight;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
            <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: t.text, flex: 1 }]}>🤝 Money Lent</Text>
          <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.addBtn, { backgroundColor: t.accent }]}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCell, { backgroundColor: t.accentLight }]}>
            <Text style={{ fontSize: 10, color: t.accent, marginBottom: 4, fontWeight: '600' }}>Total Lent</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.accent }}>{fmt(totalLent, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.successLight }]}>
            <Text style={{ fontSize: 10, color: t.success, marginBottom: 4, fontWeight: '600' }}>Returned</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.success }}>{fmt(totalReturned, currency)}</Text>
          </View>
          <View style={[styles.summaryCell, { backgroundColor: t.dangerLight }]}>
            <Text style={{ fontSize: 10, color: t.danger, marginBottom: 4, fontWeight: '600' }}>Outstanding</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.danger }}>{fmt(totalOutstanding, currency)}</Text>
          </View>
        </View>

        {lentMoney.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🤝</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.textMuted }}>No records yet</Text>
            <Text style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>Tap + to track money you've lent out</Text>
          </View>
        )}

        {lentMoney.map((lt) => (
          <Card key={lt.id} t={t} style={{ marginBottom: 10 }}>
            <View style={styles.top}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.statusTag, { backgroundColor: statusBg(lt.status), color: statusColor(lt.status) }]}>{STATUS_LABEL[lt.status]}</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: t.text, marginTop: 4 }}>{lt.person}</Text>
                {!!lt.phone && <Text style={{ fontSize: 12, color: t.textSec }}>{lt.phone}</Text>}
                {!!lt.reason && <Text style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{lt.reason}</Text>}
                <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Lent {lt.date} · Due {lt.dueDate}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: t.text }}>{fmt(lt.remaining, currency)}</Text>
                <Text style={{ fontSize: 11, color: t.textMuted }}>of {fmt(lt.amount, currency)}</Text>
              </View>
            </View>
            {lt.remaining > 0 && (
              <TouchableOpacity onPress={() => { setRForm(EMPTY_RT); setReturnTarget(lt); }} style={[styles.returnBtn, { backgroundColor: t.successLight }]}>
                <Text style={{ color: t.success, fontWeight: '600', fontSize: 13 }}>Record Return</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}
      </ScrollView>

      <BottomModal open={addOpen} onClose={() => setAddOpen(false)} title="Track Money Lent" t={t}>
        <FormField t={t} label="Person's Name" value={form.person} onChangeText={(v) => setForm({ ...form, person: v })} placeholder="Full name" />
        <FormField t={t} label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="01xxx-xxxxxx" />
        <FormField t={t} label={`Amount (${currency})`} value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Date Lent" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
        <FormField t={t} label="Expected Return Date" value={form.dueDate} onChangeText={(v) => setForm({ ...form, dueDate: v })} />
        <FormField t={t} label="Reason" value={form.reason} onChangeText={(v) => setForm({ ...form, reason: v })} placeholder="e.g. Medical emergency help" />
        <PrimaryButton t={t} label="Save Record" onPress={handleAdd} />
      </BottomModal>

      <BottomModal open={!!returnTarget} onClose={() => setReturnTarget(null)} title={`Return: ${returnTarget?.person || ''}`} t={t}>
        <FormField t={t} label={`Amount (${currency})`} value={rForm.amount} onChangeText={(v) => setRForm({ ...rForm, amount: v })} keyboardType="decimal-pad" />
        <FormField t={t} label="Date" value={rForm.date} onChangeText={(v) => setRForm({ ...rForm, date: v })} />
        <FormField t={t} label="Note (optional)" value={rForm.note} onChangeText={(v) => setRForm({ ...rForm, note: v })} />
        <PrimaryButton t={t} label="Record Return" onPress={handleReturn} style={{ backgroundColor: t.success }} />
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
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: 'flex-start', overflow: 'hidden' },
  returnBtn: { marginTop: 10, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
});
