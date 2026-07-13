import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../config/firebase";

export const pushNotificationService = {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      // Android 13+ requires runtime permission, handled by messaging() itself
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }

    // Android < 13 doesn't need explicit runtime permission
    return true;
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (err) {
      console.error("Failed to get FCM token:", err);
      return null;
    }
  },

  // Call after login — saves this device's token onto the user doc so the
  // Cloud Function knows where to deliver pushes for this user.
  async registerTokenForUser(uid: string): Promise<void> {
    const granted = await this.requestPermission();
    if (!granted) {
      console.log("Push notification permission denied");
      return;
    }

    const token = await this.getToken();
    if (!token) return;

    try {
      await updateDoc(doc(db, "users", uid), {
        fcmTokens: arrayUnion(token), // array — supports multiple devices per user
      });
    } catch (err) {
      console.error("Failed to save FCM token:", err);
    }
  },

  // Call on logout — removes this device's token so it stops receiving
  // pushes for an account it's no longer signed into.
  async unregisterTokenForUser(uid: string): Promise<void> {
    try {
      const token = await this.getToken();
      if (!token) return;

      await updateDoc(doc(db, "users", uid), {
        fcmTokens: arrayRemove(token),
      });
    } catch (err) {
      console.error("Failed to remove FCM token:", err);
    }
  },

  // Refires if the OS rotates the token (rare, but happens — e.g. app
  // reinstall, token expiry). Call this once near app startup.
  onTokenRefresh(uid: string): () => void {
    return messaging().onTokenRefresh(async (token) => {
      try {
        await updateDoc(doc(db, "users", uid), {
          fcmTokens: arrayUnion(token),
        });
      } catch (err) {
        console.error("Failed to update refreshed FCM token:", err);
      }
    });
  },
};
