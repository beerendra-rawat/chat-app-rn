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
    } catch (err: any) {
      // ✅ expected during logout races (auth already cleared) — don't log noise
      if (err?.code !== "permission-denied") {
        console.warn("presenceService.setOffline failed:", err);
      }
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
