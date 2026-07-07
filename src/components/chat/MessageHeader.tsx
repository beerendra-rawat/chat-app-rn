import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import BackButton from "../auth/BackButton";
import UserAvatar from "../common/UserAvatar";

interface MessageHeaderProps {
  name: string;
  image?: string | null;

  isOnline?: boolean;
  lastSeen?: string;

  onBack: () => void;
  onMenuPress?: () => void;
}

function MessageHeader({
  name,
  image,
  isOnline = false,
  lastSeen,
  onBack,
  onMenuPress,
}: MessageHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.leftContainer}>
        <BackButton onPress={onBack} />

        <UserAvatar image={image} size={48} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          <Text style={styles.status} numberOfLines={1}>
            {isOnline ? "Online" : (lastSeen ?? "Offline")}
          </Text>
        </View>
      </View>

      {/* Right */}
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={0.7}
        onPress={onMenuPress}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(MessageHeader);

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: Colors.background,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECECEC",
  },

  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  status: {
    marginTop: 2,
    fontSize: 13,
    color: "#7A7A7A",
  },

  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
