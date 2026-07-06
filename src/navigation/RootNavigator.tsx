import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../redux/store/hooks";
import TabNavigator from "./TabNavigator";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import PasswordResetScreen from "../screens/auth/PasswordResetScreen";
import UpdatePasswordScreen from "../screens/auth/UpdatePasswordScreen";
import SuccessScreen from "../screens/auth/SuccessScreen";
import AccountCreateMessageScreen from "../screens/auth/AccountCreateMessageScreen";
import ViewImageScreen from "../screens/common/ViewImageScreen";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
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

      {user ? (
        <RootStack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ gestureEnabled: false }}
        />
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
          <RootStack.Screen
            name="AccountCreatedSuccess"
            component={AccountCreateMessageScreen}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}
