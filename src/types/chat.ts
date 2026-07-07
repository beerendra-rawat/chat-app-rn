import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: number;
  isRead: boolean;
}

export interface FirestoreMessage {
  text: string;
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
