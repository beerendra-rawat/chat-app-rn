import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import StoryAvatar from "./StoryAvatar";
import Colors from "../../constants/Colors";
import { UserStories } from "../../types/story";

interface StoryBarProps {
  currentUid?: string;
  currentUserAvatar?: string | null;
  storyGroups: UserStories[];
  onOpenStory: (userId: string) => void;
  onAddStory: () => void;
}

export default function StoryBar({
  currentUid,
  currentUserAvatar,
  storyGroups,
  onOpenStory,
  onAddStory,
}: StoryBarProps) {
  const myGroup = storyGroups.find((g) => g.userId === currentUid);
  const others = storyGroups.filter((g) => g.userId !== currentUid);

  const data = [
    {
      userId: currentUid ?? "me",
      userName: "Your story",
      userAvatar: myGroup?.userAvatar ?? currentUserAvatar,
      hasStory: !!myGroup,
      hasUnseen: false,
      isOwn: true,
    },
    ...others.map((g) => ({
      userId: g.userId,
      userName: g.userName,
      userAvatar: g.userAvatar,
      hasStory: true,
      hasUnseen: g.hasUnseen,
      isOwn: false,
    })),
  ];

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.userId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <StoryAvatar
            image={item.userAvatar}
            hasStory={item.hasStory}
            hasUnseen={item.hasUnseen}
            isOwn={item.isOwn}
            onPress={() => onOpenStory(item.userId)}
            onAddPress={onAddStory}
          />
          <Text numberOfLines={1} style={styles.label}>
            {item.userName}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingVertical: 10 },
  item: { alignItems: "center", width: 72, marginRight: 8 },
  label: { fontSize: 12, color: Colors.text, marginTop: 4, maxWidth: 68 },
});
