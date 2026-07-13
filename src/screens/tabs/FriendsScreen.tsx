import { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppContainer from "../../components/common/AppContainer";
import SearchBar from "../../components/common/SearchBar";
import FriendListItem from "../../components/common/FriendListItem";
import PeopleListSkeleton from "../../components/common/PeopleListSkeleton";
import { useAppSelector } from "../../redux/store/hooks";
import { useUserProfiles } from "../../hooks/queries/useUserProfiles";
import { useFriendMutations } from "../../hooks/queries/useFriendMutations";
import { RootStackParamList } from "../../types/navigation";
import { User } from "../../types/user";
import Colors from "../../constants/Colors";

type Tab = "friends" | "requests"; // ✅ reordered — friends first

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("friends"); // ✅ fixed — default selected tab is now Friends
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const currentUid = useAppSelector((state) => state.auth.user?.uid);

  const friendIds = useAppSelector((state) => state.friends.friends);
  const receivedIds = useAppSelector((state) => state.friends.receivedRequests);

  const {
    data: friends = [],
    isLoading: loadingFriends,
    refetch: refetchFriends,
  } = useUserProfiles(friendIds);

  const {
    data: requests = [],
    isLoading: loadingRequests,
    refetch: refetchRequests,
  } = useUserProfiles(receivedIds);

  const { acceptRequest, rejectRequest, removeFriend } = useFriendMutations();

  const filterBySearch = (list: User[]) => {
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (u) =>
        (u.fullName?.toLowerCase() || "").includes(term) ||
        (u.email?.toLowerCase() || "").includes(term),
    );
  };

  const data = useMemo(
    () => filterBySearch(tab === "requests" ? requests : friends),
    [tab, requests, friends, search],
  );

  const loading = tab === "requests" ? loadingRequests : loadingFriends;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchFriends(), refetchRequests()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchFriends, refetchRequests]);

  const buildChatId = (uidA: string, uidB: string) =>
    [uidA, uidB].sort().join("_");

  const handleOpenChat = (user: User) => {
    if (!currentUid) return;
    navigation.navigate("ChatDetail", {
      chatId: buildChatId(currentUid, user.uid),
      otherUserId: user.uid,
      otherUserName: user.fullName || "Unknown User",
      otherUserAvatar: user.avatar,
    });
  };

  return (
    <AppContainer>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search people..."
      />

      <View style={styles.tabRow}>
        {/* ✅ reordered — Friends tab now first (left) */}
        <TouchableOpacity
          style={[styles.tab, tab === "friends" && styles.tabActive]}
          onPress={() => setTab("friends")}
        >
          <Text
            style={[styles.tabText, tab === "friends" && styles.tabTextActive]}
          >
            Friends {friends.length > 0 ? `(${friends.length})` : ""}
          </Text>
        </TouchableOpacity>

        {/* ✅ reordered — Requests tab now second (right) */}
        <TouchableOpacity
          style={[styles.tab, tab === "requests" && styles.tabActive]}
          onPress={() => setTab("requests")}
        >
          <Text
            style={[styles.tabText, tab === "requests" && styles.tabTextActive]}
          >
            Requests {requests.length > 0 ? `(${requests.length})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <PeopleListSkeleton />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <FriendListItem
              user={item}
              mode={tab === "requests" ? "request" : "friend"}
              busy={
                acceptRequest.isPending ||
                rejectRequest.isPending ||
                removeFriend.isPending
              }
              onAccept={(uid) => acceptRequest.mutate(uid)}
              onReject={(uid) => rejectRequest.mutate(uid)}
              onRemove={(uid) => removeFriend.mutate(uid)}
              onPress={handleOpenChat}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary || "#007AFF"]}
              tintColor={Colors.primary || "#007AFF"}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {tab === "requests"
                  ? "No pending friend requests"
                  : "You haven't added any friends yet"}
              </Text>
            </View>
          }
          contentContainerStyle={
            data.length === 0 ? styles.emptyContainer : undefined
          }
        />
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary || "#8E8E93",
  },
  tabTextActive: { color: Colors.primary || "#007AFF" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyContainer: { flexGrow: 1 },
  emptyText: { fontSize: 15, color: Colors.textSecondary || "#8E8E93" },
});
