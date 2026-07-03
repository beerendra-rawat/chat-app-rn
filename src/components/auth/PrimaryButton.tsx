import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

import COLORS from "../../constants/Colors";

type Props = TouchableOpacityProps & {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style, loading && styles.buttonDisabled]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,

    paddingVertical: 18,
    marginTop: 24,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
