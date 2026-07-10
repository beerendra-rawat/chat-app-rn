import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AppContainer from "../../components/common/AppContainer"; // ✅ new
import UserAvatar from "../../components/common/UserAvatar";
import StoryProgressBar from "../../components/chat/StoryProgressBar";
import { storyService } from "../../services/story.service";
import { RootStackScreenProps } from "../../types/navigation";

const STORY_DURATION_MS = 5000;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MEDIA_HEIGHT = SCREEN_HEIGHT * 0.75;

type Props = RootStackScreenProps<"StoryViewer">;

export default function StoryViewerScreen({ navigation, route }: Props) {
  const { storyGroups, initialUserId, currentUid } = route.params;

  const [groupIndex, setGroupIndex] = useState(() =>
    Math.max(
      0,
      storyGroups.findIndex((g) => g.userId === initialUserId),
    ),
  );
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  const group = storyGroups[groupIndex];
  const story = group?.stories[storyIndex];
  const isOwnStory = story?.userId === currentUid;

  const goToNextStory = useCallback(() => {
    if (!group) return;
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex((i) => i + 1);
      setStoryIndex(0);
    } else {
      navigation.goBack();
    }
  }, [group, storyIndex, groupIndex, storyGroups.length, navigation]);

  const goToPrevStory = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
    } else if (groupIndex > 0) {
      const prevGroup = storyGroups[groupIndex - 1];
      setGroupIndex((i) => i - 1);
      setStoryIndex(prevGroup.stories.length - 1);
    }
  }, [storyIndex, groupIndex, storyGroups]);

  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    setImageLoading(true);
  }, [groupIndex, storyIndex]);

  useEffect(() => {
    if (story && currentUid && !story.viewers.includes(currentUid)) {
      storyService
        .markStoryViewed(story.id, currentUid)
        .catch((err) => console.error("Failed to mark story viewed:", err));
    }
  }, [story, currentUid]);

  useEffect(() => {
    if (paused || imageLoading || !story) return;

    startRef.current = Date.now() - elapsedRef.current;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min(elapsed / STORY_DURATION_MS, 1);
      setProgress(pct);

      if (pct >= 1) {
        goToNextStory();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, imageLoading, story, goToNextStory]);

  const handleDelete = () => {
    if (!story) return;
    Alert.alert("Delete story?", "This story will be removed for everyone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await storyService.deleteStory(story.id);
            goToNextStory();
          } catch (err) {
            console.error("Failed to delete story:", err);
            Alert.alert("Error", "Could not delete this story.");
          }
        },
      },
    ]);
  };

  if (!group || !story) return null;

  return (
    // ✅ new — AppContainer replaces the raw <View>: black background,
    // light status bar (icons visible on black), no padding, not scrollable
    // since this screen uses absolute-positioned overlays, not a list
    <AppContainer
      backgroundColor="#000"
      statusBarStyle="light"
      noHorizontalPadding
      noVerticalPadding
    >
      <View style={styles.container}>
        <View style={styles.mediaWrapper}>
          <Image
            source={{ uri: story.mediaUrl }}
            style={styles.image}
            resizeMode="contain"
            onLoadEnd={() => setImageLoading(false)}
          />

          {imageLoading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}

          <Pressable
            style={styles.leftZone}
            onPress={goToPrevStory}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
          />
          <Pressable
            style={styles.rightZone}
            onPress={goToNextStory}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
          />
        </View>

        <SafeAreaView style={styles.overlay} edges={["top"]}>
          <StoryProgressBar
            count={group.stories.length}
            activeIndex={storyIndex}
            progress={progress}
          />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <UserAvatar image={group.userAvatar} size={34} />
              <Text style={styles.userName}>{group.userName}</Text>
            </View>

            <View style={styles.headerRight}>
              {isOwnStory && (
                <Pressable onPress={handleDelete} style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={22} color="#FFF" />
                </Pressable>
              )}
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
              >
                <Ionicons name="close" size={26} color="#FFF" />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  mediaWrapper: {
    height: MEDIA_HEIGHT,
    marginTop: 60,
    marginBottom: 40,
    marginHorizontal: 0,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  image: { width: "100%", height: "100%" },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  leftZone: { position: "absolute", top: 0, bottom: 0, left: 0, width: "35%" },
  rightZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "65%",
  },
  overlay: { position: "absolute", top: 0, left: 0, right: 0 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  userName: { color: "#FFF", fontSize: 14, fontWeight: "600", marginLeft: 8 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 8, marginLeft: 4 },
});
