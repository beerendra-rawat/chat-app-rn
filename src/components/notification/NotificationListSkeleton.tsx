import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "../common/Skeleton";
import SkeletonCircle from "../common/SkeletonCircle";

function NotificationRowSkeleton() {
  return (
    <View style={styles.row}>
      <SkeletonCircle size={50} />
      <View style={styles.content}>
        <Skeleton width="85%" height={14} />
        <Skeleton width={60} height={11} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export default function NotificationListSkeleton() {
  return (
    <View>
      <Skeleton
        width={70}
        height={13}
        style={{ marginHorizontal: 16, marginTop: 14, marginBottom: 6 }}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <NotificationRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: { flex: 1, marginLeft: 12 },
});
