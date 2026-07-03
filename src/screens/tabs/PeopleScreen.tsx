import React, { useState } from "react";
import { View, Text } from "react-native";
import AppContainer from "../../components/common/AppContainer";
import SearchBar from "../../components/common/SearchBar";

export default function PeopleScreen() {
  const [search, setSearch] = useState("");

  return (
    <AppContainer>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search people..."
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
          }}
        >
          💬 People Screen
        </Text>
      </View>
    </AppContainer>
  );
}
