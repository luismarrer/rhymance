import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesignTokens, RhymanceHeader } from '@rhymance/ui';
import { Profile } from '@rhymance/domain';
import { useRepositories } from '@/context/RepositoryContext';

export default function ProfileScreen() {
  const {
    profileRepository,
    matchRepository,
    conversationRepository,
    currentUser,
    backendMode,
    firebaseConfigured,
    switchToFirebase,
    switchToSandbox,
    resetDemoData,
  } = useRepositories();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [convCount, setConvCount] = useState<number>(0);

  const loadProfile = async () => {
    if (!currentUser) return;
    try {
      const p = await profileRepository.getProfile(currentUser.id);
      setProfile(p);
      const matches = await matchRepository.getMatches(currentUser.id);
      setMatchCount(matches.length);
      const convs = await conversationRepository.getConversations(currentUser.id);
      setConvCount(convs.length);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const p = await profileRepository.getProfile(currentUser.id);
        const matches = await matchRepository.getMatches(currentUser.id);
        const convs = await conversationRepository.getConversations(currentUser.id);
        if (isMounted) {
          setProfile(p);
          setMatchCount(matches.length);
          setConvCount(convs.length);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading profile:', err);
        }
      }
    };
    fetchProfileData();
    return () => {
      isMounted = false;
    };
  }, [profileRepository, matchRepository, conversationRepository, currentUser]);

  const handleReset = () => {
    const doReset = () => {
      resetDemoData();
      loadProfile();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Reiniciar todos los datos y swipes del modo demostración?')) {
        doReset();
      }
    } else {
      Alert.alert(
        'Reiniciar Sandbox',
        '¿Deseas restaurar los poetas, swipes y conversaciones de prueba?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reiniciar', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <RhymanceHeader title="Mi Perfil" showBadge={true} badgeLabel="Sandbox" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile?.firstName?.charAt(0) || 'P'}
            </Text>
          </View>
          <Text style={styles.heroName}>
            {profile?.firstName || 'Poeta Visitante'}
          </Text>
          <Text style={styles.heroLocation}>
            {profile?.location.city}, {profile?.location.country}
          </Text>
          <Text style={styles.heroBio}>
            {profile?.biography ||
              'Explorando almas a través de la poesía en Rhymance.'}
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {profile?.poeticStyles.map((style, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Poema Activo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{matchCount}</Text>
            <Text style={styles.statLabel}>Afinidades</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{convCount}</Text>
            <Text style={styles.statLabel}>Diálogos</Text>
          </View>
        </View>

        {/* Primary Poem Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Mi Poema en Exhibición</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Visible</Text>
            </View>
          </View>

          <Text style={styles.poemTitle}>&ldquo;Versos para el alba&rdquo;</Text>
          <View style={styles.poemBox}>
            <Text style={styles.poemVerses}>
              En la frontera exacta de tu mirada,{'\n'}
              aprendí que el silencio también es rima.{'\n'}
              No pido eternidades ni tierra amada:{'\n'}
              tan solo un verso lento que nos redima.
            </Text>
          </View>
        </View>

        {/* Backend Infrastructure & Sandbox Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Infraestructura & Backend</Text>
            <View
              style={[
                styles.activePill,
                backendMode === 'firebase'
                  ? styles.firebasePill
                  : styles.sandboxPill,
              ]}
            >
              <Text
                style={[
                  styles.activePillText,
                  backendMode === 'firebase'
                    ? styles.firebasePillText
                    : styles.sandboxPillText,
                ]}
              >
                {backendMode === 'firebase' ? 'Firebase Live' : 'Sandbox Demo'}
              </Text>
            </View>
          </View>

          <Text style={styles.sandboxDescription}>
            Rhymance implementa el <Text style={styles.bold}>Patrón Repository</Text> desacoplado. Puedes alternar libremente entre el backend en la nube (Cloud Firestore / Firebase Auth) y el sandbox en memoria para pruebas instantáneas.
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Variables Firebase en .env:</Text>
            <Text style={firebaseConfigured ? styles.statusOk : styles.statusPending}>
              {firebaseConfigured ? '✓ Detectadas' : '○ No configuradas (Usa Sandbox)'}
            </Text>
          </View>

          <View style={styles.actionButtonsCol}>
            {backendMode === 'sandbox' ? (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryActionBtn,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    const ok = switchToFirebase();
                    if (ok) {
                      loadProfile();
                    } else {
                      Alert.alert(
                        'Firebase no configurado',
                        'Para conectar con Firebase real, define EXPO_PUBLIC_FIREBASE_API_KEY y EXPO_PUBLIC_FIREBASE_PROJECT_ID en apps/app/.env o inicia los emuladores locales.'
                      );
                    }
                  }}
                >
                  <Text style={styles.primaryActionBtnText}>
                    ⚡ Conectar a Firebase Cloud / Emulador
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.resetButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleReset}
                >
                  <Text style={styles.resetButtonText}>
                    ↻ Restaurar Estado Inicial de Demostración
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryActionBtn,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  switchToSandbox();
                  loadProfile();
                }}
              >
                <Text style={styles.secondaryActionBtnText}>
                  Volver a Modo Sandbox en Memoria
                </Text>
              </Pressable>
            )}
          </View>
        </View>
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
  profileHero: {
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.xl,
    padding: DesignTokens.spacing.xl,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    marginBottom: DesignTokens.spacing.md,
    ...DesignTokens.shadows.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DesignTokens.colors.passion,
    marginBottom: DesignTokens.spacing.sm,
  },
  avatarText: {
    color: DesignTokens.colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  heroName: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: DesignTokens.typography.weights.bold,
    marginBottom: 2,
  },
  heroLocation: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: DesignTokens.typography.sizes.xs,
    marginBottom: DesignTokens.spacing.sm,
  },
  heroBio: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: DesignTokens.spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.xs,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: DesignTokens.colors.passionLight,
    borderWidth: 1,
    borderColor: DesignTokens.colors.borderActive,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: DesignTokens.radius.full,
  },
  tagText: {
    color: DesignTokens.colors.passion,
    fontSize: 11,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.lg,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  statNumber: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: 11,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: DesignTokens.colors.bgCard,
    borderRadius: DesignTokens.radius.xl,
    padding: DesignTokens.spacing.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    marginBottom: DesignTokens.spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  sectionHeading: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  activePill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: DesignTokens.radius.full,
  },
  activePillText: {
    color: DesignTokens.colors.green,
    fontSize: 10,
    fontWeight: 'bold',
  },
  poemTitle: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: 'bold',
    fontFamily: DesignTokens.typography.serifFontFamily,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  },
  poemBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: DesignTokens.colors.passion,
  },
  poemVerses: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.sm,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: DesignTokens.typography.serifFontFamily,
  },
  sandboxDescription: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
    lineHeight: 18,
    marginBottom: DesignTokens.spacing.md,
  },
  bold: {
    color: DesignTokens.colors.white,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.12)',
    borderWidth: 1,
    borderColor: DesignTokens.colors.borderActive,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: 'bold',
  },
  firebasePill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  firebasePillText: {
    color: DesignTokens.colors.blue,
  },
  sandboxPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  sandboxPillText: {
    color: DesignTokens.colors.amber,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DesignTokens.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: DesignTokens.spacing.md,
  },
  statusLabel: {
    color: DesignTokens.colors.whiteMuted,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  statusOk: {
    color: DesignTokens.colors.green,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: 'bold',
  },
  statusPending: {
    color: DesignTokens.colors.amber,
    fontSize: DesignTokens.typography.sizes.xs,
  },
  actionButtonsCol: {
    gap: DesignTokens.spacing.sm,
  },
  primaryActionBtn: {
    backgroundColor: DesignTokens.colors.passion,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: 'bold',
  },
  secondaryActionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    alignItems: 'center',
  },
  secondaryActionBtnText: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.xs,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
  },
});
