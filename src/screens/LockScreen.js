import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'];

export default function LockScreen() {
  const { t, setLocked } = useApp();
  const [pin, setPin] = useState('');

  const append = (d) => {
    const next = pin + d;
    if (next.length <= 4) {
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          setPin('');
          setLocked(false);
        }, 300);
      }
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: t.bg }]}>
      <Text style={styles.lockEmoji}>🔒</Text>
      <Text style={[styles.title, { color: t.text }]}>StockMate</Text>
      <Text style={[styles.subtitle, { color: t.textSec }]}>Enter your PIN to continue</Text>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < pin.length ? t.accent : t.surfaceAlt,
                borderColor: i < pin.length ? t.accent : t.border,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.keypad}>
        {KEYS.map((d, i) => (
          <TouchableOpacity
            key={i}
            disabled={d === ''}
            onPress={() => (d === '⌫' ? setPin((p) => p.slice(0, -1)) : append(String(d)))}
            style={[styles.key, { backgroundColor: d === '' ? 'transparent' : t.surface, borderColor: d === '' ? 'transparent' : t.border }]}
          >
            <Text style={[styles.keyText, { color: t.text }]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => setLocked(false)} style={{ marginTop: 24 }}>
        <Text style={{ color: t.accent, fontSize: 14, fontWeight: '600' }}>Use fingerprint instead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  lockEmoji: { fontSize: 36, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 36 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 220, gap: 12, justifyContent: 'center' },
  key: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  keyText: { fontSize: 22, fontWeight: '700' },
});
