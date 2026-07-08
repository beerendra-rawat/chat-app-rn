import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Colors from "../../constants/Colors";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "😘",
  "😜",
  "🤔",
  "😎",
  "😢",
  "😭",
  "😡",
  "😱",
  "🥳",
  "👍",
  "👎",
  "👏",
  "🙏",
  "💪",
  "❤️",
  "💔",
  "🔥",
  "✨",
  "🎉",
  "😴",
  "🤗",
  "😅",
  "🙄",
  "😇",
  "🤩",
  "😋",
  "😳",
  "🥺",
  "😤",
  "🤝",
  "👋",
  "✌️",
  "🤞",
  "💯",
];

function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={EMOJIS}
        keyExtractor={(item, i) => `${item}-${i}`}
        numColumns={8}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.emojiButton}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default EmojiPicker;

const styles = StyleSheet.create({
  container: {
    height: 260,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    paddingTop: 8,
  },
  emojiButton: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 24 },
});
