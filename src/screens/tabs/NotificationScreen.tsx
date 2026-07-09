import React, { useCallback, useMemo } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import AppContainer from "../../components/common/AppContainer";
import NotificationItem from "../../components/notification/NotificationItem";
import { useAppSelector } from "../../redux/store/hooks";
import { useNotifications } from "../../hooks/useNotifications";
import { notificationService } from "../../services/notification.service";
import { chatService } from "../../services/chat.service";
import { groupByDateLabel } from "../../utils/lastTime";
import { AppNotification } from "../../types/notification";
import Colors from "../../constants/Colors";

export default function NotificationScreen({ navigation }: any) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { notifications, loading, unreadCount } = useNotifications(
    currentUser?.uid,
  );

  const sections = useMemo(
    () => groupByDateLabel(notifications, (n) => n.createdAt),
    [notifications],
  );

  const handleMarkAllRead = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      await notificationService.markAllAsRead(currentUser.uid);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }, [currentUser]);

  const handlePressNotification = useCallback(
    async (notification: AppNotification) => {
      if (!notification.isRead) {
        notificationService
          .markAsRead(notification.id)
          .catch((err) =>
            console.error("Failed to mark notification as read:", err),
          );
      }

      if (!currentUser?.uid) return;

      if (notification.type === "message" && notification.chatId) {
        navigation.navigate("ChatDetail", {
          chatId: notification.chatId,
          otherUserId: notification.fromUserId,
          otherUserName: notification.fromUserName,
          otherUserAvatar: notification.fromUserAvatar ?? null,
        });
        return;
      }

      if (notification.type === "friend_request") {
        navigation.navigate("Friends");
        return;
      }

      if (notification.type === "friend_request_accepted") {
        // ✅ friend is now accepted — open (or start) a chat with them
        const chatId = chatService.buildChatId(
          currentUser.uid,
          notification.fromUserId,
        );
        try {
          await chatService.ensureChatDocument(
            chatId,
            currentUser.uid,
            notification.fromUserId,
          );
          navigation.navigate("ChatDetail", {
            chatId,
            otherUserId: notification.fromUserId,
            otherUserName: notification.fromUserName,
            otherUserAvatar: notification.fromUserAvatar ?? null,
          });
        } catch (err) {
          console.error("Failed to open chat from notification:", err);
        }
      }
    },
    [navigation, currentUser],
  );

  return (
    <AppContainer noHorizontalPadding noVerticalPadding>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handlePressNotification(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={
          sections.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>You're all caught up 🎉</Text>
            </View>
          ) : null
        }
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 28, fontWeight: "700", color: Colors.text },
  markAllText: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: Colors.background,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 78,
  },
  emptyContainer: { flexGrow: 1 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: { color: Colors.textSecondary, fontSize: 15 },
});
