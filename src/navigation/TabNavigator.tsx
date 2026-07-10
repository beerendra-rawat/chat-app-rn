// src/navigation/TabNavigator.tsx
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import ChatScreen from "../screens/tabs/ChatScreen";
import FriendsScreen from "../screens/tabs/FriendsScreen";
import PeopleScreen from "../screens/tabs/PeopleScreen";
import NotificationScreen from "../screens/tabs/NotificationScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";
import { TabParamList } from "../types/navigation";
import { useAppSelector } from "../redux/store/hooks"; // ✅ new
import { useNotifications } from "../hooks/useNotifications"; // ✅ new

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";

  // ✅ new — drives the Notification tab's badge from real unread count
  const currentUser = useAppSelector((state) => state.auth.user);
  const { unreadCount } = useNotifications(currentUser?.uid);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Colors.border,
          height: isAndroid ? 60 + insets.bottom : 85,
          paddingTop: 6,
          paddingBottom: isAndroid ? insets.bottom : 22,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={PeopleScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-add" : "person-add-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          // ✅ fixed — was hardcoded `3`, now reflects real unread notifications.
          // undefined hides the badge entirely when there are zero unread.
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: Platform.OS === "android" ? 4 : 0,
  },
});
