import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Props = {
  image?: string | null;
  size?: number;
  editable?: boolean;
  onPress?: () => void;
};

export default function UserAvatar({
  image,
  size = 120,
  editable = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={editable ? 0.8 : 1}
      onPress={onPress}
      disabled={!editable}
    >
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {image ? (
          <Image
            source={{ uri: image || undefined }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        ) : (
          <Ionicons name="person" size={size * 0.55} color="#999" />
        )}

        {editable && (
          <View style={styles.camera}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  camera: {
    position: "absolute",
    right: 5,
    bottom: 5,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#4F46E5",

    justifyContent: "center",
    alignItems: "center",
  },
});
