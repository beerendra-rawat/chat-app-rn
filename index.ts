import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native"; // ✅ new
import { registerRootComponent } from "expo";
import App from "./App";

// ✅ new — creates the "default" channel your Cloud Function's payload
// references. Without this, Android silently drops the visible banner
// even though the data payload is delivered correctly (as you just saw).
notifee.createChannel({
  id: "default",
  name: "Default",
  importance: AndroidImportance.HIGH, // shows as a heads-up banner, not just in the shade
  sound: "default",
});

// Registered at the true entry point — runs before React mounts anything,
// so it reliably catches pushes even when the app is fully killed and the
// OS is only waking it headlessly to process the message.
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background/killed-state message received:", remoteMessage);

  // ✅ new — manually display the notification using Notifee.
  // On Android, when the app is killed/background, FCM's own auto-display
  // only works reliably for certain payload shapes; explicitly displaying
  // via Notifee guarantees the banner shows regardless of app state.
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
});

registerRootComponent(App);
