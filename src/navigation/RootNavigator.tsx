// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';
import SuccessScreen from '../screens/auth/SuccessScreen';
import AccountCreateMessageScreen from '../screens/auth/AccountCreateMessageScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      {/* Auth Flow */}
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Signup" component={SignupScreen} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <RootStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <RootStack.Screen name="PasswordReset" component={PasswordResetScreen} />
      <RootStack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
      <RootStack.Screen name="Success" component={SuccessScreen} />
      <RootStack.Screen name="AccountCreatedSuccess" component={AccountCreateMessageScreen} />

      {/* Main App (Tabs) */}
      <RootStack.Screen name="MainTabs" component={TabNavigator} />
    </RootStack.Navigator>
  );
}