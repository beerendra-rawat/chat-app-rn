import { db } from "../config/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
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
      });
    }
  },

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    if (!chatId) return () => {};

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("clientCreatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
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
    });
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
  },

  async markMessagesAsRead(chatId: string, currentUid: string) {
    if (!chatId || !currentUid) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    // ✅ fixed — single-field filter only, avoids the composite index requirement
    const q = query(messagesRef, where("isRead", "==", false));

    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    // ✅ fixed — exclude your own messages client-side instead of a second where()
    const unreadFromOthers = snapshot.docs.filter(
      (docSnap) => docSnap.data().senderId !== currentUid,
    );
    if (!unreadFromOthers.length) return;

    const batch = writeBatch(db);
    unreadFromOthers.forEach((docSnap) => {
      batch.update(docSnap.ref, { isRead: true });
    });
    await batch.commit();
  },

  subscribeToUserChats(uid: string, callback: (chats: ChatSummary[]) => void) {
    if (!uid) {
      console.warn("subscribeToUserChats: uid is missing");
      callback([]);
      return () => {};
    }

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", uid));

    return onSnapshot(q, (snapshot) => {
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
          };
        })
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

      callback(chats);
    });
  },
};
