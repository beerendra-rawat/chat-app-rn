import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import AppContainer from "../../components/common/AppContainer";
import EmptyChat from "../../components/chat/EmptyChat";
import MessageHeader from "../../components/chat/MessageHeader";
import MessageInput from "../../components/chat/MessageInput";
import TypingIndicator from "../../components/chat/TypingIndicator";
import MessageBubble from "../../components/chat/MessageBubble";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: number;
  isRead: boolean;
}

const CURRENT_USER = "1";

export default function MessageScreen({ navigation }: any) {
  const listRef = useRef<FlatList>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [typing] = useState(true);

  const [text, setText] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello 👋",
      senderId: "2",
      createdAt: Date.now(),
      isRead: true,
    },
    {
      id: "2",
      text: "Hi, how are you?",
      senderId: CURRENT_USER,
      createdAt: Date.now(),
      isRead: true,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text,
      senderId: CURRENT_USER,
      createdAt: Date.now(),
      isRead: false,
    };

    setMessages((prev) => [message, ...prev]);

    setText("");
  };

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isMyMessage={item.senderId === CURRENT_USER}
    />
  );

  const content = useMemo(() => {
    if (!messages.length) {
      return <EmptyChat />;
    }

    return (
      <FlatList
        ref={listRef}
        inverted
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={typing ? <TypingIndicator /> : null}
      />
    );
  }, [messages, refreshing, typing]);

  return (
    <AppContainer noHorizontalPadding noVerticalPadding>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <MessageHeader
          name="John Doe"
          image={null}
          isOnline
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
          onMicPress={() => {}}
        />
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
