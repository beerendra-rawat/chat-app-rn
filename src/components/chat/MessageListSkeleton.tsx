import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "../common/Skeleton";

interface BubbleSkeletonProps {
  isMine?: boolean;
  width?: number;
}

function BubbleSkeleton({ isMine = false, width = 160 }: BubbleSkeletonProps) {
  return (
    <View style={[styles.row, isMine ? styles.rowRight : styles.rowLeft]}>
      <Skeleton width={width} height={40} borderRadius={18} />
    </View>
  );
}

export default function MessageListSkeleton() {
  return (
    <View style={styles.container}>
      <BubbleSkeleton isMine width={140} />
      <BubbleSkeleton width={180} />
      <BubbleSkeleton isMine width={100} />
      <BubbleSkeleton isMine width={200} />
      <BubbleSkeleton width={130} />
      <BubbleSkeleton isMine width={90} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 10 },
  row: { width: "100%", marginVertical: 5 },
  rowRight: { alignItems: "flex-end" },
  rowLeft: { alignItems: "flex-start" },
});
