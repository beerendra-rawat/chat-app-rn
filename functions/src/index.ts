import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

admin.initializeApp();

export const sendPushOnNotificationWrite = onDocumentWritten(
  "notifications/{notificationId}",
  async (event) => {
    // ──────────────────────────────────────────────────────────
    // event.data.before → the document's data BEFORE this write
    //   - undefined if this was a CREATE (didn't exist before)
    // event.data.after  → the document's data AFTER this write
    //   - undefined if this was a DELETE (doesn't exist after)
    // ──────────────────────────────────────────────────────────
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();

    // 🗑️ DELETE case — `after` is undefined when a doc was deleted.
    // Nothing to notify about, so bail out immediately.
    if (!after) {
      console.log("Notification deleted — no push to send");
      return;
    }

    // ✏️ UPDATE case — `before` exists AND `after` exists.
    // This is what happens on your 2nd/3rd message in the same chat
    // (the upsert logic calling updateDoc), AND also what happens when
    // markAsRead/markAllAsRead flips isRead to true. We only want to
    // push for the FIRST kind (new message content), not the second
    // (read-state change) — this guard tells them apart.
    const isReadOnlyChange =
      before &&
      after.message === before.message &&
      after.fromUserName === before.fromUserName &&
      after.type === before.type;

    if (isReadOnlyChange) {
      console.log("Skipping push — only isRead changed (markAsRead case)");
      return;
    }

    // ➕ CREATE case — `before` is undefined, `after` exists.
    // This is your 1st message in a new conversation, or a fresh
    // friend_request / friend_request_accepted doc.
    // (No special handling needed here — it just falls through to the
    // same push-sending logic below, since both CREATE and a genuine
    // content UPDATE should result in a push.)

    const {
      userId,
      type,
      fromUserName,
      message,
      chatId,
      fromUserId,
      fromUserAvatar,
    } = after;

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
