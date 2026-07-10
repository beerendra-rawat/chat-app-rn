import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ new
import { useAppSelector } from "../redux/store/hooks";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import PasswordResetScreen from "../screens/auth/PasswordResetScreen";
import UpdatePasswordScreen from "../screens/auth/UpdatePasswordScreen";
import SuccessScreen from "../screens/auth/SuccessScreen";
import AccountCreateMessageScreen from "../screens/auth/AccountCreateMessageScreen";
import ViewImageScreen from "../screens/common/ViewImageScreen";
import MessageScreen from "../screens/common/MessageScreen";
import StoryViewerScreen from "../screens/common/StoryViewerScreen";
import { RootStackParamList } from "./types";
import Colors from "../constants/Colors";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      // ✅ fixed — SafeAreaView + explicit flex:1 on both container levels
      // guarantees full-screen coverage; larger, high-contrast spinner +
      // label so it reads as an intentional loading screen, not a glitch
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
      <RootStack.Screen
        name="AccountCreatedSuccess"
        component={AccountCreateMessageScreen}
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
          <RootStack.Screen
            name="PasswordReset"
            component={PasswordResetScreen}
          />
          <RootStack.Screen
            name="UpdatePassword"
            component={UpdatePasswordScreen}
          />
          <RootStack.Screen name="Success" component={SuccessScreen} />
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
