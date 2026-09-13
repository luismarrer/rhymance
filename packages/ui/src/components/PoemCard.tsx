import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { DesignTokens } from '../tokens';

export interface PoemCardAuthor {
  id: string;
  firstName: string;
  age: number;
  city: string;
  country: string;
  biography: string;
  poeticStyles: string[];
  interests: string[];
  photoUrl?: string;
}

export interface PoemCardPoem {
  id: string;
  title: string;
  body: string;
  style: string;
  context?: string;
}

export interface PoemCardProps {
  poem: PoemCardPoem;
  author: PoemCardAuthor;
  onPressProfile?: () => void;
}

export const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  author,
  onPressProfile,
}) => {
  const [showBio, setShowBio] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Style Pill & Origin */}
        <View style={styles.headerRow}>
          <View style={styles.stylePill}>
            <Text style={styles.stylePillText}>{poem.style}</Text>
          </View>
          <Text style={styles.locationText}>
            {author.city}, {author.country}
          </Text>
        </View>

        {/* Poem Title */}
        <Text style={styles.poemTitle}>"{poem.title}"</Text>

        {/* Poem Verses */}
        <View style={styles.versesWrapper}>
          <Text style={styles.versesText}>{poem.body}</Text>
        </View>

        {/* Poem Context (if provided) */}
        {poem.context && (
          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>Nota del poeta:</Text>
            <Text style={styles.contextText}>«{poem.context}»</Text>
          </View>
        )}

        {/* Author Section */}
        <View style={styles.authorSection}>
          <View style={styles.authorHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {author.firstName.charAt(0)}
              </Text>
            </View>
            <View style={styles.authorDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.authorName}>{author.firstName}</Text>
                <View style={styles.agePill}>
                  <Text style={styles.ageText}>{author.age} años</Text>
                </View>
              </View>
              <Text style={styles.authorSubtitle}>
                {author.poeticStyles.join(' · ')}
              </Text>
            </View>
          </View>

          {/* Toggle Bio Button */}
          <Pressable
            style={({ pressed }) => [
              styles.toggleBioBtn,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              setShowBio(!showBio);
              onPressProfile?.();
            }}
          >
            <Text style={styles.toggleBioText}>
              {showBio ? '▲ Ocultar perfil' : '▼ Conocer al poeta'}
            </Text>
          </Pressable>

          {/* Expanded Bio */}
          {showBio && (
            <View style={styles.expandedBio}>
              <Text style={styles.bioHeading}>Sobre mí</Text>
              <Text style={styles.bioText}>{author.biography}</Text>

              <Text style={styles.bioHeading}>Sensibilidades e Intereses</Text>
              <View style={styles.tagsContainer}>
                {author.interests.map((interest, idx) => (
                  <View key={idx} style={styles.tagPill}>
                    <Text style={styles.tagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.xl,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    overflow: 'hidden',
    width: '100%',
    maxHeight: 620,
    minHeight: 480,
    ...DesignTokens.shadows.lg,
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: DesignTokens.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  stylePill: {
    backgroundColor: DesignTokens.colors.passionLight,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.radius.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.borderActive,
  },
  stylePillText: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationText: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  poemTitle: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: DesignTokens.typography.weights.bold,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
    fontFamily: DesignTokens.typography.serifFontFamily,
  },
  versesWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: DesignTokens.colors.passion,
    marginBottom: DesignTokens.spacing.md,
  },
  versesText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: DesignTokens.typography.serifFontFamily,
  },
  contextBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: DesignTokens.radius.sm,
    padding: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
  },
  contextLabel: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
    marginBottom: 2,
  },
  contextText: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
    fontStyle: 'italic',
  },
  authorSection: {
    marginTop: DesignTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.border,
    paddingTop: DesignTokens.spacing.md,
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  },
  avatarInitial: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  authorDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  authorName: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  agePill: {
    backgroundColor: DesignTokens.colors.grayDark,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: DesignTokens.radius.full,
  },
  ageText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  authorSubtitle: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
    marginTop: 2,
  },
  toggleBioBtn: {
    marginTop: DesignTokens.spacing.md,
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xs,
  },
  toggleBioText: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  expandedBio: {
    marginTop: DesignTokens.spacing.md,
    paddingTop: DesignTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  bioHeading: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: DesignTokens.typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.xs,
  },
  bioText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.xs,
    marginTop: DesignTokens.spacing.xs,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.radius.full,
  },
  tagText: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
