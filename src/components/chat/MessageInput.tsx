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
  onMicPress?: () => void;

  placeholder?: string;
  editable?: boolean;
}

function MessageInput({
  value,
  onChangeText,
  onSend,
  onPickImage,
  onEmojiPress,
  onMicPress,
  placeholder = "Type a message...",
  editable = true,
}: MessageInputProps) {
  const hasText = value.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Input Box */}
      <View style={styles.inputContainer}>
        {/* Emoji */}
        <TouchableOpacity activeOpacity={0.7} onPress={onEmojiPress}>
          <Ionicons
            name="happy-outline"
            size={24}
            color={Colors.textSecondary ?? "#777"}
          />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={editable}
          textAlignVertical="top"
        />

        {/* Attachment */}
        <TouchableOpacity activeOpacity={0.7} onPress={onPickImage}>
          <Ionicons
            name="attach"
            size={24}
            color={Colors.textSecondary ?? "#777"}
          />
        </TouchableOpacity>
      </View>

      {/* Send / Mic */}
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.8}
        onPress={hasText ? onSend : onMicPress}
      >
        <Ionicons name={hasText ? "send" : "mic"} size={22} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

export default memo(MessageInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
  },

  inputContainer: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: "#F5F6F8",
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: 4,
  },

  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
});
