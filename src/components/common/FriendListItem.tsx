import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserAvatar from "./UserAvatar";
import ActionButton from "./ActionButton";
import { User } from "../../types/user";
import Colors from "../../constants/Colors";

type Props = {
  user: User;
  mode: "request" | "friend";
  busy?: boolean;
  onAccept?: (uid: string) => void;
  onReject?: (uid: string) => void;
  onRemove?: (uid: string) => void;
  onPress?: (user: User) => void;
};

export default function FriendListItem({
  user,
  mode,
  busy,
  onAccept,
  onReject,
  onRemove,
  onPress,
}: Props) {
  // ✅ only friend rows navigate to chat on tap — request rows shouldn't
  // open a chat until the request is actually accepted
  const isTappable = mode === "friend";

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={isTappable ? 0.7 : 1} // ✅ no press feedback for requests
      disabled={!isTappable} // ✅ blocks navigation entirely for requests
      onPress={isTappable ? () => onPress?.(user) : undefined}
    >
      <UserAvatar image={user.avatar} size={50} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.fullName || "Unknown User"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      <View style={styles.actions}>
        {mode === "request" ? (
          <>
            <ActionButton
              label="Accept"
              variant="friends"
              disabled={busy}
              onPress={() => onAccept?.(user.uid)}
              style={styles.smallButton}
            />
            <ActionButton
              label="Delete"
              variant="cancel"
              disabled={busy}
              onPress={() => onReject?.(user.uid)}
              style={styles.smallButton}
            />
          </>
        ) : (
          <ActionButton
            label="Remove"
            variant="cancel"
            disabled={busy}
            onPress={() => onRemove?.(user.uid)}
          />
        )}
      </View>
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
  info: { flex: 1, marginLeft: 12, marginRight: 8 },
  name: { fontSize: 16, fontWeight: "600", color: Colors.text || "#1C1C1E" },
  email: {
    fontSize: 13,
    color: Colors.textSecondary || "#8E8E93",
    marginTop: 2,
  },
  actions: { flexDirection: "row", gap: 8 },
  smallButton: { minWidth: 80, paddingHorizontal: 10 },
});
