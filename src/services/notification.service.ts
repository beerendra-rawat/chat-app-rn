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
        // ✅ fixed — permission-denied here means the listener outlived a
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
    const q = query(ref, where("userId", "==", uid)); // ✅ single-field query
    const snapshot = await getDocs(q);

    const unread = snapshot.docs.filter((d) => !d.data().isRead);
    if (!unread.length) return;

    const batch = writeBatch(db);
    unread.forEach((d) => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  },
};
