import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../../navigation/types";
import AppContainer from "../../components/common/AppContainer";

export default function NotificationScreen() {
  const navigation =
    useNavigation<RootStackScreenProps<"ChatDetail">["navigation"]>();

  return (
    <AppContainer>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>
          💬 Notification Screen
        </Text>
      </View>
    </AppContainer>
  );
}
