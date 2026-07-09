import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "../common/Skeleton";
import SkeletonCircle from "../common/SkeletonCircle";

function StoryItemSkeleton() {
  return (
    <View style={styles.storyItem}>
      <SkeletonCircle size={64} />
      <Skeleton width={50} height={10} style={{ marginTop: 6 }} />
    </View>
  );
}

function ChatRowSkeleton() {
  return (
    <View style={styles.chatRow}>
      <SkeletonCircle size={54} />
      <View style={styles.chatContent}>
        <View style={styles.chatTopRow}>
          <Skeleton width="45%" height={15} />
          <Skeleton width={40} height={11} />
        </View>
        <Skeleton width="70%" height={13} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export default function ChatListSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.storyRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StoryItemSkeleton key={i} />
        ))}
      </View>
      {Array.from({ length: 6 }).map((_, i) => (
        <ChatRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 4 },
  storyRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  storyItem: { alignItems: "center", width: 72, marginRight: 8 },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chatContent: { flex: 1, marginLeft: 12 },
  chatTopRow: { flexDirection: "row", justifyContent: "space-between" },
});
