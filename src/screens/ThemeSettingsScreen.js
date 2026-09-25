import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card } from '../components/Shared';
import { THEMES } from '../theme/themes';

export default function ThemeSettingsScreen({ navigation }) {
  const { t, themeName, setThemeName } = useApp();
  const isDark = themeName !== 'light';
  const current = THEMES[themeName];

  return (
    <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.surfaceAlt }]}>
          <Text style={{ color: t.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: t.text }]}>Appearance & Theme</Text>
      </View>

      <Card t={t} style={{ marginBottom: 14 }}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>🌙 Dark Mode</Text>
            <Text style={{ fontSize: 12, color: t.textSec, marginTop: 3 }}>{isDark ? 'Dark mode is ON' : 'Dark mode is OFF'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setThemeName(isDark ? 'light' : 'dark')}
            style={[styles.switch, { backgroundColor: isDark ? t.accent : t.border }]}
          >
            <View style={[styles.switchKnob, { left: isDark ? 25 : 3 }]}>
              <Text style={{ fontSize: 12 }}>{isDark ? '🌙' : '☀️'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Card>

      <Card t={t} style={{ marginBottom: 14 }}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Choose Theme</Text>
        <View style={{ gap: 10 }}>
          {Object.entries(THEMES).map(([key, theme]) => {
            const active = themeName === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setThemeName(key)}
                style={[
                  styles.themeRow,
                  { borderColor: active ? t.accent : t.border, borderWidth: active ? 2 : 1, backgroundColor: active ? t.accentLight : t.surfaceAlt },
                ]}
              >
                <View style={[styles.miniPreview, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <View style={{ height: 8, borderRadius: 3, backgroundColor: theme.accent }} />
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: theme.success, width: '70%', marginTop: 3 }} />
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: theme.warning, width: '50%', marginTop: 3 }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: t.text, marginBottom: 5 }}>{theme.name}</Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    {[theme.accent, theme.success, theme.warning, theme.danger, theme.purple].map((c, i) => (
                      <View key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c }} />
                    ))}
                  </View>
                </View>
                {active && (
                  <View style={[styles.checkCircle, { backgroundColor: t.accent }]}>
                    <Icon name="check" size={13} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card t={t}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Current Theme</Text>
        <View style={styles.currentRow}>
          <View style={[styles.currentPreview, { backgroundColor: current.bg, borderColor: t.accent }]}>
            <View style={{ height: 12, borderRadius: 4, backgroundColor: current.accent }} />
            <View style={{ height: 7, borderRadius: 4, backgroundColor: current.success, width: '70%', marginTop: 4 }} />
            <View style={{ height: 7, borderRadius: 4, backgroundColor: current.warning, width: '50%', marginTop: 4 }} />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: t.accent }}>{current.name}</Text>
            <Text style={{ fontSize: 12, color: t.textSec, marginTop: 3 }}>{isDark ? 'Dark theme' : 'Light theme'}</Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
              {[current.accent, current.success, current.warning, current.danger, current.purple].map((c, i) => (
                <View key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }} />
              ))}
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
  backBtn: { borderRadius: 10, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switch: { width: 52, height: 30, borderRadius: 15, justifyContent: 'center' },
  switchKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', position: 'absolute', top: 3, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 14 },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14 },
  miniPreview: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 4, justifyContent: 'center' },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  currentRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  currentPreview: { width: 56, height: 56, borderRadius: 14, borderWidth: 2, padding: 6, justifyContent: 'center' },
});
