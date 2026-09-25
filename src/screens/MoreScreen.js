import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, FilterChip } from '../components/Shared';
import { THEMES } from '../theme/themes';

const QUICK_ACCESS = [
  [
    { label: 'Reports', sub: 'Revenue & profit', icon: 'analytics', colorKey: 'accent', bgKey: 'accentLight', route: 'Reports' },
    { label: 'Analytics', sub: 'Charts & trends', icon: 'trend', colorKey: 'purple', bgKey: 'purpleLight', route: 'Analytics' },
  ],
  [
    { label: 'Purchases', sub: 'Purchase history', icon: 'purchases', colorKey: 'warning', bgKey: 'warningLight', route: 'Purchases' },
    { label: 'Cloud Backup', sub: 'Google Drive sync', icon: 'cloudUpload', colorKey: 'success', bgKey: 'successLight', route: 'Backup' },
  ],
];

const WIDE_ITEMS = [
  { label: '💸 Expenses', sub: 'Track costs & see net profit', icon: 'receipt', colorKey: 'danger', bgKey: 'dangerLight', route: 'Expenses' },
  { label: '👥 Investors', sub: 'Manage partners & profit share', icon: 'trend', colorKey: 'purple', bgKey: 'purpleLight', route: 'Investors' },
  { label: '🏦 Loans', sub: 'Track bank & personal loans', icon: 'sales', colorKey: 'warning', bgKey: 'warningLight', route: 'Loans' },
  { label: '🤝 Money Lent', sub: 'Track money you gave out', icon: 'sales', colorKey: 'accent', bgKey: 'accentLight', route: 'LentMoney' },
];

export default function MoreScreen({ navigation }) {
  const { t, themeName, currency, setCurrency, pinEnabled, setPinEnabled, fingerprintEnabled, setFingerprintEnabled } = useApp();

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: t.text }]}>More</Text>

      <Card t={t} style={{ marginBottom: 14 }}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: t.accentLight }]}>
            <Text style={{ fontSize: 22 }}>🏪</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: t.text }}>My Business</Text>
            <Text style={{ fontSize: 12, color: t.textSec }}>owner@gmail.com</Text>
            <Text style={{ fontSize: 11, color: t.success, marginTop: 2 }}>● Local account active</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.editProfileBtn, { backgroundColor: t.accentLight, borderColor: t.accent + '33' }]}>
          <Text style={{ color: t.accent, fontWeight: '600', fontSize: 13 }}>Edit Business Profile</Text>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionLabel, { color: t.textMuted }]}>QUICK ACCESS</Text>
      {QUICK_ACCESS.map((rowItems, ri) => (
        <View key={ri} style={styles.gridRow}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigation.navigate(item.route)}
              style={[styles.gridCell, { backgroundColor: t[item.bgKey], borderColor: t[item.colorKey] + '33' }]}
            >
              <Icon name={item.icon} size={24} color={t[item.colorKey]} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: t[item.colorKey], marginTop: 6 }}>{item.label}</Text>
              <Text style={{ fontSize: 10, color: t[item.colorKey], opacity: 0.7, marginTop: 2 }}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {WIDE_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => navigation.navigate(item.route)}
          style={[styles.wideItem, { backgroundColor: t[item.bgKey], borderColor: t[item.colorKey] + '33' }]}
        >
          <Icon name={item.icon} size={22} color={t[item.colorKey]} />
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: t[item.colorKey] }}>{item.label}</Text>
            <Text style={{ fontSize: 10, color: t[item.colorKey], opacity: 0.7 }}>{item.sub}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Card t={t} style={{ marginTop: 4, marginBottom: 14 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ThemeSettings')} style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <View style={[styles.themePreview, { backgroundColor: THEMES[themeName].bg, borderColor: t.border }]}>
              <View style={{ height: 9, borderRadius: 3, backgroundColor: THEMES[themeName].accent }} />
              <View style={{ height: 5, borderRadius: 3, backgroundColor: THEMES[themeName].success, width: '70%', marginTop: 3 }} />
              <View style={{ height: 5, borderRadius: 3, backgroundColor: THEMES[themeName].warning, width: '50%', marginTop: 3 }} />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="palette" size={14} color={t.accent} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>Appearance & Theme</Text>
              </View>
              <Text style={{ fontSize: 12, color: t.accent, fontWeight: '600', marginTop: 2 }}>{THEMES[themeName].name}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 18, color: t.textSec }}>›</Text>
        </TouchableOpacity>
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon name="lock" size={16} color={t.accent} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>Security</Text>
        </View>
        {[
          { label: 'App Lock PIN', sub: 'Require PIN to open app', val: pinEnabled, set: setPinEnabled },
          { label: 'Fingerprint Unlock', sub: 'Use biometric authentication', val: fingerprintEnabled, set: setFingerprintEnabled },
        ].map((s) => (
          <View key={s.label} style={[styles.securityRow, { borderBottomColor: t.border }]}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: t.text }}>{s.label}</Text>
              <Text style={{ fontSize: 11, color: t.textSec }}>{s.sub}</Text>
            </View>
            <TouchableOpacity onPress={() => s.set(!s.val)} style={[styles.toggle, { backgroundColor: s.val ? t.accent : t.surfaceAlt }]}>
              <View style={[styles.knob, { left: s.val ? 25 : 3 }]} />
            </TouchableOpacity>
          </View>
        ))}
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Currency & Locale</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: t.textSec, marginBottom: 8 }}>Currency</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['USD', 'BDT'].map((c) => (
            <FilterChip key={c} label={c === 'USD' ? 'USD — US Dollar' : 'BDT — Bangladeshi Taka'} active={currency === c} onPress={() => setCurrency(c)} t={t} />
          ))}
        </View>
      </Card>

      <Card t={t}>
        <Text style={[styles.cardTitle, { color: t.text }]}>About</Text>
        {[
          { label: 'App Version', value: '1.0.0' },
          { label: 'Storage', value: 'On-device (AsyncStorage)' },
          { label: 'Architecture', value: 'Offline-First' },
          { label: 'Build', value: 'Expo / React Native' },
        ].map((i) => (
          <View key={i.label} style={[styles.aboutRow, { borderBottomColor: t.border }]}>
            <Text style={{ fontSize: 13, color: t.textSec }}>{i.label}</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: t.text }}>{i.value}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, paddingVertical: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  editProfileBtn: { borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  sectionLabel: { fontSize: 12, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  gridRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  gridCell: { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' },
  wideItem: { borderRadius: 14, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  themePreview: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 5, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  securityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  toggle: { width: 48, height: 26, borderRadius: 13, justifyContent: 'center' },
  knob: { width: 20, height: 20, backgroundColor: '#fff', borderRadius: 10, position: 'absolute' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
});
