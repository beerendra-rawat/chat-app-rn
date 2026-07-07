import React, { useMemo, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native"; // ✅ add
import AppContainer from "../../components/common/AppContainer";
import EmptyChat from "../../components/chat/EmptyChat";
import MessageHeader from "../../components/chat/MessageHeader";
import MessageInput from "../../components/chat/MessageInput";
import MessageBubble from "../../components/chat/MessageBubble";
import { RootStackScreenProps } from "../../navigation/types";
import { Message } from "../../types/chat";
import { chatService } from "../../services/chat.service";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useAppSelector } from "../../redux/store/hooks";
import { usePresence } from "../../hooks/usePresence";

type Props = RootStackScreenProps<"ChatDetail">;

export default function MessageScreen({ navigation, route }: Props) {
  const { chatId, otherUserId, otherUserName, otherUserAvatar } = route.params;

  const currentUid = useAppSelector((state) => state.auth.user?.uid);
  const { messages, loading } = useChatMessages(chatId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { isOnline, lastSeenLabel } = usePresence(otherUserId);
  const isFocused = useIsFocused(); // ✅ add — only mark read while this screen is actually visible

  useEffect(() => {
    if (!currentUid || !otherUserId) return;
    chatService
      .ensureChatDocument(chatId, currentUid, otherUserId)
      .catch((err) => console.error("Failed to ensure chat document:", err));
  }, [chatId, currentUid, otherUserId]);

  // ✅ new — mark incoming messages as read whenever the message list updates
  // AND the screen is focused (don't mark read from a push notification preview, etc.)
  useEffect(() => {
    if (!currentUid || !isFocused || !messages.length) return;

    const hasUnread = messages.some(
      (m) => !m.isRead && m.senderId !== currentUid,
    );
    if (!hasUnread) return;

    chatService
      .markMessagesAsRead(chatId, currentUid)
      .catch((err) => console.error("Failed to mark messages as read:", err));
  }, [messages, currentUid, isFocused, chatId]);

  const sendMessage = async () => {
    if (!text.trim() || !currentUid || sending) return;
    const outgoing = text;
    setText("");
    setSending(true);
    try {
      await chatService.sendMessage(chatId, currentUid, outgoing);
    } catch (err) {
      console.error("Failed to send message:", err);
      setText(outgoing);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isMyMessage={item.senderId === currentUid} />
  );

  const content = useMemo(() => {
    if (!loading && !messages.length) {
      return <EmptyChat />;
    }
    return (
      <FlatList
        inverted
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    );
  }, [messages, loading, currentUid]);

  return (
    <AppContainer noHorizontalPadding noVerticalPadding>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <MessageHeader
          name={otherUserName}
          image={otherUserAvatar}
          isOnline={isOnline}
          lastSeen={lastSeenLabel}
          onBack={() => navigation.goBack()}
          onMenuPress={() => {}}
        />
        <View style={styles.body}>{content}</View>
        <MessageInput
          value={text}
          onChangeText={setText}
          onSend={sendMessage}
          onEmojiPress={() => {}}
          onPickImage={() => {}}
        />
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
