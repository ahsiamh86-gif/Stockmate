import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, MetricCard } from '../components/Shared';
import { BarChart, DonutChart } from '../components/Charts';
import { fmt } from '../utils/format';
import { WEEKLY_SALES, WEEKLY_LABELS, CATEGORY_DATA } from '../data/mockData';

export default function DashboardScreen({ navigation }) {
  const { t, currency, products, sales } = useApp();

  const lowStock = products.filter((p) => p.status === 'low_stock').length;
  const outOfStock = products.filter((p) => p.status === 'out_of_stock').length;
  const totalValue = products.reduce((s, p) => s + p.qty * p.buyPrice, 0);
  const latestDate = sales[0]?.date;
  const todaySales = sales.filter((s) => s.date === latestDate).reduce((s, x) => s + x.total, 0);
  const todayProfit = sales.filter((s) => s.date === latestDate).reduce((s, x) => s + x.profit, 0);

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: t.textSec }]}>Good morning 👋</Text>
          <Text style={[styles.title, { color: t.text }]}>Dashboard</Text>
        </View>
        <View>
          <TouchableOpacity style={[styles.bellBtn, { backgroundColor: t.surfaceAlt, borderColor: t.border }]}>
            <Icon name="bell" size={18} color={t.text} />
          </TouchableOpacity>
          <View style={[styles.badge, { backgroundColor: t.danger }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      {(lowStock > 0 || outOfStock > 0) && (
        <View style={[styles.alertBanner, { backgroundColor: t.warningLight, borderColor: t.warning }]}>
          <Icon name="warning" size={17} color={t.warning} />
          <Text style={[styles.alertText, { color: t.warning }]}>
            {outOfStock} out of stock · {lowStock} low stock items need attention
          </Text>
        </View>
      )}

      <View style={styles.metricGrid}>
        <MetricCard t={t} label="Total Products" value={String(products.length)} icon="inventory" color={t.accent} colorLight={t.accentLight} sparkData={[3, 5, 4, 7, 6, 8, 9]} />
        <MetricCard t={t} label="Today's Sales" value={fmt(todaySales, currency)} sub="+12.4% vs yesterday" icon="sales" color={t.success} colorLight={t.successLight} sparkData={[42, 58, 71, 63, 89, 95, 77]} />
        <MetricCard t={t} label="Today's Profit" value={fmt(todayProfit, currency)} sub="+8.1% margin" icon="trend" color={t.purple} colorLight={t.purpleLight} sparkData={[21, 34, 28, 45, 39, 52, 43]} />
        <MetricCard t={t} label="Inventory Value" value={fmt(totalValue / 1000, currency).replace(/\.\d+$/, '') + 'k'} icon="box" color={t.warning} colorLight={t.warningLight} sparkData={[90, 95, 92, 97, 98, 96, 99]} />
      </View>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Stock Status Overview</Text>
        <View style={styles.statusRow}>
          {[
            { label: 'In Stock', count: products.filter((p) => p.status === 'in_stock').length, color: t.success, bg: t.successLight },
            { label: 'Low Stock', count: lowStock, color: t.warning, bg: t.warningLight },
            { label: 'Out of Stock', count: outOfStock, color: t.danger, bg: t.dangerLight },
          ].map((s) => (
            <View key={s.label} style={[styles.statusCell, { backgroundColor: s.bg }]}>
              <Text style={[styles.statusCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.statusLabel, { color: s.color }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: t.text, marginBottom: 0 }]}>Weekly Sales</Text>
          <Text style={{ fontSize: 11, color: t.accent, fontWeight: '600' }}>This Week</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <BarChart data={WEEKLY_SALES} labels={WEEKLY_LABELS} colors={t.chartBar} height={90} t={t} />
        </View>
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Category Breakdown</Text>
        <View style={styles.donutRow}>
          <DonutChart data={CATEGORY_DATA} colors={t.chartBar} size={110} />
          <View style={{ flex: 1 }}>
            {CATEGORY_DATA.map((d, i) => (
              <View key={d.name} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: t.chartBar[i] }]} />
                  <Text style={{ fontSize: 12, color: t.textSec }}>{d.name}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: t.text }}>{d.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <Card t={t}>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: t.text, marginBottom: 0 }]}>Recent Sales</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Sales')}>
            <Text style={{ fontSize: 12, color: t.accent, fontWeight: '600' }}>View All</Text>
          </TouchableOpacity>
        </View>
        {sales.slice(0, 3).map((s) => (
          <View key={s.id} style={[styles.saleRow, { borderBottomColor: t.border }]}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: t.text }}>{s.product}</Text>
              <Text style={{ fontSize: 11, color: t.textSec }}>Qty: {s.qty} · {s.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{fmt(s.total, currency)}</Text>
              <Text style={{ fontSize: 11, color: t.success, fontWeight: '600' }}>+{fmt(s.profit, currency)}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  greeting: { fontSize: 12, fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  bellBtn: { borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  badge: { position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  alertBanner: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertText: { fontSize: 13, fontWeight: '600', flex: 1 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusCell: { flex: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  statusCount: { fontSize: 22, fontWeight: '800' },
  statusLabel: { fontSize: 11, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  saleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
});
