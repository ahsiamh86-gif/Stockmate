import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Shared';
import { BarChart, DonutChart, Sparkline } from '../components/Charts';
import { fmt } from '../utils/format';
import { MONTHLY_PROFIT, MONTHLY_LABELS, CATEGORY_DATA } from '../data/mockData';

export default function AnalyticsScreen() {
  const { t, currency } = useApp();

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: t.text }]}>Analytics</Text>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text, marginBottom: 4 }]}>Annual Revenue</Text>
        <Text style={{ fontSize: 11, color: t.textSec, marginBottom: 12 }}>Jan–Dec 2026</Text>
        <BarChart data={MONTHLY_PROFIT} labels={MONTHLY_LABELS} colors={t.chartBar} height={110} t={t} />
      </Card>

      <View style={styles.row}>
        <Card t={t} style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: t.textSec, marginBottom: 4 }}>Best Seller</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>USB-C Cable</Text>
          <Text style={{ fontSize: 11, color: t.success, marginTop: 2, fontWeight: '600' }}>142 sold this month</Text>
          <View style={{ marginTop: 8 }}>
            <Sparkline data={[20, 35, 28, 45, 38, 52, 48, 61, 55, 72, 68, 80]} color={t.success} width={100} height={35} />
          </View>
        </Card>
        <Card t={t} style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: t.textSec, marginBottom: 4 }}>Best Margin</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>Desk Lamp</Text>
          <Text style={{ fontSize: 11, color: t.accent, marginTop: 2, fontWeight: '600' }}>64% profit margin</Text>
          <View style={{ marginTop: 8 }}>
            <Sparkline data={[60, 62, 61, 63, 64, 63, 65, 64, 66, 65, 64, 64]} color={t.accent} width={100} height={35} />
          </View>
        </Card>
      </View>

      <Card t={t} style={{ marginBottom: 14, marginTop: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Category Performance</Text>
        <View style={styles.donutRow}>
          <DonutChart data={CATEGORY_DATA} colors={t.chartBar} size={120} />
          <View style={{ flex: 1 }}>
            {CATEGORY_DATA.map((d, i) => (
              <View key={d.name} style={{ marginBottom: 8 }}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontSize: 11, color: t.textSec }}>{d.name}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: t.text }}>{d.value}%</Text>
                </View>
                <View style={[styles.barTrack, { backgroundColor: t.surfaceAlt }]}>
                  <View style={{ backgroundColor: t.chartBar[i], borderRadius: 4, height: 6, width: `${d.value}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <Card t={t}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Key Metrics</Text>
        {[
          { label: 'Average Order Value', value: fmt(37.5, currency), trend: '+5.2%', up: true },
          { label: 'Inventory Turnover', value: '4.2x/month', trend: '+0.3x', up: true },
          { label: 'Gross Profit Margin', value: '48.6%', trend: '-1.2%', up: false },
          { label: 'Stock-out Rate', value: '3.1%', trend: '-0.8%', up: true },
        ].map((m) => (
          <View key={m.label} style={[styles.metricRow, { borderBottomColor: t.border }]}>
            <Text style={{ fontSize: 13, color: t.textSec }}>{m.label}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{m.value}</Text>
              <Text style={{ fontSize: 11, color: m.up ? t.success : t.danger, fontWeight: '600' }}>{m.trend}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, paddingVertical: 16 },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10 },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  barTrack: { borderRadius: 4, height: 6 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1 },
});
