import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
  ScrollViewProps, // ✅ new — for typing keyboardShouldPersistTaps correctly
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
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  // ✅ new — forwarded to the internal ScrollView when scrollable=true.
  // Lets buttons/inputs stay tappable without needing an extra tap to
  // dismiss the keyboard first. Ignored when scrollable=false.
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
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
  keyboardShouldPersistTaps = "handled", // ✅ new — sensible default
}: AppContainerProps) {
  const paddingStyle = {
    paddingHorizontal: noHorizontalPadding ? 0 : paddingHorizontal,
    paddingVertical: noVerticalPadding ? 0 : paddingVertical,
  };

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
            // ✅ flexGrow, not flex — lets content grow taller than the
            // viewport (e.g. when the keyboard shrinks visible space)
            // instead of being clamped to screen height and blocking scroll
            contentContainerStyle={[styles.scrollContent, paddingStyle]}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps} // ✅ new
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.container, paddingStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 }, // correct for the plain View (non-scrollable) case
  scrollContent: { flexGrow: 1 }, // ✅ correct for ScrollView's contentContainerStyle
});
