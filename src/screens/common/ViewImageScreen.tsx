// src/screens/common/ViewImageScreen.tsx
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/auth/BackButton";
import Colors from "../../constants/Colors";
import { RootStackScreenProps } from "../../navigation/types"; // ✅ updated — replaces `any`

const { width, height } = Dimensions.get("window");

type Props = RootStackScreenProps<"ViewImage">;

export default function ViewImageScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;
  const [loading, setLoading] = useState(true); // ✅ new

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />{" "}
      {/* ✅ new — keeps icons visible on black bg */}
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
      <View style={styles.imageWrapper}>
        {!!imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLoadEnd={() => setLoading(false)} // ✅ new
          />
        )}
        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.onImage}
            style={styles.loader} // ✅ new
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width,
    height,
  },
  loader: {
    // ✅ new — sits centered over the image area while it decodes
    position: "absolute",
  },
});
