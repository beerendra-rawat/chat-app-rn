import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../redux/store/hooks";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import ViewImageScreen from "../screens/common/ViewImageScreen";
import MessageScreen from "../screens/common/MessageScreen";
import StoryViewerScreen from "../screens/common/StoryViewerScreen";
import { RootStackParamList } from "./types";
import Colors from "../constants/Colors";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAppSelector((state) => state.auth); // ✅ fixed — suppressNavigation removed

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <RootStack.Navigator
      initialRouteName={user ? "MainTabs" : "Login"}
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <RootStack.Screen
        name="ViewImage"
        component={ViewImageScreen}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <RootStack.Screen
        name="StoryViewer"
        component={StoryViewerScreen}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      {user ? (
        <>
          <RootStack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ gestureEnabled: false }}
          />
          <RootStack.Screen name="ChatDetail" component={MessageScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Signup" component={SignupScreen} />
          <RootStack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <RootStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
