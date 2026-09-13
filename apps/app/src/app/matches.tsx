import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  ConversationItem,
  DesignTokens,
  RhymanceHeader,
} from '@rhymance/ui';
import { Conversation, Match, SEED_POETS } from '@rhymance/domain';
import { useRepositories } from '@/context/RepositoryContext';

export default function MatchesScreen() {
  const router = useRouter();
  const { matchRepository, conversationRepository, currentUser } = useRepositories();

  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [fetchedMatches, fetchedConversations] = await Promise.all([
        matchRepository.getMatches(currentUser.id),
        conversationRepository.getConversations(currentUser.id),
      ]);
      setMatches(fetchedMatches);
      setConversations(fetchedConversations);
    } catch (err) {
      console.error('Error loading matches/conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [matchRepository, conversationRepository, currentUser]);

  // Helper to resolve poet info from user ID
  const getPoetDetails = (otherUserId: string) => {
    const poet = SEED_POETS.find((p) => p.user.id === otherUserId);
    if (poet) {
      return {
        name: poet.profile.firstName,
        city: poet.profile.location.city,
      };
    }
    return { name: 'Poeta Afín', city: 'España' };
  };

  const handleOpenChat = (matchId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: matchId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <RhymanceHeader title="Conexiones" showBadge={false} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={DesignTokens.colors.passion} />
          </View>
        ) : (
          <>
            {/* Top Row: New Matches */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nuevas Afinidades</Text>
              <Text style={styles.matchCountPill}>{matches.length}</Text>
            </View>

            {matches.length === 0 ? (
              <View style={styles.noMatchesBox}>
                <Text style={styles.noMatchesText}>
                  Aún no tienes afinidades mutuas. ¡Desliza versos en Descubrir para conectar!
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalContent}
              >
                {matches.map((m) => {
                  const otherId = m.users.find((u) => u !== currentUser?.id) || '';
                  const poet = getPoetDetails(otherId);

                  return (
                    <Pressable
                      key={m.id}
                      style={({ pressed }) => [
                        styles.matchBubble,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => handleOpenChat(m.id)}
                    >
                      <View style={styles.matchAvatar}>
                        <Text style={styles.matchAvatarInitial}>
                          {poet.name.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.matchName} numberOfLines={1}>
                        {poet.name}
                      </Text>
                      <Text style={styles.matchCity} numberOfLines={1}>
                        {poet.city}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Bottom List: Conversations */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Diálogos Poéticos</Text>
            </View>

            {conversations.length === 0 ? (
              <View style={styles.emptyConversationsBox}>
                <Text style={styles.emptyIcon}>✉️</Text>
                <Text style={styles.emptyTitle}>Bandeja sin versos</Text>
                <Text style={styles.emptySubtitle}>
                  Tus conversaciones con otros poetas aparecerán aquí una vez conectéis.
                </Text>
              </View>
            ) : (
              <View style={styles.conversationList}>
                {conversations.map((conv) => {
                  const otherId =
                    conv.participants.find((u) => u !== currentUser?.id) || '';
                  const poet = getPoetDetails(otherId);
                  const unread = conv.unreadCount[currentUser?.id || ''] || 0;

                  return (
                    <ConversationItem
                      key={conv.matchId}
                      name={poet.name}
                      lastMessageText={
                        conv.lastMessage?.text || 'Conexión poética iniciada'
                      }
                      unreadCount={unread}
                      onPress={() => handleOpenChat(conv.matchId)}
                    />
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignTokens.colors.bgDark,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: DesignTokens.spacing.md,
    paddingBottom: 80,
  },
  centerBox: {
    paddingVertical: DesignTokens.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
    marginTop: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
  },
  sectionTitle: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  matchCountPill: {
    backgroundColor: DesignTokens.colors.passionLight,
    color: DesignTokens.colors.passion,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: DesignTokens.radius.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.borderActive,
  },
  horizontalScroll: {
    marginBottom: DesignTokens.spacing.lg,
  },
  horizontalContent: {
    gap: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.xs,
  },
  matchBubble: {
    alignItems: 'center',
    width: 76,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.passion,
    marginBottom: 6,
    ...DesignTokens.shadows.sm,
  },
  matchAvatarInitial: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  matchName: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
    textAlign: 'center',
  },
  matchCity: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: 10,
    textAlign: 'center',
  },
  noMatchesBox: {
    padding: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.md,
    marginBottom: DesignTokens.spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  noMatchesText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  conversationList: {
    marginTop: DesignTokens.spacing.xs,
  },
  emptyConversationsBox: {
    padding: DesignTokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    marginTop: DesignTokens.spacing.sm,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: DesignTokens.spacing.sm,
  },
  emptyTitle: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.8,
  },
});
