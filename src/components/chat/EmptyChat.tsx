import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

interface EmptyChatProps {
  title?: string;
  subtitle?: string;
}

function EmptyChat({
  title = "No messages yet",
  subtitle = "Start the conversation by sending your first message.",
}: EmptyChatProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={60}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export default memo(EmptyChat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F4F6FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
});
