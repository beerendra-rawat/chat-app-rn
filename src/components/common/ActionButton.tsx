import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import Colors from "../../constants/Colors";

export type ActionButtonVariant = "add" | "cancel" | "friends" | "neutral";

type Props = {
  label: string;
  variant: ActionButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const VARIANT_COLORS: Record<ActionButtonVariant, string> = {
  add: Colors.primary || "#007AFF",
  cancel: "#EF4444",
  friends: "#22C55E",
  neutral: "#9CA3AF",
};

export default function ActionButton({
  label,
  variant,
  onPress,
  disabled,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: VARIANT_COLORS[variant] },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
