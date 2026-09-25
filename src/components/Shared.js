import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { Sparkline } from './Charts';

export function StatusBadge({ status, t }) {
  const cfg = {
    in_stock: { label: 'In Stock', bg: t.successLight, color: t.success },
    low_stock: { label: 'Low Stock', bg: t.warningLight, color: t.warning },
    out_of_stock: { label: 'Out of Stock', bg: t.dangerLight, color: t.danger },
  }[status] || { label: status, bg: t.surfaceAlt, color: t.textSec };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

export function Card({ children, style, t }) {
  return (
    <View style={[{ backgroundColor: t.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: t.border }, style]}>
      {children}
    </View>
  );
}

export function MetricCard({ label, value, sub, icon, color, colorLight, sparkData, t }) {
  return (
    <Card t={t} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIconWrap, { backgroundColor: colorLight }]}>
          <Icon name={icon} size={18} color={color} />
        </View>
        {sparkData && <Sparkline data={sparkData} color={color} width={60} height={28} />}
      </View>
      <Text style={[styles.metricValue, { color: t.text }]} numberOfLines={1}>{value}</Text>
      <Text style={[styles.metricLabel, { color: t.textSec }]}>{label}</Text>
      {sub ? <Text style={[styles.metricSub, { color }]}>{sub}</Text> : null}
    </Card>
  );
}

export function SearchBar({ value, onChange, placeholder, t }) {
  return (
    <View style={[styles.searchWrap, { backgroundColor: t.input, borderColor: t.border }]}>
      <Icon name="search" size={17} color={t.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={t.textMuted}
        style={[styles.searchInput, { color: t.text }]}
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Text style={{ color: t.textMuted, fontSize: 14 }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function FilterChip({ label, active, onPress, t }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? t.accent : t.surfaceAlt }]}
    >
      <Text style={[styles.chipText, { color: active ? '#fff' : t.textSec }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function FormField({ label, value, onChangeText, placeholder, t, keyboardType, multiline }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.fieldLabel, { color: t.textSec }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.fieldInput,
          { backgroundColor: t.input, borderColor: t.border, color: t.text },
          multiline && { height: 80, textAlignVertical: 'top', paddingTop: 10 },
        ]}
      />
    </View>
  );
}

export function PrimaryButton({ label, onPress, t, style, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, { backgroundColor: t.accent, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle({ children, t, style }) {
  return <Text style={[styles.sectionTitle, { color: t.text }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '700' },
  metricCard: { flexBasis: '48%', flexGrow: 1, minWidth: 140 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  metricIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  metricLabel: { fontSize: 12, marginTop: 2 },
  metricSub: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginRight: 8 },
  chipText: { fontSize: 12, fontWeight: '600' },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  fieldInput: { width: '100%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, fontSize: 14 },
  primaryBtn: { width: '100%', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
});
