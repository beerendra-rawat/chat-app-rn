import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native"; // ✅ new
import { useNavigation } from "@react-navigation/native";
import { pushNotificationService } from "../services/pushNotification.service";

// Handles what happens when the user TAPS a notification — same logic
// whether the app was in background or fully killed.
function handleNotificationNavigation(navigation: any, data: any) {
  if (!data) return;

  if (data.type === "message" && data.chatId) {
    navigation.navigate("ChatDetail", {
      chatId: data.chatId,
      otherUserId: data.fromUserId,
      otherUserName: data.fromUserName,
      otherUserAvatar: data.fromUserAvatar || null,
    });
  } else if (data.type === "friend_request") {
    navigation.navigate("Friends");
  } else if (data.type === "friend_request_accepted" && data.chatId) {
    navigation.navigate("ChatDetail", {
      chatId: data.chatId,
      otherUserId: data.fromUserId,
      otherUserName: data.fromUserName,
      otherUserAvatar: data.fromUserAvatar || null,
    });
  }
}

// ✅ new — actually shows the visible system banner. Without this, Android
// silently delivers the data payload but drops the banner if the channel
// hasn't displayed it explicitly (this is what you were missing).
async function displayLocalNotification(remoteMessage: any) {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? "New notification",
    body: remoteMessage.notification?.body ?? "",
    android: {
      channelId: "default",
      smallIcon: "ic_launcher", // adjust if your app icon asset has a different name
      pressAction: { id: "default" },
    },
    data: remoteMessage.data,
  });
}

export function usePushNotifications(uid?: string) {
  const navigation = useNavigation<any>();

  // Register + refresh token whenever the signed-in user changes
  useEffect(() => {
    if (!uid) return;

    pushNotificationService.registerTokenForUser(uid);
    const unsubscribeRefresh = pushNotificationService.onTokenRefresh(uid);

    return () => unsubscribeRefresh();
  }, [uid]);

  // Foreground: app is open and visible — FCM doesn't auto-show a banner
  // in this state, so we display one ourselves via Notifee for a
  // consistent experience whether the app is open or closed.
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification received:", remoteMessage);
      await displayLocalNotification(remoteMessage); // ✅ new
    });
    return unsubscribe;
  }, []);

  // ✅ new — handles taps on notifications Notifee displayed itself
  // (i.e. the foreground banner above, and the one shown from the
  // background handler in index.ts). Covers both "app open, user taps
  // banner" and "app backgrounded, user taps banner" for Notifee-displayed
  // notifications specifically.
  useEffect(() => {
    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          handleNotificationNavigation(navigation, detail.notification?.data);
        }
      },
    );
    return unsubscribeForeground;
  }, [navigation]);

  // Background (app minimized, not killed) — user taps the native system
  // notification that FCM/RNFirebase itself surfaced, this fires and we
  // navigate.
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app from background:", remoteMessage); // ✅ fixed misleading log label
      handleNotificationNavigation(navigation, remoteMessage?.data);
    });
    return unsubscribe;
  }, [navigation]);

  // Killed state — app was fully closed, user tapped the system
  // notification, which cold-starts the app. Check on mount whether that's
  // how we got here.
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          handleNotificationNavigation(navigation, remoteMessage.data);
        }
      });
  }, [navigation]);
}
