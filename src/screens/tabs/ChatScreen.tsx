import { Text, View } from "react-native";
import AppContainer from "../../components/common/AppContainer";

export default function ChatScreen() {
  return (
    <AppContainer>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>💬 Chats</Text>
      </View>
    </AppContainer>
  );
}
