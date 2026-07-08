import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";

interface UploadProgressOverlayProps {
  visible: boolean;
  label?: string;
  current?: number; // ✅ new — e.g. 2
  total?: number; // ✅ new — e.g. 5, shows "2 of 5"
}

export default function UploadProgressOverlay({
  visible,
  label = "Uploading...",
  current,
  total,
}: UploadProgressOverlayProps) {
  if (!visible) return null;

  const showCount =
    typeof current === "number" && typeof total === "number" && total > 1;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.label}>{label}</Text>
          {showCount && (
            <Text style={styles.count}>
              {current} of {total}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(30,30,30,0.9)",
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 160,
  },
  label: { color: "#FFF", fontSize: 14, marginTop: 10, fontWeight: "600" },
  count: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },
});
