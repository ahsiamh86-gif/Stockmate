import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import { Card, PrimaryButton } from '../components/Shared';
import BottomModal from '../components/BottomModal';
import { BACKUP_HISTORY } from '../data/mockData';

const STAGES = ['Preparing data…', 'Encrypting…', 'Uploading to Drive…', 'Verifying…', 'Complete!'];

export default function BackupScreen() {
  const { t } = useApp();
  const [connected, setConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const [backing, setBacking] = useState(false);
  const [backupDone, setBackupDone] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [history, setHistory] = useState(BACKUP_HISTORY);
  const [restoreModal, setRestoreModal] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const timerRef = useRef(null);

  const runBackup = () => {
    setBacking(true);
    setBackupDone(false);
    setProgress(0);
    setStage(STAGES[0]);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 4;
        const stageIdx = Math.min(Math.floor(next / 25), 4);
        setStage(STAGES[stageIdx]);
        if (next >= 100) {
          clearInterval(timerRef.current);
          setBacking(false);
          setBackupDone(true);
          const now = new Date();
          setHistory((h) => [
            { id: `BK-${String(h.length + 1).padStart(3, '0')}`, date: now.toISOString().split('T')[0], time: now.toTimeString().slice(0, 5), size: '2.5 MB', items: 8, status: 'success', label: 'Manual Backup' },
            ...h,
          ]);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  const runRestore = () => {
    setRestoreModal(false);
    setConfirmTarget(null);
    setRestoring(true);
    setTimeout(() => setRestoring(false), 1800);
  };

  const connectDrive = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setConnectModal(false);
    }, 1800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: t.text }]}>Cloud Backup</Text>

        <Card t={t} style={{ marginBottom: 14, backgroundColor: connected ? t.accentLight : t.surfaceAlt }}>
          <View style={styles.driveRow}>
            <View style={styles.driveIconWrap}>
              <Text style={{ fontSize: 28 }}>☁️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: t.text }}>Google Drive</Text>
              {connected ? (
                <>
                  <Text style={{ fontSize: 12, color: t.textSec }}>stockmate-backup@gmail.com</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: t.success }]} />
                    <Text style={{ fontSize: 11, color: t.success, fontWeight: '700' }}>Connected · 14.2 GB free</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 12, color: t.textSec }}>Not connected</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: t.danger }]} />
                    <Text style={{ fontSize: 11, color: t.danger, fontWeight: '700' }}>Disconnected</Text>
                  </View>
                </>
              )}
            </View>
            {connected ? (
              <TouchableOpacity onPress={() => setConnected(false)} style={[styles.smallBtn, { backgroundColor: t.dangerLight }]}>
                <Text style={{ color: t.danger, fontSize: 11, fontWeight: '700' }}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setConnectModal(true)} style={[styles.smallBtn, { backgroundColor: t.accent }]}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        <View style={[styles.secureBanner, { backgroundColor: t.successLight }]}>
          <Icon name="shieldCheck" size={16} color={t.success} />
          <Text style={{ fontSize: 12, color: t.success, fontWeight: '600', flex: 1 }}>End-to-end encrypted · AES-256 · Data stored only in your Drive</Text>
        </View>

        {connected && (
          <>
            {backing ? (
              <Card t={t} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.text, marginBottom: 8 }}>{stage}</Text>
                <View style={[styles.progressTrack, { backgroundColor: t.surfaceAlt }]}>
                  <View style={[styles.progressFill, { backgroundColor: t.accent, width: `${progress}%` }]} />
                </View>
                <Text style={{ fontSize: 11, color: t.textSec, marginTop: 6 }}>{progress}%</Text>
              </Card>
            ) : (
              <PrimaryButton t={t} label={backupDone ? '✓ Backup Complete — Run Again' : 'Backup Now'} onPress={runBackup} style={{ marginBottom: 14 }} />
            )}
            <TouchableOpacity onPress={() => setRestoreModal(true)} style={[styles.restoreBtn, { backgroundColor: t.surfaceAlt, borderColor: t.border }]}>
              <Icon name="restore" size={16} color={t.text} />
              <Text style={{ color: t.text, fontWeight: '700', fontSize: 14 }}>Restore from Backup</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={[styles.autoRow, { borderBottomColor: t.border }]}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: t.text }}>Auto Backup</Text>
            <Text style={{ fontSize: 11, color: t.textSec }}>Back up automatically every day</Text>
          </View>
          <TouchableOpacity onPress={() => setAutoBackup(!autoBackup)} style={[styles.toggle, { backgroundColor: autoBackup ? t.accent : t.surfaceAlt }]}>
            <View style={[styles.knob, { left: autoBackup ? 25 : 3 }]} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: t.text, marginTop: 18 }]}>Backup History</Text>
        {history.map((b) => (
          <Card key={b.id} t={t} style={{ marginBottom: 10 }}>
            <View style={styles.historyRow}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{b.label}</Text>
                <Text style={{ fontSize: 11, color: t.textSec }}>{b.date} · {b.time} · {b.size} · {b.items} items</Text>
              </View>
              <View style={[styles.successPill, { backgroundColor: t.successLight }]}>
                <Text style={{ color: t.success, fontSize: 11, fontWeight: '700' }}>Success</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      <BottomModal open={connectModal} onClose={() => setConnectModal(false)} title="Connect Google Drive" t={t}>
        <Text style={{ color: t.textSec, fontSize: 13, marginBottom: 20 }}>
          Sign in with Google to securely back up your business data to your own Drive storage.
        </Text>
        <PrimaryButton t={t} label={connecting ? 'Connecting…' : 'Sign in with Google'} onPress={connectDrive} disabled={connecting} />
      </BottomModal>

      <BottomModal open={restoreModal} onClose={() => setRestoreModal(false)} title="Choose a Backup" t={t}>
        {history.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setConfirmTarget(b)} style={[styles.restoreItem, { borderColor: t.border }]}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{b.label}</Text>
            <Text style={{ fontSize: 11, color: t.textSec }}>{b.date} · {b.time} · {b.size}</Text>
          </TouchableOpacity>
        ))}
      </BottomModal>

      <BottomModal open={!!confirmTarget} onClose={() => setConfirmTarget(null)} title="Confirm Restore" t={t}>
        <Text style={{ color: t.textSec, fontSize: 13, marginBottom: 20 }}>
          This will overwrite current data on this device with the backup from {confirmTarget?.date}. This cannot be undone.
        </Text>
        <PrimaryButton t={t} label={restoring ? 'Restoring…' : 'Restore Now'} onPress={runRestore} disabled={restoring} />
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, paddingVertical: 16 },
  driveRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  driveIconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  smallBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  secureBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  restoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingVertical: 13, marginBottom: 14 },
  autoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  toggle: { width: 48, height: 26, borderRadius: 13, justifyContent: 'center' },
  knob: { width: 20, height: 20, backgroundColor: '#fff', borderRadius: 10, position: 'absolute' },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  successPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  restoreItem: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
});
