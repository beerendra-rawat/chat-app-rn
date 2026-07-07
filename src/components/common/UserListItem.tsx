import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserAvatar from "../common/UserAvatar";
import ActionButton, { ActionButtonVariant } from "./ActionButton";
import { User } from "../../types/user";
import Colors from "../../constants/Colors";

type FriendshipStatus = "none" | "pending" | "sent" | "friends";

type Props = {
  user: User;
  currentUserUid: string;
  friendshipStatus: FriendshipStatus;
  onAddFriend: (targetUid: string) => void | Promise<void>;
  onCancelRequest: (targetUid: string) => void | Promise<void>;
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

  // ✅ Local optimistic status so the button updates instantly,
  // even if the parent list hasn't re-rendered yet.
  const [localStatus, setLocalStatus] =
    useState<FriendshipStatus>(friendshipStatus);
  const [busy, setBusy] = useState(false);

  // ✅ Keep local state in sync whenever the parent's prop actually changes
  // (e.g. after a Firestore listener updates the real status).
  useEffect(() => {
    setLocalStatus(friendshipStatus);
  }, [friendshipStatus]);

  const handleAction = async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (localStatus === "none") {
        setLocalStatus("sent"); // ✅ optimistic flip: "Add Friend" -> "Cancel"
        await onAddFriend(user.uid);
      } else if (localStatus === "sent" || localStatus === "pending") {
        setLocalStatus("none"); // ✅ optimistic flip: "Cancel" -> "Add Friend"
        await onCancelRequest(user.uid);
      }
    } catch (err) {
      // Revert on failure since the backend call didn't succeed
      setLocalStatus(friendshipStatus);
      console.error("Friend action failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const getButtonConfig = (): {
    label: string;
    variant: ActionButtonVariant;
  } => {
    if (isSelf) return { label: "You", variant: "neutral" };
    if (localStatus === "friends")
      return { label: "Friends ✓", variant: "friends" };
    if (localStatus === "sent" || localStatus === "pending")
      return { label: "Cancel", variant: "cancel" };
    return { label: "Add Friend", variant: "add" };
  };

  const { label, variant } = getButtonConfig();

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
        <ActionButton
          label={label}
          variant={variant}
          onPress={handleAction}
          disabled={busy}
        />
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
});
