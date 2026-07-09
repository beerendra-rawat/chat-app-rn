// src/screens/tabs/PeopleScreen.tsx
import React, { useState, useMemo } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native"; // ✅ fixed — removed unused RefreshControl import
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import AppContainer from "../../components/common/AppContainer";
import SearchBar from "../../components/common/SearchBar";
import UserListItem from "../../components/common/UserListItem";
import PeopleListSkeleton from "../../components/common/PeopleListSkeleton";
import { userService } from "../../services/user.service";
import { useFriendMutations } from "../../hooks/queries/useFriendMutations";
import { RootState } from "../../redux/store/store";
import Colors from "../../constants/Colors";

export default function PeopleScreen() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserUid = currentUser?.uid;

  const friends = useSelector((state: RootState) => state.friends.friends);
  const sentRequests = useSelector(
    (state: RootState) => state.friends.sentRequests,
  );
  const receivedRequests = useSelector(
    (state: RootState) => state.friends.receivedRequests,
  );

  const { sendRequest, cancelRequest } = useFriendMutations();

  const {
    data: users = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(currentUserUid!),
    enabled: !!currentUserUid,
    staleTime: 1000 * 60 * 5,
  });

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase().trim();
    return users.filter(
      (user: any) =>
        (user.fullName?.toLowerCase() || "").includes(term) ||
        (user.email?.toLowerCase() || "").includes(term),
    );
  }, [users, search]);

  const getFriendshipStatus = (
    uid: string,
  ): "none" | "friends" | "sent" | "pending" => {
    if (friends.includes(uid)) return "friends";
    if (sentRequests.includes(uid)) return "sent";
    if (receivedRequests.includes(uid)) return "pending";
    return "none";
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <UserListItem
      user={item}
      currentUserUid={currentUserUid!}
      friendshipStatus={getFriendshipStatus(item.uid)}
      onAddFriend={(uid) => sendRequest.mutateAsync(uid)}
      onCancelRequest={(uid) => cancelRequest.mutateAsync(uid)}
    />
  );

  if (isLoading && !users.length) {
    return (
      <AppContainer>
        <PeopleListSkeleton />
      </AppContainer>
    );
  }

  return (
    <AppContainer scrollable refreshing={refreshing} onRefresh={handleRefresh}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search people..."
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error ? "Error loading users" : "No users found"}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </AppContainer>
  );
} // ✅ fixed — this closing brace for PeopleScreen was missing

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 40,
  },
});
