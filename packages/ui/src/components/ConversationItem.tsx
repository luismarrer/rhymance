import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DesignTokens } from '../tokens';

export interface ConversationItemProps {
  name: string;
  lastMessageText?: string;
  timestamp?: string;
  unreadCount?: number;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  lastMessageText = '¡Habéis conectado a través de la poesía!',
  timestamp,
  unreadCount = 0,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {/* Avatar Initial */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>

      {/* Details */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.nameText}>{name}</Text>
          {timestamp && <Text style={styles.timeText}>{timestamp}</Text>}
        </View>
        <Text style={styles.previewText} numberOfLines={1}>
          {lastMessageText}
        </Text>
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.lg,
    marginBottom: DesignTokens.spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  },
  avatarText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  timeText: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  previewText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
  },
  badge: {
    backgroundColor: DesignTokens.colors.passion,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: DesignTokens.spacing.sm,
  },
  badgeText: {
    color: DesignTokens.colors.white,
    fontSize: 11,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: DesignTokens.colors.bgCardElevated,
  },
});
