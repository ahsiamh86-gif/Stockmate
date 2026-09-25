import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FormField } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { BarChart } from '../components/Charts';
import { fmt, CURRENCY_SYMBOLS } from '../utils/format';
import { MONTHLY_PROFIT, MONTHLY_LABELS } from '../data/mockData';

export default function SalesScreen() {
  const { t, currency, sales, products, recordSale } = useApp();
  const [tab, setTab] = useState('history');
  const [saleModal, setSaleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(() => products.find((p) => p.qty > 0) || products[0]);
  const [saleQty, setSaleQty] = useState(1);
  const [sellPrice, setSellPrice] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const totalToday = sales.filter((s) => s.date === (sales[0]?.date)).reduce((s, x) => s + x.total, 0);
  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);

  const parsedSellPrice = parseFloat(sellPrice) || 0;
  const profit = selectedProduct ? (parsedSellPrice - selectedProduct.buyPrice) * saleQty : 0;
  const total = parsedSellPrice * saleQty;
  const margin = selectedProduct && parsedSellPrice > 0 ? (((parsedSellPrice - selectedProduct.buyPrice) / parsedSellPrice) * 100).toFixed(1) : '—';
  const isProfitable = selectedProduct ? parsedSellPrice > selectedProduct.buyPrice : false;

  const closeSaleModal = () => {
    setSaleModal(false);
    setSellPrice('');
    setSaleQty(1);
  };

  const confirmSale = () => {
    if (!selectedProduct || parsedSellPrice <= 0) return;
    recordSale({ product: selectedProduct, qty: saleQty, sellPrice: parsedSellPrice });
    closeSaleModal();
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: t.text }]}>Sales</Text>
          <TouchableOpacity onPress={() => setSaleModal(true)} style={[styles.newSaleBtn, { backgroundColor: t.success }]}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.newSaleText}>New Sale</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Latest Day', value: fmt(totalToday, currency), color: t.success },
            { label: 'All Revenue', value: fmt(totalRevenue, currency), color: t.accent },
            { label: 'All Profit', value: fmt(totalProfit, currency), color: t.purple },
          ].map((s) => (
            <View key={s.label} style={[styles.statCell, { backgroundColor: t.surfaceAlt }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: t.textSec }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.tabBar, { backgroundColor: t.surfaceAlt }]}>
          {['history', 'profit'].map((tabKey) => (
            <TouchableOpacity
              key={tabKey}
              onPress={() => setTab(tabKey)}
              style={[styles.tabBtn, tab === tabKey && { backgroundColor: t.card }]}
            >
              <Text style={{ color: tab === tabKey ? t.text : t.textSec, fontWeight: tab === tabKey ? '700' : '500', fontSize: 13 }}>
                {tabKey === 'history' ? 'Sales History' : 'Profit Report'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'history' ? (
          sales.map((s) => (
            <Card key={s.id} t={t} style={{ marginBottom: 10 }}>
              <View style={styles.saleTop}>
                <View>
                  <Text style={[styles.idBadge, { color: t.accent, backgroundColor: t.accentLight }]}>{s.id}</Text>
                  <Text style={[styles.saleProduct, { color: t.text }]}>{s.product}</Text>
                  <Text style={{ fontSize: 12, color: t.textSec }}>{s.date} · Qty: {s.qty}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: t.text }}>{fmt(s.total, currency)}</Text>
                  <Text style={{ fontSize: 12, color: t.success, fontWeight: '600' }}>Profit: +{fmt(s.profit, currency)}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <>
            <Card t={t} style={{ marginBottom: 14 }}>
              <Text style={[styles.cardTitle, { color: t.text }]}>Monthly Profit</Text>
              <BarChart data={MONTHLY_PROFIT} labels={MONTHLY_LABELS} colors={t.chartBar} height={100} t={t} />
            </Card>
            <Card t={t}>
              <Text style={[styles.cardTitle, { color: t.text }]}>Profit Summary</Text>
              {[
                { label: "Total Records", value: String(sales.length), color: t.success },
                { label: 'Total Revenue', value: fmt(totalRevenue, currency), color: t.accent },
                { label: 'Total Profit', value: fmt(totalProfit, currency), color: t.purple },
                { label: 'Avg Margin', value: totalRevenue ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '—', color: t.warning },
              ].map((s) => (
                <View key={s.label} style={[styles.summaryRow, { borderBottomColor: t.border }]}>
                  <Text style={{ fontSize: 13, color: t.textSec }}>{s.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: s.color }}>{s.value}</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>

      <BottomModal open={saleModal} onClose={closeSaleModal} title="Record New Sale" t={t}>
        <Text style={[styles.fieldLabel, { color: t.textSec }]}>Select Product</Text>
        <TouchableOpacity onPress={() => setPickerOpen(true)} style={[styles.selectBox, { backgroundColor: t.input, borderColor: t.border }]}>
          <Text style={{ color: t.text, fontSize: 14 }}>
            {selectedProduct ? `${selectedProduct.brand ? `[${selectedProduct.brand}] ` : ''}${selectedProduct.name} (Stock: ${selectedProduct.qty})` : 'Select a product'}
          </Text>
        </TouchableOpacity>

        {pickerOpen && (
          <View style={[styles.pickerList, { backgroundColor: t.surfaceAlt, borderColor: t.border }]}>
            {products.map((p) => (
              <TouchableOpacity
                key={p.id}
                disabled={p.qty === 0}
                onPress={() => { setSelectedProduct(p); setSellPrice(''); setPickerOpen(false); }}
                style={styles.pickerRow}
              >
                <Text style={{ color: p.qty === 0 ? t.textMuted : t.text, fontSize: 13 }}>
                  {p.qty === 0 ? '🚫 ' : ''}{p.brand ? `[${p.brand}] ` : ''}{p.name} {p.qty === 0 ? '(No Stock)' : `(Stock: ${p.qty})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.pill, { backgroundColor: t.surfaceAlt }]}>
          <Text style={{ fontSize: 12, color: t.textSec }}>Cost / Buy Price</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{fmt(selectedProduct?.buyPrice || 0, currency)}</Text>
        </View>

        <Text style={[styles.fieldLabel, { color: t.textSec }]}>
          Selling Price <Text style={{ color: t.accent }}>(this sale)</Text>
        </Text>
        <View style={styles.priceInputWrap}>
          <Text style={[styles.currencyPrefix, { color: t.textSec }]}>{CURRENCY_SYMBOLS[currency] || '$'}</Text>
          <TextInput
            value={sellPrice}
            onChangeText={setSellPrice}
            placeholder={selectedProduct ? `e.g. ${(selectedProduct.buyPrice * 1.4).toFixed(2)}` : '0.00'}
            placeholderTextColor={t.textMuted}
            keyboardType="decimal-pad"
            style={[
              styles.priceInput,
              { backgroundColor: t.input, color: t.text, borderColor: parsedSellPrice === 0 ? t.border : isProfitable ? t.success : t.danger },
            ]}
          />
        </View>
        {parsedSellPrice > 0 && (
          <Text style={{ alignSelf: 'flex-end', fontSize: 11, fontWeight: '700', color: isProfitable ? t.success : t.danger, marginBottom: 10 }}>
            {isProfitable ? `+${margin}% margin` : 'Below cost!'}
          </Text>
        )}

        <Text style={[styles.fieldLabel, { color: t.textSec }]}>Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => setSaleQty(Math.max(1, saleQty - 1))} style={[styles.qtyBtn, { backgroundColor: t.surfaceAlt, borderColor: t.border }]}>
            <Text style={{ fontSize: 20, color: t.text }}>−</Text>
          </TouchableOpacity>
          <TextInput
            value={String(saleQty)}
            onChangeText={(v) => setSaleQty(Math.max(1, parseInt(v) || 1))}
            keyboardType="number-pad"
            style={[styles.qtyInput, { backgroundColor: t.input, borderColor: t.border, color: t.text }]}
          />
          <TouchableOpacity onPress={() => setSaleQty(saleQty + 1)} style={[styles.qtyBtn, { backgroundColor: t.surfaceAlt, borderColor: t.border }]}>
            <Text style={{ fontSize: 20, color: t.text }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryBox, { backgroundColor: parsedSellPrice > 0 ? (isProfitable ? t.successLight : t.dangerLight) : t.surfaceAlt }]}>
          <Text style={[styles.cardTitle, { color: t.text }]}>Sale Summary</Text>
          {[
            { label: 'Cost Price (unit)', value: fmt(selectedProduct?.buyPrice || 0, currency), color: t.textSec },
            { label: 'Sell Price (unit)', value: parsedSellPrice > 0 ? fmt(parsedSellPrice, currency) : '—', color: t.text },
            { label: 'Quantity', value: String(saleQty), color: t.text },
            { label: 'Total Revenue', value: parsedSellPrice > 0 ? fmt(total, currency) : '—', color: t.accent },
            { label: 'Profit / Loss', value: parsedSellPrice > 0 ? (profit >= 0 ? '+' : '') + fmt(profit, currency) : '—', color: profit >= 0 ? t.success : t.danger },
          ].map((row) => (
            <View key={row.label} style={styles.summaryLine}>
              <Text style={{ fontSize: 13, color: t.textSec }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: row.color }}>{row.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          disabled={parsedSellPrice <= 0}
          onPress={confirmSale}
          style={[styles.confirmBtn, { backgroundColor: parsedSellPrice <= 0 ? t.surfaceAlt : isProfitable ? t.success : t.danger }]}
        >
          <Text style={{ color: parsedSellPrice <= 0 ? t.textMuted : '#fff', fontSize: 15, fontWeight: '700' }}>
            {parsedSellPrice <= 0 ? 'Enter selling price to continue' : `Confirm Sale · ${fmt(total, currency)}`}
          </Text>
        </TouchableOpacity>
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  newSaleBtn: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  newSaleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCell: { flex: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 3, marginBottom: 14 },
  tabBtn: { flex: 1, borderRadius: 9, paddingVertical: 9, alignItems: 'center' },
  saleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4, overflow: 'hidden' },
  saleProduct: { fontSize: 15, fontWeight: '700' },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  selectBox: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 10 },
  pickerList: { borderRadius: 10, borderWidth: 1, marginBottom: 14, maxHeight: 180 },
  pickerRow: { paddingHorizontal: 12, paddingVertical: 10 },
  pill: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceInputWrap: { position: 'relative', justifyContent: 'center' },
  currencyPrefix: { position: 'absolute', left: 12, zIndex: 1, fontSize: 15, fontWeight: '700' },
  priceInput: { width: '100%', paddingLeft: 32, paddingRight: 12, paddingVertical: 12, borderRadius: 10, borderWidth: 2, fontSize: 16, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  qtyBtn: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyInput: { flex: 1, textAlign: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, fontSize: 18, fontWeight: '700' },
  summaryBox: { borderRadius: 12, padding: 14, marginBottom: 14 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  confirmBtn: { width: '100%', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
});
