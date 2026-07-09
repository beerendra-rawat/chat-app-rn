import { db } from "../config/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { Message, FirestoreMessage, ChatSummary } from "../types/chat";
import { notificationService } from "./notification.service"; // ✅ new
import { friendService } from "./friend.service"; // ✅ new

export const chatService = {
  buildChatId(uidA: string, uidB: string) {
    return [uidA, uidB].sort().join("_");
  },

  async ensureChatDocument(chatId: string, uidA: string, uidB: string) {
    const chatRef = doc(db, "chats", chatId);
    const snap = await getDoc(chatRef);
    if (!snap.exists()) {
      await setDoc(chatRef, {
        participants: [uidA, uidB],
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: "",
        lastReadAt: {},
      });
    }
  },

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    if (!chatId) return () => {};

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("clientCreatedAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreMessage;
          return {
            id: docSnap.id,
            text: data.text ?? "",
            imageUrl: data.imageUrl,
            type: data.type ?? "text",
            senderId: data.senderId,
            createdAt: data.createdAt
              ? (data.createdAt as Timestamp).toMillis()
              : data.clientCreatedAt,
            isRead: data.isRead ?? false,
          };
        });
        callback(messages);
      },
      (err: any) => {
        // ✅ fixed — permission-denied here almost always means the listener
        // outlived a logout (auth cleared mid-flight); expected, not a bug.
        // Anything else still logs so real issues aren't hidden.
        if (err?.code !== "permission-denied") {
          console.warn("chatService.subscribeToMessages failed:", err);
        }
      },
    );
  },

  async sendMessage(chatId: string, senderId: string, text: string) {
    if (!chatId || !senderId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text,
      type: "text",
      senderId,
      createdAt: serverTimestamp(),
      clientCreatedAt: Date.now(),
      isRead: false,
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: senderId,
      },
      { merge: true },
    );

    // ✅ new — notify the recipient of the new message
    try {
      const recipientId = chatId.split("_").find((id) => id !== senderId);
      if (recipientId) {
        const [sender] = await friendService.getUsersByIds([senderId]);
        await notificationService.createNotification({
          userId: recipientId,
          type: "message",
          fromUserId: senderId,
          fromUserName: sender?.fullName || "Someone",
          fromUserAvatar: sender?.avatar,
          message: text,
          chatId,
        });
      }
    } catch (err) {
      console.error("Failed to create message notification:", err);
    }
  },

  async sendImageMessage(chatId: string, senderId: string, imageUrl: string) {
    if (!chatId || !senderId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: "",
      imageUrl,
      type: "image",
      senderId,
      createdAt: serverTimestamp(),
      clientCreatedAt: Date.now(),
      isRead: false,
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: "📷 Photo",
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: senderId,
      },
      { merge: true },
    );

    // ✅ new — notify the recipient of the new image message
    try {
      const recipientId = chatId.split("_").find((id) => id !== senderId);
      if (recipientId) {
        const [sender] = await friendService.getUsersByIds([senderId]);
        await notificationService.createNotification({
          userId: recipientId,
          type: "message",
          fromUserId: senderId,
          fromUserName: sender?.fullName || "Someone",
          fromUserAvatar: sender?.avatar,
          message: "📷 Photo",
          chatId,
        });
      }
    } catch (err) {
      console.error("Failed to create image message notification:", err);
    }
  },

  async markMessagesAsRead(chatId: string, currentUid: string) {
    if (!chatId || !currentUid) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, where("isRead", "==", false));

    const snapshot = await getDocs(q);

    const unreadFromOthers = snapshot.docs.filter(
      (docSnap) => docSnap.data().senderId !== currentUid,
    );

    if (unreadFromOthers.length) {
      const batch = writeBatch(db);
      unreadFromOthers.forEach((docSnap) => {
        batch.update(docSnap.ref, { isRead: true });
      });
      await batch.commit();
    }

    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`lastReadAt.${currentUid}`]: Date.now(),
      });
    } catch (err) {
      console.error("Failed to update lastReadAt:", err);
    }
  },

  subscribeToUserChats(uid: string, callback: (chats: ChatSummary[]) => void) {
    if (!uid) {
      console.warn("subscribeToUserChats: uid is missing");
      callback([]);
      return () => {};
    }

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", uid));

    return onSnapshot(
      q,
      (snapshot) => {
        const chats: ChatSummary[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              participants: data.participants ?? [],
              lastMessage: data.lastMessage ?? "",
              lastMessageAt: data.lastMessageAt
                ? (data.lastMessageAt as Timestamp).toMillis()
                : 0,
              lastMessageSenderId: data.lastMessageSenderId ?? "",
              lastReadAt: data.lastReadAt ?? {},
            };
          })
          .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

        callback(chats);
      },
      (err: any) => {
        // ✅ fixed — same reasoning as subscribeToMessages
        if (err?.code !== "permission-denied") {
          console.warn("chatService.subscribeToUserChats failed:", err);
        }
      },
    );
  },
};
