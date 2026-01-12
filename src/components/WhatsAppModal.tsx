import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Appointment } from '../types';
import { products } from '../data/mockData';
import { SwipeableModal } from './SwipeableModal';

interface WhatsAppModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  delayMinutes?: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  visible,
  onClose,
  appointment,
  delayMinutes = 0,
}) => {
  const { colors } = useTheme();

  if (!appointment) return null;

  const client = appointment.client;
  const firstName = appointment.clientName.split(' ')[0];
  const newTime = appointment.recalculatedStartTime || appointment.scheduledStartTime;

  // Get recommended product for this client's hair type
  const recommendedProduct = client
    ? products.find(p => p.forHairTypes.includes(client.hairType))
    : null;

  const messages = [
    {
      id: 'delay',
      label: 'RDV décalé',
      preview: `"Ton RDV est à ${newTime}..."`,
      message: `Salut ${firstName} 👋\n\nTon RDV est décalé à ${newTime}.\nÀ tout de suite ! 💈`,
    },
    {
      id: 'ready',
      label: "C'est ton tour",
      preview: `"C'est à toi, je t'attends..."`,
      message: `Hey ${firstName} !\n\nC'est ton tour, je t'attends au salon 💈`,
    },
    {
      id: 'sorry-discount',
      label: 'Excuse + promo coupe',
      preview: `"-10% sur ta prochaine coupe..."`,
      message: `Salut ${firstName} 👋\n\nDésolé pour l'attente aujourd'hui !\nPour me faire pardonner, je t'offre -10% sur ta prochaine coupe.\n\nÀ très vite ! 💈`,
    },
  ];

  // Add product-specific offer if client has hair type info
  if (recommendedProduct && client) {
    const hairTypeLabel = client.hairType === 'curly' ? 'bouclés' : 
                          client.hairType === 'coily' ? 'crépus' : 
                          client.hairType === 'wavy' ? 'ondulés' : 'lisses';
    messages.push({
      id: 'product-offer',
      label: `Offre ${recommendedProduct.name}`,
      preview: `"-15% sur ${recommendedProduct.name}..."`,
      message: `Salut ${firstName} 👋\n\nDésolé pour l'attente !\nPour toi, -15% sur ${recommendedProduct.name} (${recommendedProduct.price}€ → ${Math.round(recommendedProduct.price * 0.85)}€).\n\nParfait pour tes cheveux ${hairTypeLabel} ✨\n\nÀ tout de suite ! 💈`,
    });
  }

  const openWhatsApp = (message: string) => {
    const phone = appointment.clientPhone.replace(/\+/g, '').replace(/\s/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${phone}?text=${encodedMessage}`);
    });
    onClose();
  };

  return (
    <SwipeableModal visible={visible} onClose={onClose} maxHeight={500}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Notifier
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {appointment.clientName} · {appointment.clientPhone}
          </Text>
        </View>

        {/* Message options */}
        {messages.map((msg) => (
          <TouchableOpacity
            key={msg.id}
            style={[styles.messageOption, { backgroundColor: colors.buttonSecondary }]}
            onPress={() => openWhatsApp(msg.message)}
            activeOpacity={0.7}
          >
            <View style={styles.messageContent}>
              <Text style={[styles.messageLabel, { color: colors.text }]}>
                {msg.label}
              </Text>
              <Text style={[styles.messagePreview, { color: colors.textSecondary }]}>
                {msg.preview}
              </Text>
            </View>
            <View style={styles.whatsappBadge}>
              <Text style={styles.whatsappText}>Envoyer</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SwipeableModal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
  messageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  messageContent: {
    flex: 1,
  },
  messageLabel: {
    ...typography.bodyBold,
    marginBottom: 2,
  },
  messagePreview: {
    ...typography.caption,
  },
  whatsappBadge: {
    backgroundColor: '#25D366',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

