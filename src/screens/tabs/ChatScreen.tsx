import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppContainer from "../../components/common/AppContainer";
import StoryBar from "../../components/chat/StoryBar";
import RecentChatItem from "../../components/chat/RecentChatItem";
import UploadProgressOverlay from "../../components/chat/UploadProgressOverlay";
import ChatListSkeleton from "../../components/chat/ChatListSkeleton"; // ✅ new
import { useAppSelector } from "../../redux/store/hooks";
import { useStories } from "../../hooks/useStories";
import { useRecentChats } from "../../hooks/useRecentChats";
import { useUserProfiles } from "../../hooks/queries/useUserProfiles";
import { storyService } from "../../services/story.service";
import { pickImageFromLibrary } from "../../utils/imagePicker";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import Colors from "../../constants/Colors";

export default function ChatScreen({ navigation }: any) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const friends = useAppSelector((state) => state.friends.friends);
  const friendIds = friends ?? [];

  const { storyGroups } = useStories(currentUser?.uid, friendIds);
  const {
    chats,
    otherUserIds,
    loading: chatsLoading,
  } = useRecentChats(currentUser?.uid);
  const { data: userProfiles } = useUserProfiles(otherUserIds);

  const profiles = useMemo(() => {
    const map: Record<string, { name: string; avatar?: string | null }> = {};
    (userProfiles ?? []).forEach((u: any) => {
      map[u.uid] = {
        name: u.fullName || u.displayName || u.name || "Unknown",
        avatar: u.avatar ?? u.photoURL,
      };
    });
    return map;
  }, [userProfiles]);

  const [postingStory, setPostingStory] = useState(false);

  // ✅ new — pull-to-refresh. Chats/stories are already live via onSnapshot,
  // so there's nothing to manually refetch; this just gives users the
  // expected pull gesture with a brief, honest spinner.
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const handleAddStory = useCallback(async () => {
    if (!currentUser?.uid || postingStory) return;
    try {
      const uri = await pickImageFromLibrary();
      if (!uri) return;

      setPostingStory(true);

      const mediaUrl = await uploadToCloudinary(uri);

      await storyService.addStory(
        currentUser.uid,
        currentUser.displayName ?? "You",
        currentUser.photoURL,
        mediaUrl,
      );
    } catch (err) {
      if (err instanceof Error && err.message === "PERMISSION_DENIED") {
        Alert.alert(
          "Permission needed",
          "Allow photo library access to post a story.",
        );
      } else {
        console.error("Failed to post story:", err);
        Alert.alert("Upload failed", "Could not post your story. Try again.");
      }
    } finally {
      setPostingStory(false);
    }
  }, [currentUser, postingStory]);

  const handleOpenStory = useCallback(
    (userId: string) => {
      if (!storyGroups.length || !currentUser?.uid) return;
      navigation.navigate("StoryViewer", {
        storyGroups,
        initialUserId: userId,
        currentUid: currentUser.uid,
      });
    },
    [storyGroups, currentUser, navigation],
  );

  const handleOpenChat = useCallback(
    (chatId: string, otherUserId: string) => {
      const profile = profiles[otherUserId];
      navigation.navigate("ChatDetail", {
        chatId,
        otherUserId,
        otherUserName: profile?.name ?? "Chat",
        otherUserAvatar: profile?.avatar ?? null,
      });
    },
    [navigation, profiles],
  );

  // ✅ new — skeleton while chats are first loading, matches the real layout
  if (chatsLoading) {
    return (
      <AppContainer noHorizontalPadding noVerticalPadding>
        <ChatListSkeleton />
      </AppContainer>
    );
  }

  return (
    <AppContainer noHorizontalPadding noVerticalPadding>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <StoryBar
              currentUid={currentUser?.uid}
              currentUserAvatar={currentUser?.photoURL}
              storyGroups={storyGroups}
              onOpenStory={handleOpenStory}
              onAddStory={handleAddStory}
            />
          </View>
        }
        renderItem={({ item }) => {
          const otherUserId =
            item.participants.find((p: string) => p !== currentUser?.uid) ?? "";
          const profile = profiles[otherUserId];

          const lastReadByMe = item.lastReadAt?.[currentUser?.uid ?? ""] ?? 0;
          const isUnread =
            !!item.lastMessageAt &&
            item.lastMessageSenderId !== currentUser?.uid &&
            lastReadByMe < item.lastMessageAt;

          return (
            <RecentChatItem
              name={profile?.name ?? "..."}
              avatar={profile?.avatar}
              lastMessage={item.lastMessage}
              lastMessageAt={item.lastMessageAt}
              isUnread={isUnread}
              onPress={() => handleOpenChat(item.id, otherUserId)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={
          chats.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No chats yet — start a conversation from Friends 👋
            </Text>
          </View>
        }
      />

      <UploadProgressOverlay visible={postingStory} label="Posting story..." />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 82,
  },
  emptyContainer: { flexGrow: 1 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: { color: Colors.textSecondary, fontSize: 15, textAlign: "center" },
});
