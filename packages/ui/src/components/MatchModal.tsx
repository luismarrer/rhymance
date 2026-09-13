import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { DesignTokens } from '../tokens';

export interface MatchModalProps {
  visible: boolean;
  matchedPoetName: string;
  matchedPoemTitle?: string;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  matchedPoetName,
  matchedPoemTitle,
  onSendMessage,
  onKeepSwiping,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onKeepSwiping}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Heart Emblem */}
          <View style={styles.emblemContainer}>
            <Text style={styles.emblemIcon}>❦</Text>
          </View>

          {/* Title */}
          <Text style={styles.heading}>¡Conexión Poética!</Text>
          <Text style={styles.subheading}>
            Tus versos y los de <Text style={styles.highlightName}>{matchedPoetName}</Text> han rimado en el corazón.
          </Text>

          {matchedPoemTitle && (
            <View style={styles.poemBox}>
              <Text style={styles.poemLabel}>Poema conectado:</Text>
              <Text style={styles.poemTitle}>«{matchedPoemTitle}»</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
              onPress={onSendMessage}
            >
              <Text style={styles.primaryBtnText}>Enviar un verso a {matchedPoetName}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.pressed,
              ]}
              onPress={onKeepSwiping}
            >
              <Text style={styles.secondaryBtnText}>Seguir leyendo poesía</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignTokens.spacing.lg,
  },
  dialog: {
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.xl,
    padding: DesignTokens.spacing.xl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: DesignTokens.colors.borderActive,
    ...DesignTokens.shadows.lg,
  },
  emblemContainer: {
    width: 64,
    height: 64,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.passion,
  },
  emblemIcon: {
    fontSize: 32,
    color: DesignTokens.colors.passion,
  },
  heading: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: DesignTokens.typography.weights.bold,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.sm,
    fontFamily: DesignTokens.typography.serifFontFamily,
  },
  subheading: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.base,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: DesignTokens.spacing.lg,
  },
  highlightName: {
    color: DesignTokens.colors.passion,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  poemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.md,
    marginBottom: DesignTokens.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  poemLabel: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
    marginBottom: 2,
  },
  poemTitle: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.sm,
    fontStyle: 'italic',
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  actions: {
    width: '100%',
    gap: DesignTokens.spacing.sm,
  },
  primaryBtn: {
    backgroundColor: DesignTokens.colors.passion,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.full,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  secondaryBtn: {
    paddingVertical: DesignTokens.spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  secondaryBtnText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
  },
  pressed: {
    opacity: 0.8,
  },
});
