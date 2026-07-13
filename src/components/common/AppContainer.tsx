import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";

interface AppContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark";
  noHorizontalPadding?: boolean;
  noVerticalPadding?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  // ✅ new — opt-in pull-to-refresh for simple screens (Profile, static content, etc).
  // For screens with their own FlatList/SectionList (Chat, Notifications, People),
  // don't use this — pass `refreshControl` directly to that list instead, since
  // nesting a ScrollView around an existing list causes scroll conflicts.
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function AppContainer({
  children,
  backgroundColor = Colors.background,
  statusBarStyle = "dark",
  noHorizontalPadding = false,
  noVerticalPadding = false,
  paddingHorizontal = 16,
  paddingVertical = 8,
  scrollable = false,
  refreshing = false,
  onRefresh,
}: AppContainerProps) {
  const contentStyle = [
    styles.container,
    {
      paddingHorizontal: noHorizontalPadding ? 0 : paddingHorizontal,
      paddingVertical: noVerticalPadding ? 0 : paddingVertical,
    },
  ];

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle === "light" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === "android"}
      />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor }]}
        edges={["top"]}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={contentStyle}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]} // Android spinner color
                  tintColor={Colors.primary} // iOS spinner color
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={contentStyle}>{children}</View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
});
