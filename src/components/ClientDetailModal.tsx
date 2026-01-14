import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Appointment, HairType } from '../types';
import { SwipeableModal } from './SwipeableModal';

interface ClientDetailModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onWhatsApp: () => void;
  onNoShow: () => void;
  onRebook: () => void;
}

const hairTypeLabels: Record<HairType, string> = {
  straight: 'Lisses',
  wavy: 'Ondulés',
  curly: 'Bouclés',
  coily: 'Crépus',
};

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  visible,
  onClose,
  appointment,
  onWhatsApp,
  onNoShow,
  onRebook,
}) => {
  const { colors } = useTheme();

  if (!appointment || !appointment.client) return null;

  const client = appointment.client;
  const isVIP = client.visitCount >= 10;
  const hasNoShowHistory = client.noShowCount > 0;

  const handleWhatsApp = () => {
    onClose();
    onWhatsApp();
  };

  const handleRebook = () => {
    onClose();
    onRebook();
  };

  return (
    <SwipeableModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        {/* Client header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { borderColor: colors.border, borderWidth: 1 }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {client.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>
                {client.name}
              </Text>
              {isVIP && (
                <View style={[styles.vipBadge, { backgroundColor: '#FFD700' }]}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={[styles.phone, { color: colors.textSecondary }]}>
              {client.phone}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { borderColor: colors.border, borderWidth: 1 }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {client.visitCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              visites
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[
              styles.statValue,
              { color: hasNoShowHistory ? colors.danger : colors.text }
            ]}>
              {client.noShowCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              no-shows
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {hairTypeLabels[client.hairType]}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              cheveux
            </Text>
          </View>
        </View>

        {/* Notes */}
        {client.notes && (
          <View style={[styles.notesSection, { borderColor: colors.border, borderWidth: 1 }]}>
            <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>
              NOTES
            </Text>
            <Text style={[styles.notes, { color: colors.text }]}>
              {client.notes}
            </Text>
          </View>
        )}

        {/* Warning */}
        {hasNoShowHistory && (
          <View style={[styles.warning, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Text style={[styles.warningText, { color: colors.danger }]}>
              ⚠ Attention : {client.noShowCount} no-show{client.noShowCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
            onPress={handleWhatsApp}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.buttonPrimary }]}
            onPress={handleRebook}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, { color: colors.buttonPrimaryText }]}>
              Re-booker
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.noShowBtn, { borderColor: colors.border, borderWidth: 1 }]}
          onPress={onNoShow}
          activeOpacity={0.7}
        >
          <Text style={[styles.noShowText, { color: colors.danger }]}>
            Marquer No-show
          </Text>
        </TouchableOpacity>
      </View>
    </SwipeableModal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '300',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.h2,
  },
  vipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  vipText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  phone: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statDivider: {
    width: 1,
  },
  statValue: {
    ...typography.h3,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.label,
  },
  notesSection: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notesLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  notes: {
    ...typography.body,
    fontStyle: 'italic',
  },
  warning: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  warningText: {
    ...typography.caption,
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    ...typography.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noShowBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  noShowText: {
    ...typography.body,
  },
});



