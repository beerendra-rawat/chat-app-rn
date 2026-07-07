// src/services/presence.service.ts
import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface PresenceData {
  isOnline: boolean;
  lastSeen: Timestamp | null;
}

export const presenceService = {
  async setOnline(uid: string) {
    try {
      await setDoc(
        doc(db, "users", uid),
        { isOnline: true, lastSeen: serverTimestamp() },
        { merge: true },
      );
    } catch (err) {
      console.warn("presenceService.setOnline failed:", err); // ✅ caught, not thrown
    }
  },

  async setOffline(uid: string) {
    try {
      await setDoc(
        doc(db, "users", uid),
        { isOnline: false, lastSeen: serverTimestamp() },
        { merge: true },
      );
    } catch (err) {
      console.warn("presenceService.setOffline failed:", err); // ✅ caught, not thrown
    }
  },

  subscribeToPresence(uid: string, callback: (data: PresenceData) => void) {
    const userRef = doc(db, "users", uid);
    return onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data();
        callback({
          isOnline: data?.isOnline ?? false,
          lastSeen: data?.lastSeen ?? null,
        });
      },
      (err) => {
        console.warn("presenceService.subscribeToPresence failed:", err); // ✅ catch listener errors too
      },
    );
  },
};
