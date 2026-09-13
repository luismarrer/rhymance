import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DesignTokens } from '../tokens';

export interface SwipeActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  onSuperLike?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
}

export const SwipeActionButtons: React.FC<SwipeActionButtonsProps> = ({
  onNope,
  onLike,
  onSuperLike,
  onUndo,
  canUndo = false,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Undo Button */}
      {onUndo && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.btnSmall,
            styles.btnUndo,
            (!canUndo || disabled) && styles.btnDisabled,
            pressed && styles.pressed,
          ]}
          onPress={onUndo}
          disabled={!canUndo || disabled}
          accessibilityLabel="Deshacer último swipe"
        >
          <Text style={styles.iconSmall}>↩</Text>
        </Pressable>
      )}

      {/* Nope / Pass Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.btnBig,
          styles.btnNope,
          disabled && styles.btnDisabled,
          pressed && styles.pressed,
        ]}
        onPress={onNope}
        disabled={disabled}
        accessibilityLabel="Pasar poema"
      >
        <Text style={styles.iconNope}>✕</Text>
      </Pressable>

      {/* Super Like Button */}
      {onSuperLike && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.btnSmall,
            styles.btnSuperLike,
            disabled && styles.btnDisabled,
            pressed && styles.pressed,
          ]}
          onPress={onSuperLike}
          disabled={disabled}
          accessibilityLabel="Super like de poesía"
        >
          <Text style={styles.iconSuperLike}>★</Text>
        </Pressable>
      )}

      {/* Like Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.btnBig,
          styles.btnLike,
          disabled && styles.btnDisabled,
          pressed && styles.pressed,
        ]}
        onPress={onLike}
        disabled={disabled}
        accessibilityLabel="Me gusta el poema"
      >
        <Text style={styles.iconLike}>♥</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
  },
  button: {
    borderRadius: DesignTokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.bgCard,
    borderWidth: 1.5,
    ...DesignTokens.shadows.md,
  },
  btnSmall: {
    width: 46,
    height: 46,
  },
  btnBig: {
    width: 64,
    height: 64,
  },
  btnUndo: {
    borderColor: DesignTokens.colors.amber,
  },
  btnNope: {
    borderColor: DesignTokens.colors.red,
  },
  btnSuperLike: {
    borderColor: DesignTokens.colors.blue,
  },
  btnLike: {
    borderColor: DesignTokens.colors.passion,
    backgroundColor: 'rgba(255, 107, 157, 0.08)',
  },
  iconSmall: {
    fontSize: 20,
    color: DesignTokens.colors.amber,
    fontWeight: 'bold',
  },
  iconNope: {
    fontSize: 26,
    color: DesignTokens.colors.red,
    fontWeight: 'bold',
  },
  iconSuperLike: {
    fontSize: 22,
    color: DesignTokens.colors.blue,
  },
  iconLike: {
    fontSize: 32,
    color: DesignTokens.colors.passion,
  },
  btnDisabled: {
    opacity: 0.35,
    borderColor: DesignTokens.colors.border,
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
});
