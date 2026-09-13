import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DesignTokens } from '../tokens';

export interface MessageBubbleProps {
  text: string;
  timestamp?: string;
  isMine: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  timestamp,
  isMine,
  status,
}) => {
  return (
    <View
      style={[
        styles.rowContainer,
        isMine ? styles.rowMine : styles.rowOther,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleOther,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMine ? styles.textMine : styles.textOther,
          ]}
        >
          {text}
        </Text>
        <View style={styles.footerRow}>
          {timestamp && (
            <Text
              style={[
                styles.timeText,
                isMine ? styles.timeMine : styles.timeOther,
              ]}
            >
              {timestamp}
            </Text>
          )}
          {isMine && status && (
            <Text style={styles.statusText}>
              {status === 'read' ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.lg,
    ...DesignTokens.shadows.sm,
  },
  bubbleMine: {
    backgroundColor: DesignTokens.colors.passion,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: DesignTokens.colors.bgCardElevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  messageText: {
    fontSize: DesignTokens.typography.sizes.base,
    lineHeight: 22,
  },
  textMine: {
    color: DesignTokens.colors.white,
  },
  textOther: {
    color: DesignTokens.colors.white,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeMine: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOther: {
    color: DesignTokens.colors.whiteSubtle,
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
