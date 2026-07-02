import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

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
  Tabs: undefined;
  // Add other root screens here (e.g., Login, Modal, etc.)
  Login: undefined;
  // Example detail screen accessible from multiple tabs
  ChatDetail: { chatId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;