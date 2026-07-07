import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import MessageStatus from "./MessageStatus";

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: number;
  isRead: boolean;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isMyMessage: boolean;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function MessageBubble({ message, isMyMessage }: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMyMessage ? styles.myBubble : styles.otherBubble,
        ]}
      >
        <Text style={styles.messageText}>{message.text}</Text>

        <View style={styles.footer}>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>

          {isMyMessage && <MessageStatus isRead={message.isRead} size={16} />}
        </View>
      </View>
    </View>
  );
}

export default memo(MessageBubble);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 4,
  },

  myContainer: {
    alignItems: "flex-end",
  },

  otherContainer: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },

  otherBubble: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
  },

  footer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  time: {
    fontSize: 11,
    color: "#777",
  },
});
