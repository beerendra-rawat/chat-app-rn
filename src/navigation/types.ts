import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Bottom Tabs
export type TabParamList = {
  Chat: undefined;
  Friends: undefined;
  People: undefined;
  Notification: undefined;
  Profile: undefined;
};

// Root Stack
export type RootStackParamList = {
  MainTabs: undefined; // ✅ was "Tabs" — must match what's used in RootNavigator
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  PasswordReset: undefined;
  UpdatePassword: undefined;
  Success: undefined;
  ViewImage: { imageUri: string }; // ✅ adjust to your actual ViewImageScreen params
  AccountCreatedSuccess: undefined;
  ChatDetail: {
    chatId: string;
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string | null;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;
