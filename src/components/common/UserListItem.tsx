// src/components/common/UserListItem.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserAvatar from "../common/UserAvatar";
import { User } from "../../types/user";
import Colors from "../../constants/Colors"; // ← Make sure this path is correct

type Props = {
  user: User;
  currentUserUid: string;
  friendshipStatus: "none" | "pending" | "sent" | "friends";
  onAddFriend: (targetUid: string) => void;
  onCancelRequest: (targetUid: string) => void;
  onPress?: (user: User) => void;
};

export default function UserListItem({
  user,
  currentUserUid,
  friendshipStatus,
  onAddFriend,
  onCancelRequest,
  onPress,
}: Props) {
  const isSelf = user.uid === currentUserUid;

  const handleAction = () => {
    if (friendshipStatus === "none") onAddFriend(user.uid);
    else if (friendshipStatus === "sent" || friendshipStatus === "pending") {
      onCancelRequest(user.uid);
    }
  };

  const getButtonText = () => {
    if (isSelf) return "You";
    if (friendshipStatus === "friends") return "Friends ✓";
    if (friendshipStatus === "sent" || friendshipStatus === "pending")
      return "Cancel";
    return "Add Friend";
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(user)}
      activeOpacity={0.7}
    >
      <UserAvatar image={user.avatar || user.photoURL} size={50} />

      <View style={styles.info}>
        <Text style={styles.username}>
          {user.fullName || user.displayName || user.username || "Unknown User"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      {!isSelf && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            friendshipStatus === "friends"
              ? styles.friendsButton
              : friendshipStatus === "sent" || friendshipStatus === "pending"
                ? styles.cancelButton
                : styles.addButton,
          ]}
          onPress={handleAction}
        >
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || "#E5E5EA",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text || "#1C1C1E",
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary || "#8E8E93",
    marginTop: 2,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  addButton: { backgroundColor: Colors.primary || "#007AFF" },
  cancelButton: { backgroundColor: "#EF4444" },
  friendsButton: { backgroundColor: "#22C55E" },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
