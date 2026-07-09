import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AppContainer from "../../components/common/AppContainer";
import EmptyChat from "../../components/chat/EmptyChat";
import MessageHeader from "../../components/chat/MessageHeader";
import MessageInput from "../../components/chat/MessageInput";
import MessageBubble from "../../components/chat/MessageBubble";
import EmojiPicker from "../../components/chat/EmojiPicker";
import { RootStackScreenProps } from "../../navigation/types";
import { Message } from "../../types/chat";
import { chatService } from "../../services/chat.service";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useAppSelector } from "../../redux/store/hooks";
import { usePresence } from "../../hooks/usePresence";
import { pickImageFromLibrary } from "../../utils/imagePicker";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import Colors from "../../constants/Colors";

type Props = RootStackScreenProps<"ChatDetail">;

export default function MessageScreen({ navigation, route }: Props) {
  const { chatId, otherUserId, otherUserName, otherUserAvatar } = route.params;

  const currentUid = useAppSelector((state) => state.auth.user?.uid);
  const { messages, loading } = useChatMessages(chatId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isOnline, lastSeenLabel } = usePresence(otherUserId);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!currentUid || !otherUserId) return;
    chatService
      .ensureChatDocument(chatId, currentUid, otherUserId)
      .catch((err) => console.error("Failed to ensure chat document:", err));
  }, [chatId, currentUid, otherUserId]);

  useEffect(() => {
    if (!currentUid || !isFocused || !messages.length) return;
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

  const handlePickImage = useCallback(async () => {
    if (!currentUid || uploadingImage) return;
    try {
      const uri = await pickImageFromLibrary();
      if (!uri) return;

      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(uri);
      await chatService.sendImageMessage(chatId, currentUid, imageUrl);
    } catch (err) {
      if (err instanceof Error && err.message === "PERMISSION_DENIED") {
        Alert.alert(
          "Permission needed",
          "Allow photo library access to share images.",
        );
      } else {
        console.error("Failed to send image:", err);
        Alert.alert("Upload failed", "Could not send the image. Try again.");
      }
    } finally {
      setUploadingImage(false);
    }
  }, [chatId, currentUid, uploadingImage]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setText((prev) => prev + emoji);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    Keyboard.dismiss();
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (showEmojiPicker) setShowEmojiPicker(false);
  }, [showEmojiPicker]);

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

        {uploadingImage && (
          <View style={styles.uploadingBar}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.uploadingText}>Sending image...</Text>
          </View>
        )}

        <MessageInput
          value={text}
          onChangeText={setText}
          onSend={sendMessage}
          onEmojiPress={toggleEmojiPicker}
          onPickImage={handlePickImage}
          onFocus={handleInputFocus}
          editable={!uploadingImage}
        />

        {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
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
  uploadingBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    backgroundColor: "#F5F6F8",
  },
  uploadingText: { marginLeft: 8, fontSize: 13, color: Colors.textSecondary },
});
