import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import AppContainer from "../../components/common/AppContainer";
import NotificationItem from "../../components/notification/NotificationItem";
import NotificationListSkeleton from "../../components/notification/NotificationListSkeleton";
import { useAppSelector } from "../../redux/store/hooks";
import { useNotifications } from "../../hooks/useNotifications";
import { notificationService } from "../../services/notification.service";
import { chatService } from "../../services/chat.service";
import { groupByDateLabel } from "../../utils/lastTime";
import { AppNotification } from "../../types/notification";
import Colors from "../../constants/Colors";

type FlatRow =
  | { type: "header"; id: string; title: string }
  | {
      type: "item";
      id: string;
      notification: AppNotification;
      isFirstInSection: boolean;
    };

export default function NotificationScreen({ navigation }: any) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { notifications, loading, unreadCount } = useNotifications(
    currentUser?.uid,
  );

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // notifications are already live via onSnapshot — nothing to refetch,
    // this just gives the expected pull gesture with a brief spinner
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const sections = useMemo(
    () => groupByDateLabel(notifications, (n) => n.createdAt),
    [notifications],
  );

  const flatData = useMemo<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    sections.forEach((section) => {
      rows.push({
        type: "header",
        id: `header-${section.title}`,
        title: section.title,
      });
      section.data.forEach((notification, index) => {
        rows.push({
          type: "item",
          id: notification.id,
          notification,
          isFirstInSection: index === 0,
        });
      });
    });
    return rows;
  }, [sections]);

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

  const renderRow = useCallback(
    ({ item }: { item: FlatRow }) => {
      if (item.type === "header") {
        return <Text style={styles.sectionHeader}>{item.title}</Text>;
      }
      return (
        <>
          {!item.isFirstInSection && <View style={styles.separator} />}
          <NotificationItem
            notification={item.notification}
            onPress={() => handlePressNotification(item.notification)}
          />
        </>
      );
    },
    [handlePressNotification],
  );

  const ListHeader = useMemo(() => {
    if (unreadCount <= 0) return null;
    return (
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>
    );
  }, [unreadCount, handleMarkAllRead]);

  if (loading) {
    return (
      <AppContainer noHorizontalPadding noVerticalPadding>
        <NotificationListSkeleton />
      </AppContainer>
    );
  }

  return (
    // No `scrollable` here — FlatList is now the single scroll owner.
    <AppContainer noHorizontalPadding noVerticalPadding>
      <FlatList
        data={flatData}
        keyExtractor={(row) => row.id}
        renderItem={renderRow}
        style={styles.list}
        contentContainerStyle={
          flatData.length === 0 ? styles.emptyContentContainer : undefined
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>You're all caught up 🎉</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
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
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyContentContainer: { flexGrow: 1 },
  emptyText: { color: Colors.textSecondary, fontSize: 15 },
});
