import React, { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import UserAvatar from "../common/UserAvatar";
import Colors from "../../constants/Colors";

interface RecentChatItemProps {
  name: string;
  avatar?: string | null;
  lastMessage: string;
  lastMessageAt?: number;
  isOnline?: boolean;
  isUnread?: boolean;
  onPress: () => void;
}

function formatChatTime(timestamp?: number) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function RecentChatItem({
  name,
  avatar,
  lastMessage,
  lastMessageAt,
  isOnline,
  isUnread,
  onPress,
}: RecentChatItemProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#E5E7EB" }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.avatarWrap}>
        <UserAvatar image={avatar} size={54} />
        {isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.time}>{formatChatTime(lastMessageAt)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text
            numberOfLines={1}
            style={[styles.message, isUnread && styles.unreadMessage]}
          >
            {lastMessage || "Say hi 👋"}
          </Text>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </Pressable>
  );
}

export default memo(RecentChatItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pressed: { backgroundColor: "#F5F6F8" },
  avatarWrap: { position: "relative" },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  content: { flex: 1, marginLeft: 12 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  time: { fontSize: 12, color: Colors.textSecondary },
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  message: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  unreadMessage: { color: Colors.text, fontWeight: "600" },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
});
