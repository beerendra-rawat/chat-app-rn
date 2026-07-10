import React from "react";
import { Modal, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

interface AuthLoadingOverlayProps {
  visible: boolean;
  label?: string;
}

export default function AuthLoadingOverlay({
  visible,
  label = "Please wait...",
}: AuthLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 160,
  },
  label: { marginTop: 12, fontSize: 14, fontWeight: "600", color: Colors.text },
});
