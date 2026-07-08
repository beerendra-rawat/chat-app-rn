import { Timestamp } from "firebase/firestore";

export type MessageType = "text" | "image"; // ✅ new — distinguishes text vs image messages

export interface Message {
  id: string;
  text: string;
  imageUrl?: string; // ✅ new — populated when type is "image"
  type: MessageType; // ✅ new
  senderId: string;
  createdAt: number;
  isRead: boolean;
}

export interface FirestoreMessage {
  text: string;
  imageUrl?: string; // ✅ new
  type?: MessageType; // ✅ new — optional so old text-only docs still parse fine
  senderId: string;
  createdAt: Timestamp | null;
  clientCreatedAt: number; // ✅ new — used for stable ordering
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: number;
  lastMessageSenderId?: string;
}
