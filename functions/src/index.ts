import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

// Fires automatically whenever your client calls
// notificationService.createNotification() and a new doc lands in
// /notifications — this is the server-side piece your client can't do itself.
export const sendPushOnNotificationCreate = onDocumentCreated(
  "notifications/{notificationId}",
  async (event) => {
    const notification = event.data?.data();
    if (!notification) return;

    const {
      userId,
      type,
      fromUserName,
      message,
      chatId,
      fromUserId,
      fromUserAvatar,
    } = notification;

    // Look up the recipient's saved device tokens
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    const fcmTokens: string[] = userDoc.data()?.fcmTokens || [];

    if (!fcmTokens.length) {
      console.log(`No FCM tokens for user ${userId}, skipping push`);
      return;
    }

    // Build the notification text based on type — same categories your
    // NotificationScreen already handles
    let title = "New notification";
    let body = "";

    if (type === "message") {
      title = fromUserName || "New message";
      body = message || "Sent you a message";
    } else if (type === "friend_request") {
      title = "Friend Request";
      body = `${fromUserName} sent you a friend request`;
    } else if (type === "friend_request_accepted") {
      title = "Friend Request Accepted";
      body = `${fromUserName} accepted your friend request`;
    }

    const payload: admin.messaging.MulticastMessage = {
      tokens: fcmTokens,
      notification: { title, body },
      data: {
        type: type || "",
        chatId: chatId || "",
        fromUserId: fromUserId || "",
        fromUserName: fromUserName || "",
        fromUserAvatar: fromUserAvatar || "",
      },
      android: {
        priority: "high",
        notification: { channelId: "default", sound: "default" },
      },
      apns: {
        payload: { aps: { sound: "default", badge: 1 } },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log(
        `Push sent: ${response.successCount} success, ${response.failureCount} failed`,
      );

      // Clean up dead/invalid tokens so they don't keep failing
      const invalidTokens: string[] = [];
      response.responses.forEach((res, idx) => {
        if (
          !res.success &&
          (res.error?.code === "messaging/invalid-registration-token" ||
            res.error?.code === "messaging/registration-token-not-registered")
        ) {
          invalidTokens.push(fcmTokens[idx]);
        }
      });

      if (invalidTokens.length) {
        await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .update({
            fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
          });
      }
    } catch (err) {
      console.error("Failed to send push notification:", err);
    }
  },
);
