import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';

export function Sparkline({ data, color, height = 40, width = 120 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} fillOpacity="0.15" stroke="none" />
    </Svg>
  );
}

export function BarChart({ data, labels, colors, height = 120, t }) {
  const max = Math.max(...data) || 1;
  return (
    <View style={[styles.barRow, { height }]}>
      {data.map((v, i) => (
        <View key={i} style={styles.barCol}>
          <View style={styles.barTrack}>
            <View
              style={{
                width: '100%',
                height: `${Math.max((v / max) * 100, 3)}%`,
                backgroundColor: colors[i % colors.length],
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
          </View>
          {labels && <Text style={[styles.barLabel, { color: t.textMuted }]}>{labels[i]}</Text>}
        </View>
      ))}
    </View>
  );
}

export function DonutChart({ data, colors, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const radius = 45;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * radius;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const rotation = cumulative * 360;
    cumulative += pct;
    return { ...d, pct, rotation, color: colors[i % colors.length] };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      {segments.map((s, i) => (
        <Circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={s.color}
          strokeWidth="18"
          strokeDasharray={`${circumference * s.pct} ${circumference * (1 - s.pct)}`}
          strokeLinecap="butt"
          origin={`${cx}, ${cy}`}
          rotation={s.rotation - 90}
        />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  barRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingHorizontal: 4 },
  barCol: { flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: '100%', flex: 1, justifyContent: 'flex-end' },
  barLabel: { fontSize: 9, textAlign: 'center' },
});
