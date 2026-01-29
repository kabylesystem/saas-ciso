import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Animated,
  TouchableWithoutFeedback,
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

const AnimatedMessageOption: React.FC<{
  onPress: () => void;
  backgroundColor: string;
  children: React.ReactNode;
}> = ({ onPress, backgroundColor, children }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(bgOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(bgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 50, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View 
        style={[
          styles.messageOption, 
          { backgroundColor, transform: [{ scale }] }
        ]}
      >
        <Animated.View 
          style={[
            styles.pressHighlight,
            { opacity: bgOpacity }
          ]} 
        />
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

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
      <View style={styles.content}>
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
          <AnimatedMessageOption
            key={msg.id}
            onPress={() => openWhatsApp(msg.message)}
            backgroundColor={colors.buttonSecondary}
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
          </AnimatedMessageOption>
        ))}
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
    overflow: 'hidden',
  },
  pressHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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


