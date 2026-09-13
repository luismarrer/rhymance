import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DesignTokens } from '../tokens';

export interface RhymanceHeaderProps {
  title?: string;
  showBadge?: boolean;
  badgeLabel?: string;
  rightActionText?: string;
  onPressRightAction?: () => void;
}

export const RhymanceHeader: React.FC<RhymanceHeaderProps> = ({
  title = 'Rhymance',
  showBadge = true,
  badgeLabel = 'Demo',
  rightActionText,
  onPressRightAction,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.heartIcon}>💕</Text>
        <Text style={styles.titleText}>{title}</Text>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      {rightActionText && onPressRightAction && (
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.pressed,
          ]}
          onPress={onPressRightAction}
        >
          <Text style={styles.actionBtnText}>{rightActionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  heartIcon: {
    fontSize: 20,
  },
  titleText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: DesignTokens.typography.weights.bold,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: DesignTokens.colors.passionLight,
    borderWidth: 1,
    borderColor: DesignTokens.colors.borderActive,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: DesignTokens.radius.sm,
    marginLeft: DesignTokens.spacing.xs,
  },
  badgeText: {
    color: DesignTokens.colors.passion,
    fontSize: 10,
    fontWeight: DesignTokens.typography.weights.bold,
    textTransform: 'uppercase',
  },
  actionBtn: {
    paddingVertical: DesignTokens.spacing.xs,
    paddingHorizontal: DesignTokens.spacing.sm,
  },
  actionBtnText: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  pressed: {
    opacity: 0.7,
  },
});
