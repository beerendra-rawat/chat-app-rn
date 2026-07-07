// src/components/chat/MessageStatus.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MessageStatusProps {
  isRead: boolean;
  size?: number;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ isRead, size = 16 }) => {
  if (isRead) {
    return (
      <View style={styles.container}>
        <Ionicons name="checkmark-done" size={size} color="#34B7F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark" size={size} color="#9E9E9E" />
    </View>
  );
};

export default React.memo(MessageStatus);

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
