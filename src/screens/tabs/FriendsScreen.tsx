import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../../navigation/types";
import AppContainer from "../../components/common/AppContainer";
import SearchBar from "../../components/common/SearchBar";
import { useState } from "react";

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const navigation =
    useNavigation<RootStackScreenProps<"ChatDetail">["navigation"]>();

  return (
    <AppContainer>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search people..."
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>
          💬 Friends Screen
        </Text>
      </View>
    </AppContainer>
  );
}
