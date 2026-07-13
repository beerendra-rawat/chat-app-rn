import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  Timestamp,
  limit,
} from "firebase/firestore";
import { AppNotification, NotificationType } from "../types/notification";

export const notificationService = {
  async createNotification(params: {
    userId: string;
    type: NotificationType;
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar?: string | null;
    message?: string;
    chatId?: string;
  }) {
    if (!params.userId || params.userId === params.fromUserId) return; // never notify yourself

    const ref = collection(db, "notifications");

    // For message notifications, collapse to ONE row per conversation
    // instead of one row per message. Look for an existing notification
    // from THIS sender, to THIS recipient, in THIS chat, and update it in
    // place rather than creating a duplicate.
    if (params.type === "message" && params.chatId) {
      const existingQuery = query(
        ref,
        where("userId", "==", params.userId),
        where("chatId", "==", params.chatId),
        where("type", "==", "message"),
        where("fromUserId", "==", params.fromUserId),
        limit(1),
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        const existingDoc = existingSnapshot.docs[0];
        await updateDoc(existingDoc.ref, {
          message: params.message ?? null,
          fromUserName: params.fromUserName,
          fromUserAvatar: params.fromUserAvatar ?? null,
          isRead: false, // new message re-marks it unread
          createdAt: serverTimestamp(), // bumps it back to the top / "Today"
          clientCreatedAt: Date.now(),
        });
        return;
      }
    }

    // Friend requests and friend_request_accepted still insert fresh —
    // those are one-time events per relationship, not an ongoing stream
    await addDoc(ref, {
      userId: params.userId,
      type: params.type,
      fromUserId: params.fromUserId,
      fromUserName: params.fromUserName,
      fromUserAvatar: params.fromUserAvatar ?? null,
      message: params.message ?? null,
      chatId: params.chatId ?? null,
      isRead: false,
      createdAt: serverTimestamp(),
      clientCreatedAt: Date.now(),
    });
  },

  subscribeToUserNotifications(
    uid: string,
    callback: (notifications: AppNotification[]) => void,
  ) {
    if (!uid) {
      callback([]);
      return () => {};
    }

    const ref = collection(db, "notifications");
    const q = query(ref, where("userId", "==", uid));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: AppNotification[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId,
              type: data.type,
              fromUserId: data.fromUserId,
              fromUserName: data.fromUserName,
              fromUserAvatar: data.fromUserAvatar,
              message: data.message,
              chatId: data.chatId,
              isRead: data.isRead ?? false,
              createdAt: data.createdAt
                ? (data.createdAt as Timestamp).toMillis()
                : data.clientCreatedAt,
            } as AppNotification;
          })
          .sort((a, b) => b.createdAt - a.createdAt);

        callback(list);
      },
      (err: any) => {
        // permission-denied here means the listener outlived a
        // logout/signout race; expected, not a bug. Anything else still logs.
        if (err?.code !== "permission-denied") {
          console.error("Failed to subscribe to notifications:", err);
        }
        callback([]);
      },
    );
  },

  async markAsRead(notificationId: string) {
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
    });
  },

  async markAllAsRead(uid: string) {
    const ref = collection(db, "notifications");
    const q = query(ref, where("userId", "==", uid));
    const snapshot = await getDocs(q);

    const unread = snapshot.docs.filter((d) => !d.data().isRead);
    if (!unread.length) return;

    const batch = writeBatch(db);
    unread.forEach((d) => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  },

  // ✅ new — marks a message notification read by chatId + recipient,
  // rather than by notification doc id. Call this from MessageScreen when
  // the user opens a chat directly (not via tapping the notification row),
  // so the badge/list correctly reflects that they've seen the messages
  // either way they got there.
  async markChatNotificationsAsRead(uid: string, chatId: string) {
    const ref = collection(db, "notifications");
    const q = query(
      ref,
      where("userId", "==", uid),
      where("chatId", "==", chatId),
      where("type", "==", "message"),
      where("isRead", "==", false),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  },
};
