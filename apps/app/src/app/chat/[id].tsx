import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DesignTokens, MessageBubble } from '@rhymance/ui';
import { Message, SEED_POETS } from '@rhymance/domain';
import { useRepositories } from '@/context/RepositoryContext';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const matchId = params.id as string;

  const { conversationRepository, matchRepository, currentUser } = useRepositories();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [poetName, setPoetName] = useState<string>('Poeta');
  const [poetCity, setPoetCity] = useState<string>('España');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!matchId || !currentUser) return;

    // Mark as read
    conversationRepository.markConversationAsRead(matchId, currentUser.id);

    // Resolve poet details
    matchRepository.getMatchById(matchId).then((match) => {
      if (match) {
        const otherId = match.users.find((u) => u !== currentUser.id);
        const poet = SEED_POETS.find((p) => p.user.id === otherId);
        if (poet) {
          setPoetName(poet.profile.firstName);
          setPoetCity(poet.profile.location.city);
        }
      }
    });

    // Subscribe to messages
    let unsub: (() => void) | undefined;
    if (conversationRepository.subscribeToMessages) {
      unsub = conversationRepository.subscribeToMessages(matchId, (msgs) => {
        setMessages(msgs);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
    } else {
      conversationRepository.getMessages(matchId).then(setMessages);
    }

    return () => {
      unsub?.();
    };
  }, [matchId, currentUser, conversationRepository, matchRepository]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !currentUser || !matchId) return;

    setInputText('');
    try {
      await conversationRepository.sendMessage(matchId, currentUser.id, trimmed);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Chat Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>‹ Volver</Text>
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerName}>{poetName}</Text>
          <Text style={styles.headerCity}>{poetCity}</Text>
        </View>

        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarInitial}>{poetName.charAt(0)}</Text>
        </View>
      </View>

      {/* Messages List */}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isMine = item.senderId === currentUser?.id;
            const timeStr = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : undefined;

            return (
              <MessageBubble
                text={item.text}
                timestamp={timeStr}
                isMine={isMine}
                status={item.status}
              />
            );
          }}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Escribe un verso a ${poetName}...`}
            placeholderTextColor={DesignTokens.colors.whiteSubtle}
            multiline
            maxLength={500}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DesignTokens.colors.bgDark,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.border,
    backgroundColor: DesignTokens.colors.bgCard,
  },
  backBtn: {
    paddingVertical: DesignTokens.spacing.xs,
    paddingRight: DesignTokens.spacing.sm,
  },
  backBtnText: {
    color: DesignTokens.colors.passion,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.semibold,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerName: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  headerCity: {
    color: DesignTokens.colors.whiteSubtle,
    fontSize: 11,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passionDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarInitial: {
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: DesignTokens.typography.weights.bold,
  },
  messagesContainer: {
    paddingVertical: DesignTokens.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    backgroundColor: DesignTokens.colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.border,
    gap: DesignTokens.spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: DesignTokens.radius.lg,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: 8,
    color: DesignTokens.colors.white,
    fontSize: DesignTokens.typography.sizes.base,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.passion,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.35,
  },
  sendButtonText: {
    color: DesignTokens.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  },
});
