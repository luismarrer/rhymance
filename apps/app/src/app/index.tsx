import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  SwipeablePoemCard,
  SwipeableCardRef,
  SwipeActionButtons,
  MatchModal,
  RhymanceHeader,
  DesignTokens,
} from '@rhymance/ui';
import { DiscoveryCard } from '@rhymance/domain';
import { useRepositories } from '@/context/RepositoryContext';

export default function DiscoveryScreen() {
  const router = useRouter();
  const { poemRepository, matchRepository, currentUser, backendMode, resetDemoData } = useRepositories();

  const cardRef = useRef<SwipeableCardRef>(null);
  const [cards, setCards] = useState<DiscoveryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<number[]>([]);

  // Match celebration modal state
  const [matchModal, setMatchModal] = useState<{
    visible: boolean;
    poetName: string;
    poemTitle: string;
    matchId?: string;
  }>({
    visible: false,
    poetName: '',
    poemTitle: '',
  });

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const userId = currentUser?.id || 'user_recruiter';
      const queue = await poemRepository.getDiscoveryQueue(userId);
      setCards(queue);
      setCurrentIndex(0);
      setHistory([]);
    } catch (err) {
      console.error('Error loading discovery queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [poemRepository, currentUser]);

  const currentCard = cards[currentIndex];

  const handleSwipe = async (type: 'like' | 'pass') => {
    if (!currentCard || !currentUser) return;

    setHistory((prev) => [...prev, currentIndex]);

    try {
      const result = await matchRepository.recordSwipe({
        swiperId: currentUser.id,
        targetId: currentCard.author.id,
        type,
        createdAt: new Date().toISOString(),
      });

      if (result.isMatch && result.match) {
        setMatchModal({
          visible: true,
          poetName: currentCard.author.firstName,
          poemTitle: currentCard.poem.title,
          matchId: result.match.id,
        });
      }
    } catch (err) {
      console.error('Error recording swipe:', err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
  };

  const handleSendMessage = () => {
    const targetMatchId = matchModal.matchId;
    setMatchModal((prev) => ({ ...prev, visible: false }));
    if (targetMatchId) {
      router.push({
        pathname: '/chat/[id]',
        params: { id: targetMatchId },
      });
    } else {
      router.push('/matches');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Brand Header */}
      <RhymanceHeader
        title="Rhymance"
        showBadge={true}
        badgeLabel={backendMode === 'firebase' ? 'Firebase Cloud' : 'Demo Sandbox'}
        rightActionText={backendMode === 'sandbox' ? 'Reiniciar' : undefined}
        onPressRightAction={
          backendMode === 'sandbox'
            ? () => {
                resetDemoData();
                loadQueue();
              }
            : undefined
        }
      />

      <View style={styles.mainContainer}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={DesignTokens.colors.passion} />
            <Text style={styles.loadingText}>Buscando versos afines...</Text>
          </View>
        ) : currentCard ? (
          <View style={styles.cardArea}>
            <SwipeablePoemCard
              ref={cardRef}
              poem={currentCard.poem}
              author={currentCard.author}
              onSwipeLeft={() => handleSwipe('pass')}
              onSwipeRight={() => handleSwipe('like')}
            />

            {/* Action Buttons */}
            <SwipeActionButtons
              onNope={() => {
                if (cardRef.current) {
                  cardRef.current.swipeLeft();
                } else {
                  handleSwipe('pass');
                }
              }}
              onLike={() => {
                if (cardRef.current) {
                  cardRef.current.swipeRight();
                } else {
                  handleSwipe('like');
                }
              }}
              onSuperLike={() => {
                if (cardRef.current) {
                  cardRef.current.swipeRight();
                } else {
                  handleSwipe('like');
                }
              }}
              onUndo={handleUndo}
              canUndo={history.length > 0}
            />
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyEmblem}>📜</Text>
            <Text style={styles.emptyTitle}>Has leído todos los versos</Text>
            <Text style={styles.emptySubtitle}>
              No quedan más poetas disponibles en tu radio literario por ahora.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                resetDemoData();
                loadQueue();
              }}
            >
              <Text style={styles.resetButtonText}>Reiniciar poetas de prueba</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Mutual Match Modal Celebration */}
      <MatchModal
        visible={matchModal.visible}
        matchedPoetName={matchModal.poetName}
        matchedPoemTitle={matchModal.poemTitle}
        onSendMessage={handleSendMessage}
        onKeepSwiping={() => setMatchModal((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignTokens.colors.bgDark,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingTop: DesignTokens.spacing.sm,
    paddingBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArea: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.md,
  },
  loadingText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.base,
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 360,
    padding: DesignTokens.spacing.xl,
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.xl,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  emptyEmblem: {
    fontSize: 48,
    marginBottom: DesignTokens.spacing.md,
  },
  emptyTitle: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: DesignTokens.typography.weights.bold,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.sm,
    fontFamily: DesignTokens.typography.serifFontFamily,
  },
  emptySubtitle: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: DesignTokens.spacing.lg,
  },
  resetButton: {
    backgroundColor: DesignTokens.colors.passion,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.xl,
    borderRadius: DesignTokens.radius.full,
  },
  resetButtonText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
