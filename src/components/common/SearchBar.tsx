import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  debounceMs?: number; // ✅ new: how long to wait before notifying parent
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  autoFocus = false,
  debounceMs = 300,
}) => {
  // ✅ Local, uncontrolled-feeling state — typing always updates this instantly,
  // regardless of how slow/expensive the parent's search logic is.
  const [text, setText] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ Sync from parent only when it changes externally (e.g. cleared elsewhere)
  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChangeText = (newText: string) => {
    setText(newText); // ✅ updates immediately, so every keystroke shows up

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeText(newText); // ✅ parent (and its expensive search) only runs after pause
    }, debounceMs);
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setText("");
    onChangeText("");
    onClear?.();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#777" style={styles.searchIcon} />
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoFocus={autoFocus}
        style={styles.input}
        returnKeyType="search"
      />
      {text.length > 0 && (
        <TouchableOpacity activeOpacity={0.7} onPress={handleClear}>
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
