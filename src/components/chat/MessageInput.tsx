import React, { memo } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage?: () => void;
  onEmojiPress?: () => void;
  placeholder?: string;
  editable?: boolean;
}

function MessageInput({
  value,
  onChangeText,
  onSend,
  onPickImage,
  onEmojiPress,
  placeholder = "Type a message...",
  editable = true,
}: MessageInputProps) {
  const hasText = value.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Emoji */}
        <TouchableOpacity onPress={onEmojiPress}>
          <Ionicons
            name="happy-outline"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          editable={editable}
          maxLength={1000}
        />

        {/* Image */}
        <TouchableOpacity onPress={onPickImage}>
          <Ionicons
            name="image-outline"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Send */}
      <TouchableOpacity
        style={[styles.sendButton, !hasText && styles.sendButtonDisabled]}
        disabled={!hasText}
        onPress={onSend}
      >
        <Ionicons name="send" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

export default memo(MessageInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: "#F5F6F8",
    borderRadius: 28,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },

  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: Colors.primary,
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },
});
