import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card } from '../components/Shared';
import { fmt } from '../utils/format';

export default function PurchasesScreen() {
  const { t, currency, purchases } = useApp();
  const [searchMode, setSearchMode] = useState('single');
  const [searchDate, setSearchDate] = useState('');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  const filtered = purchases.filter((p) => {
    if (searchMode === 'single' && searchDate) return p.date === searchDate;
    if (searchMode === 'range' && searchFrom && searchTo) return p.date >= searchFrom && p.date <= searchTo;
    return true;
  });
  const searchActive = (searchMode === 'single' && searchDate) || (searchMode === 'range' && searchFrom && searchTo);
  const filteredCost = filtered.reduce((s, p) => s + p.cost, 0);
  const totalCost = purchases.reduce((s, p) => s + p.cost, 0);
  const suppliers = new Set(purchases.map((p) => p.supplier)).size;

  const clearSearch = () => { setSearchDate(''); setSearchFrom(''); setSearchTo(''); };

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: t.text }]}>Purchase History</Text>

      <View style={[styles.tip, { backgroundColor: t.accentLight, borderColor: t.accent }]}>
        <Text style={{ fontSize: 12, color: t.accent, fontWeight: '600' }}>💡 Purchase records come from products added in Inventory</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCell, { backgroundColor: t.surfaceAlt }]}>
          <Text style={[styles.statValue, { color: t.accent }]}>{fmt(totalCost, currency)}</Text>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Total Cost</Text>
        </View>
        <View style={[styles.statCell, { backgroundColor: t.surfaceAlt }]}>
          <Text style={[styles.statValue, { color: t.purple }]}>{purchases.length}</Text>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Total Orders</Text>
        </View>
        <View style={[styles.statCell, { backgroundColor: t.surfaceAlt }]}>
          <Text style={[styles.statValue, { color: t.success }]}>{suppliers}</Text>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Suppliers</Text>
        </View>
      </View>

      <View style={[styles.searchCard, { backgroundColor: t.card, borderColor: t.border }]}>
        <View style={styles.searchHeader}>
          <Icon name="search" size={14} color={t.accent} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: t.text }}>Search by Date</Text>
        </View>
        <View style={[styles.segment, { backgroundColor: t.surfaceAlt }]}>
          {[{ k: 'single', label: 'Single Date' }, { k: 'range', label: 'Date Range' }].map((m) => (
            <TouchableOpacity key={m.k} onPress={() => { setSearchMode(m.k); clearSearch(); }} style={[styles.segmentBtn, searchMode === m.k && { backgroundColor: t.accent }]}>
              <Text style={{ color: searchMode === m.k ? '#fff' : t.textSec, fontSize: 12, fontWeight: '600' }}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {searchMode === 'single' ? (
          <View>
            <Text style={[styles.fieldLabel, { color: t.textSec }]}>Select Date (YYYY-MM-DD)</Text>
            <TextInput value={searchDate} onChangeText={setSearchDate} placeholder="2026-05-28" placeholderTextColor={t.textMuted} style={[styles.dateInput, { backgroundColor: t.input, borderColor: searchDate ? t.accent : t.border, color: t.text }]} />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: t.textSec }]}>From</Text>
              <TextInput value={searchFrom} onChangeText={setSearchFrom} placeholder="2026-05-01" placeholderTextColor={t.textMuted} style={[styles.dateInput, { backgroundColor: t.input, borderColor: searchFrom ? t.accent : t.border, color: t.text }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: t.textSec }]}>To</Text>
              <TextInput value={searchTo} onChangeText={setSearchTo} placeholder="2026-05-31" placeholderTextColor={t.textMuted} style={[styles.dateInput, { backgroundColor: t.input, borderColor: searchTo ? t.accent : t.border, color: t.text }]} />
            </View>
          </View>
        )}
        {!!searchActive && (
          <View style={[styles.activeSearchRow, { backgroundColor: t.accentLight }]}>
            <Text style={{ fontSize: 12, color: t.accent, fontWeight: '600', flex: 1 }}>
              {filtered.length} order{filtered.length !== 1 ? 's' : ''} found · Total: {fmt(filteredCost, currency)}
            </Text>
            <TouchableOpacity onPress={clearSearch}><Text style={{ color: t.accent, fontSize: 16 }}>✕</Text></TouchableOpacity>
          </View>
        )}
      </View>

      {filtered.length === 0 && searchActive && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: t.textMuted }}>No purchases found</Text>
          <Text style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>Try a different date or range</Text>
        </View>
      )}

      {filtered.map((p) => (
        <Card key={p.id} t={t} style={{ marginBottom: 10 }}>
          <View style={styles.purchaseTop}>
            <View>
              <Text style={[styles.idBadge, { color: t.accent, backgroundColor: t.accentLight }]}>{p.id}</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: t.text, marginTop: 4 }}>{p.product}</Text>
              <Text style={{ fontSize: 12, color: t.textSec }}>{p.supplier} · {p.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: t.text }}>{fmt(p.cost, currency)}</Text>
              <Text style={{ fontSize: 11, color: t.textSec }}>Qty: {p.qty}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={[styles.miniCell, { backgroundColor: t.surfaceAlt }]}>
              <Text style={{ fontSize: 10, color: t.textMuted }}>Unit Cost</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{fmt(p.cost / p.qty, currency)}</Text>
            </View>
            <View style={[styles.miniCell, { backgroundColor: t.successLight }]}>
              <Text style={{ fontSize: 10, color: t.success }}>Status</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: t.success }}>Received</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, paddingVertical: 16 },
  tip: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCell: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  searchCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  segment: { flexDirection: 'row', borderRadius: 10, padding: 3, marginBottom: 12 },
  segmentBtn: { flex: 1, borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  fieldLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  dateInput: { width: '100%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 2, fontSize: 13 },
  activeSearchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  purchaseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  idBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', overflow: 'hidden' },
  miniCell: { flex: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
});
