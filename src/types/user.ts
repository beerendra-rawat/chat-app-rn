import type { User as FirebaseUser } from "firebase/auth";

export type AppUser = FirebaseUser & {
  bio?: string;
  photoURL?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface User {
  username: string | undefined;
  uid: string;
  email: string;
  fullName?: string;
  displayName?: string;
  avatar?: string | null;
  photoURL?: string | null; // alias
  bio?: string;
  // ...
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  toUid: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: any;
}

export type FriendshipStatus = "none" | "pending" | "sent" | "friends";
