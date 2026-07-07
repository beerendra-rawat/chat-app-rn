import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
};

function MessageBubble({ message, isMyMessage }: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myContainer : styles.otherContainer,
      ]}
    >
      <Pressable
        android_ripple={{ color: "#E5E7EB" }}
        style={({ pressed }) => [
          styles.bubble,
          isMyMessage ? styles.myBubble : styles.otherBubble,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.messageText}>{message.text}</Text>

        <View style={styles.footer}>
          <Text style={styles.time}>
            {formatTime(message.createdAt).toLowerCase()}
          </Text>

          {isMyMessage && (
            <View style={styles.status}>
              <MessageStatus isRead={message.isRead} size={15} />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

export default memo(MessageBubble);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 3,
    paddingHorizontal: 12,
  },

  myContainer: {
    alignItems: "flex-end",
  },

  otherContainer: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "76%",
    minWidth: 80,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 22,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  myBubble: {
    backgroundColor: "#DCF8C6",

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 6,
  },

  otherBubble: {
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 22,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#1F2937",
    fontWeight: "400",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 6,
  },

  time: {
    fontSize: 11,
    color: "#6B7280",
  },

  status: {
    marginLeft: 4,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
