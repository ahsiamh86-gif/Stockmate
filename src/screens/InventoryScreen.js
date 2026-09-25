import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, MetricCard as _MetricCard, SearchBar, FilterChip, FormField, PrimaryButton, StatusBadge } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { fmt, todayISO } from '../utils/format';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in_stock', label: 'In Stock' },
  { key: 'low_stock', label: 'Low Stock' },
  { key: 'out_of_stock', label: 'Out of Stock' },
];

const EMPTY_PRODUCT = { name: '', brand: '', category: 'Electronics', qty: '', buyPrice: '', sellPrice: '', minStock: '', supplier: '', location: '', purchaseDate: todayISO(), id: '' };

export default function InventoryScreen() {
  const { t, currency, products, addProduct, updateProduct, deleteProduct, stockIn } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editTarget, setEditTarget] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [autoId, setAutoId] = useState(true);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [editForm, setEditForm] = useState(null);
  const [stockInTarget, setStockInTarget] = useState(null);
  const [stockInQty, setStockInQty] = useState('');

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => {
    setForm({ ...EMPTY_PRODUCT, purchaseDate: todayISO() });
    setAutoId(true);
    setAddOpen(true);
  };

  const submitAdd = () => {
    if (!form.name.trim()) {
      Alert.alert('Product name required');
      return;
    }
    addProduct({ ...form, id: autoId ? '' : form.id });
    setAddOpen(false);
  };

  const openEdit = (p) => {
    setEditForm({ ...p, qty: String(p.qty), buyPrice: String(p.buyPrice), minStock: String(p.minStock), sellPrice: String(p.sellPrice) });
    setEditTarget(p);
  };

  const submitEdit = () => {
    updateProduct(editTarget.id, editForm);
    setEditTarget(null);
  };

  const confirmDelete = (p) => {
    Alert.alert('Delete product', `Remove "${p.name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(p.id) },
    ]);
  };

  const promptStockIn = (p) => {
    setStockInQty('');
    setStockInTarget(p);
  };

  const submitStockIn = () => {
    const n = Number(stockInQty);
    if (n > 0) stockIn(stockInTarget.id, n);
    setStockInTarget(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: t.text }]}>Inventory</Text>
          <TouchableOpacity onPress={openAdd} style={[styles.addBtn, { backgroundColor: t.accent }]}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <SearchBar value={search} onChange={setSearch} placeholder="Search products, IDs..." t={t} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map((f) => (
            <FilterChip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} t={t} />
          ))}
        </ScrollView>

        <Text style={[styles.countText, { color: t.textMuted }]}>{filtered.length} products</Text>

        {filtered.map((p) => (
          <Card key={p.id} t={t} style={{ marginBottom: 10 }}>
            <View style={styles.productTop}>
              <View style={{ flex: 1 }}>
                <View style={styles.idRow}>
                  <Text style={[styles.idBadge, { color: t.accent, backgroundColor: t.accentLight }]}>{p.id}</Text>
                  <StatusBadge status={p.status} t={t} />
                </View>
                <Text style={[styles.productName, { color: t.text }]}>{p.name}</Text>
                {!!p.brand && <Text style={[styles.brandBadge, { color: t.accent, backgroundColor: t.accentLight }]}>{p.brand}</Text>}
                <Text style={[styles.metaText, { color: t.textSec }]}>{p.category} · {p.location}</Text>
                <Text style={[styles.metaText, { color: t.textSec }]}>{p.supplier}</Text>
                {!!p.purchaseDate && <Text style={[styles.metaMuted, { color: t.textMuted }]}>📅 Purchased: {p.purchaseDate}</Text>}
              </View>
              <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                <Text style={[styles.qtyText, { color: p.qty === 0 ? t.danger : p.qty < p.minStock ? t.warning : t.success }]}>{p.qty}</Text>
                <Text style={{ fontSize: 10, color: t.textMuted }}>in stock</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: t.text, marginTop: 4 }}>{fmt(p.sellPrice, currency)}</Text>
              </View>
            </View>

            <View style={[styles.priceRow, { borderTopColor: t.border }]}>
              <View style={[styles.priceCell, { backgroundColor: t.surfaceAlt }]}>
                <Text style={[styles.priceLabel, { color: t.textMuted }]}>Buy Price</Text>
                <Text style={[styles.priceValue, { color: t.text }]}>{fmt(p.buyPrice, currency)}</Text>
              </View>
              <View style={[styles.priceCell, { backgroundColor: t.surfaceAlt }]}>
                <Text style={[styles.priceLabel, { color: t.textMuted }]}>Sell Price</Text>
                <Text style={[styles.priceValue, { color: t.text }]}>{fmt(p.sellPrice, currency)}</Text>
              </View>
              <View style={[styles.priceCell, { backgroundColor: t.successLight }]}>
                <Text style={[styles.priceLabel, { color: t.success }]}>Margin</Text>
                <Text style={[styles.priceValue, { color: t.success }]}>{p.sellPrice ? (((p.sellPrice - p.buyPrice) / p.sellPrice) * 100).toFixed(0) : 0}%</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => openEdit(p)} style={[styles.actionBtn, { backgroundColor: t.accentLight }]}>
                <Icon name="edit" size={14} color={t.accent} />
                <Text style={{ color: t.accent, fontWeight: '600', fontSize: 13 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => promptStockIn(p)} style={[styles.actionBtn, { backgroundColor: t.successLight }]}>
                <Text style={{ color: t.success, fontWeight: '600', fontSize: 13 }}>+ Stock In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(p)} style={[styles.iconBtn, { backgroundColor: t.surfaceAlt }]}>
                <Icon name="trash" size={15} color={t.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      <BottomModal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Product" t={t}>
        <View style={[styles.idModeBox, { backgroundColor: t.surfaceAlt }]}>
          <Text style={{ fontSize: 12, color: t.textSec, marginBottom: 8, fontWeight: '600' }}>Product ID Mode</Text>
          <View style={[styles.segment, { backgroundColor: t.border }]}>
            {['Auto', 'Manual'].map((m) => {
              const active = m === 'Auto' ? autoId : !autoId;
              return (
                <TouchableOpacity key={m} onPress={() => setAutoId(m === 'Auto')} style={[styles.segmentBtn, active && { backgroundColor: t.accent }]}>
                  <Text style={{ color: active ? '#fff' : t.textSec, fontSize: 12, fontWeight: '600' }}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={{ fontSize: 11, color: t.textMuted, marginTop: 8 }}>
            {autoId ? 'Auto: generated on save' : 'Enter your custom product code below'}
          </Text>
          {!autoId && (
            <View style={{ marginTop: 10 }}>
              <FormField t={t} label="" value={form.id} onChangeText={(v) => setForm({ ...form, id: v })} placeholder="e.g. PRD-0099 or SKU-001" />
            </View>
          )}
        </View>

        <FormField t={t} label="Product Name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. USB-C Cable 2m" />
        <FormField t={t} label="Brand Name" value={form.brand} onChangeText={(v) => setForm({ ...form, brand: v })} placeholder="e.g. Samsung, Apple, Generic" />
        <FormField t={t} label="Category" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} placeholder="e.g. Electronics" />
        <FormField t={t} label="Initial Quantity" value={form.qty} onChangeText={(v) => setForm({ ...form, qty: v })} placeholder="0" keyboardType="numeric" />
        <FormField t={t} label={`Buy / Cost Price (${currency})`} value={form.buyPrice} onChangeText={(v) => setForm({ ...form, buyPrice: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label={`Sell Price (${currency})`} value={form.sellPrice} onChangeText={(v) => setForm({ ...form, sellPrice: v })} placeholder="0.00" keyboardType="decimal-pad" />
        <FormField t={t} label="Min Stock Warning" value={form.minStock} onChangeText={(v) => setForm({ ...form, minStock: v })} placeholder="10" keyboardType="numeric" />
        <FormField t={t} label="Supplier" value={form.supplier} onChangeText={(v) => setForm({ ...form, supplier: v })} placeholder="Supplier name" />
        <FormField t={t} label="Storage Location" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} placeholder="e.g. A1-01" />
        <FormField t={t} label="📅 Purchase Date (YYYY-MM-DD)" value={form.purchaseDate} onChangeText={(v) => setForm({ ...form, purchaseDate: v })} placeholder={todayISO()} />

        <PrimaryButton t={t} label="Add Product" onPress={submitAdd} style={{ marginTop: 4 }} />
      </BottomModal>

      <BottomModal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit: ${editTarget?.name || ''}`} t={t}>
        {editForm && (
          <>
            <Text style={{ color: t.textSec, fontSize: 13, marginBottom: 16 }}>
              ID: <Text style={{ color: t.accent, fontWeight: '700' }}>{editForm.id}</Text>
            </Text>
            <FormField t={t} label="Name" value={editForm.name} onChangeText={(v) => setEditForm({ ...editForm, name: v })} />
            <FormField t={t} label="Brand" value={editForm.brand} onChangeText={(v) => setEditForm({ ...editForm, brand: v })} />
            <FormField t={t} label="Category" value={editForm.category} onChangeText={(v) => setEditForm({ ...editForm, category: v })} />
            <FormField t={t} label="Qty" value={editForm.qty} onChangeText={(v) => setEditForm({ ...editForm, qty: v })} keyboardType="numeric" />
            <FormField t={t} label="Buy Price" value={editForm.buyPrice} onChangeText={(v) => setEditForm({ ...editForm, buyPrice: v })} keyboardType="decimal-pad" />
            <FormField t={t} label="Sell Price" value={editForm.sellPrice} onChangeText={(v) => setEditForm({ ...editForm, sellPrice: v })} keyboardType="decimal-pad" />
            <FormField t={t} label="Min Stock" value={editForm.minStock} onChangeText={(v) => setEditForm({ ...editForm, minStock: v })} keyboardType="numeric" />
            <FormField t={t} label="Supplier" value={editForm.supplier} onChangeText={(v) => setEditForm({ ...editForm, supplier: v })} />
            <FormField t={t} label="Location" value={editForm.location} onChangeText={(v) => setEditForm({ ...editForm, location: v })} />
            <FormField t={t} label="Purchase Date" value={editForm.purchaseDate} onChangeText={(v) => setEditForm({ ...editForm, purchaseDate: v })} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <TouchableOpacity onPress={() => setEditTarget(null)} style={[styles.cancelBtn, { backgroundColor: t.surfaceAlt }]}>
                <Text style={{ color: t.text, fontWeight: '700', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitEdit} style={[styles.saveBtn, { backgroundColor: t.accent }]}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomModal>

      <BottomModal open={!!stockInTarget} onClose={() => setStockInTarget(null)} title={`Stock In: ${stockInTarget?.name || ''}`} t={t}>
        <FormField t={t} label="Quantity to add" value={stockInQty} onChangeText={setStockInQty} placeholder="e.g. 20" keyboardType="numeric" />
        <PrimaryButton t={t} label="Add to Stock" onPress={submitStockIn} />
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  addBtn: { borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  filterRow: { marginTop: 12, marginBottom: 14 },
  countText: { fontSize: 12, marginBottom: 10 },
  productTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  idBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  productName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  brandBadge: { fontSize: 11, fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 1, borderRadius: 6, marginBottom: 3, overflow: 'hidden' },
  metaText: { fontSize: 12, marginTop: 2 },
  metaMuted: { fontSize: 11, marginTop: 2 },
  qtyText: { fontSize: 18, fontWeight: '800' },
  priceRow: { flexDirection: 'row', gap: 10, marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  priceCell: { flex: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  priceLabel: { fontSize: 10 },
  priceValue: { fontSize: 13, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  iconBtn: { borderRadius: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  idModeBox: { borderRadius: 12, padding: 12, marginBottom: 14 },
  segment: { flexDirection: 'row', borderRadius: 8, padding: 2 },
  segmentBtn: { flex: 1, borderRadius: 6, paddingVertical: 6, alignItems: 'center' },
  cancelBtn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  saveBtn: { flex: 2, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
});
