import React from "react";

import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

type Props = {
  title: string;
  icon: any;
  onPress: () => void;
  loading?: boolean;
};

export default function SocialButton({
  title,
  icon,
  onPress,
  loading = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      <Image source={icon} style={styles.icon} />

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#ECECEC",

    borderRadius: 16,

    paddingVertical: 16,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  icon: {
    width: 22,
    height: 22,

    marginRight: 12,

    resizeMode: "contain",
  },

  text: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
});
