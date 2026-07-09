import React, { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserAvatar from "../common/UserAvatar";
import Colors from "../../constants/Colors";
import { AppNotification } from "../../types/notification";
import { lastTime } from "../../utils/lastTime"; // ✅ new — replaces formatClockTime

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
}

function getNotificationText(n: AppNotification): string {
  switch (n.type) {
    case "message":
      return n.message
        ? `${n.fromUserName}: ${n.message}`
        : `${n.fromUserName} sent you a message`;
    case "friend_request":
      return `${n.fromUserName} sent you a friend request`;
    case "friend_request_accepted":
      return `${n.fromUserName} accepted your friend request`;
    default:
      return "";
  }
}

function getNotificationIcon(
  type: AppNotification["type"],
): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "message":
      return "chatbubble";
    case "friend_request":
      return "person-add";
    case "friend_request_accepted":
      return "checkmark-circle";
    default:
      return "notifications";
  }
}

function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#E5E7EB" }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.avatarWrap}>
        <UserAvatar image={notification.fromUserAvatar} size={50} />
        <View style={styles.badge}>
          <Ionicons
            name={getNotificationIcon(notification.type)}
            size={12}
            color="#FFF"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={2}
          style={[styles.text, !notification.isRead && styles.unreadText]}
        >
          {getNotificationText(notification)}
        </Text>
        <Text style={styles.time}>{lastTime(notification.createdAt)}</Text>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default memo(NotificationItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: { backgroundColor: "#F5F6F8" },
  avatarWrap: { position: "relative" },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, marginLeft: 12 },
  text: { fontSize: 14, color: Colors.text, lineHeight: 19 },
  unreadText: { fontWeight: "700" },
  time: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
});
