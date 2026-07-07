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
  writeBatch, // ✅ add
} from "firebase/firestore";
import { Message, FirestoreMessage } from "../types/chat";

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
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("clientCreatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as FirestoreMessage;
        return {
          id: docSnap.id,
          text: data.text,
          senderId: data.senderId,
          createdAt: data.createdAt
            ? (data.createdAt as Timestamp).toMillis()
            : data.clientCreatedAt,
          isRead: data.isRead,
        };
      });
      callback(messages);
    });
  },

  async sendMessage(chatId: string, senderId: string, text: string) {
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text,
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

  // ✅ new — marks every unread message FROM the other person as read
  async markMessagesAsRead(chatId: string, currentUid: string) {
    const messagesRef = collection(db, "chats", chatId, "messages");

    // ✅ single-field filter only — no composite index required
    const q = query(messagesRef, where("isRead", "==", false));

    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    // ✅ exclude your own messages client-side instead of in the query
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
};
