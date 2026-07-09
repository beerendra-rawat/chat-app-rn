import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";

function PersonRowSkeleton() {
  return (
    <View style={styles.row}>
      <SkeletonCircle size={54} />
      <View style={styles.content}>
        <Skeleton width="55%" height={15} />
        <Skeleton width="70%" height={12} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={90} height={34} borderRadius={17} />
    </View>
  );
}

export default function PeopleListSkeleton() {
  return (
    <View>
      {Array.from({ length: 6 }).map((_, i) => (
        <PersonRowSkeleton key={i} />
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
  content: { flex: 1, marginLeft: 12, marginRight: 12 },
});
