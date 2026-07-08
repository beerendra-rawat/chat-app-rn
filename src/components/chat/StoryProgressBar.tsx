import React from "react";
import { View, StyleSheet } from "react-native";

interface StoryProgressBarProps {
  count: number;
  activeIndex: number;
  progress: number; // 0–1, progress within the active segment
}

export default function StoryProgressBar({
  count,
  activeIndex,
  progress,
}: StoryProgressBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width:
                  i < activeIndex
                    ? "100%"
                    : i === activeIndex
                      ? `${progress * 100}%`
                      : "0%",
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4, paddingHorizontal: 8 },
  track: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#FFFFFF" },
});
