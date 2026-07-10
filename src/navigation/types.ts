import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { UserStories } from "../types/story";

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
  MainTabs: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string };
  ViewImage: {
    imageUri: string;
  };
  ChatDetail: {
    chatId: string;
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string | null;
  };
  StoryViewer: {
    storyGroups: UserStories[];
    initialUserId: string;
    currentUid: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;
