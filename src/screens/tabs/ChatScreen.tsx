import React, { useCallback, useMemo, useState } from "react"; // ✅ added useMemo
import { FlatList, StyleSheet, Text, View } from "react-native";
import AppContainer from "../../components/common/AppContainer";
import StoryBar from "../../components/chat/StoryBar";
import RecentChatItem from "../../components/chat/RecentChatItem";
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
  const friendIds = (friends ?? []).map((f: any) => f.uid);

  const { storyGroups } = useStories(currentUser?.uid, friendIds);
  const {
    chats,
    otherUserIds,
    loading: chatsLoading,
  } = useRecentChats(currentUser?.uid);

  const { data: userProfiles } = useUserProfiles(otherUserIds); // ✅ raw array from React Query

  // ✅ new — build a lookup map { uid: { name, avatar } } from the array
  const profiles = useMemo(() => {
    const map: Record<string, { name: string; avatar?: string | null }> = {};
    (userProfiles ?? []).forEach((u: any) => {
      map[u.uid] = {
        name: u.displayName ?? u.name ?? "Unknown",
        avatar: u.photoURL ?? u.avatar ?? null,
      };
    });
    return map;
  }, [userProfiles]);

  const [postingStory, setPostingStory] = useState(false);

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
      console.error("Failed to post story:", err);
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
      const profile = profiles[otherUserId]; // ✅ fixed — profiles is now defined via useMemo above
      navigation.navigate("ChatDetail", {
        chatId,
        otherUserId,
        otherUserName: profile?.name ?? "Chat",
        otherUserAvatar: profile?.avatar ?? null,
      });
    },
    [navigation, profiles],
  );

  return (
    <AppContainer noHorizontalPadding noVerticalPadding>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Chats</Text>
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
          const profile = profiles[otherUserId]; // ✅ fixed
          return (
            <RecentChatItem
              name={profile?.name ?? "..."}
              avatar={profile?.avatar}
              lastMessage={item.lastMessage}
              lastMessageAt={item.lastMessageAt}
              isUnread={
                !!item.lastMessageAt &&
                item.lastMessageSenderId !== currentUser?.uid
              }
              onPress={() => handleOpenChat(item.id, otherUserId)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={
          chats.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !chatsLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No chats yet — start a conversation from Friends 👋
              </Text>
            </View>
          ) : null
        }
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 12,
    color: Colors.text,
  },
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
