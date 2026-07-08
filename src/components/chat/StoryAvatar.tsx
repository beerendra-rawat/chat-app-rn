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
  onAddPress?: () => void; // ✅ now fires from a separate always-visible badge when isOwn
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

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        // ✅ fixed — own avatar opens the viewer whenever a story exists;
        // adding is now a separate badge below, not tied to hasStory
        onPress={hasStory ? onPress : onAddPress}
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
      </TouchableOpacity>

      {isOwn && (
        // ✅ fixed — always rendered for own avatar (not just when hasStory is false),
        // so the + button stays visible even after you've posted stories
        <TouchableOpacity
          style={styles.addBadge}
          activeOpacity={0.8}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={14} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
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
