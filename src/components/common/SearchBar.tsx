import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#777" style={styles.searchIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoFocus={autoFocus}
        style={styles.input}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
        >
          <Feather name="x-circle" size={20} color="#777" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 0,
  },
});
