import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserAvatar from "../common/UserAvatar";
import Colors from "../../constants/Colors";

interface StoryAvatarProps {
  image?: string | null;
  size?: number;
  hasStory: boolean;
  hasUnseen?: boolean;
  isOwn?: boolean;
  onPress: () => void;
  onAddPress?: () => void; // fires only when isOwn && !hasStory
}

export default function StoryAvatar({
  image,
  size = 64,
  hasStory,
  hasUnseen = true,
  isOwn = false,
  onPress,
  onAddPress,
}: StoryAvatarProps) {
  const ringSize = size + 8;
  const showAddBadge = isOwn && !hasStory;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={showAddBadge ? onAddPress : onPress}
    >
      <View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderColor: hasStory
              ? hasUnseen
                ? Colors.primary
                : Colors.border
              : "transparent",
          },
        ]}
      >
        <UserAvatar image={image} size={size} />
      </View>

      {showAddBadge && (
        <View style={styles.addBadge}>
          <Ionicons name="add" size={14} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 2.5, justifyContent: "center", alignItems: "center" },
  addBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
