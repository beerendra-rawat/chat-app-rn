import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";

export default function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonCircle size={140} />
      <Skeleton width={180} height={22} style={{ marginTop: 20 }} />
      <Skeleton width={240} height={14} style={{ marginTop: 10 }} />
      <Skeleton width={200} height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 60 },
});
