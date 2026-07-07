import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { User } from "../types/user";

export const friendService = {
  // ✅ Real-time listener on current user's doc
  subscribeToUserRelations(
    uid: string,
    callback: (data: {
      friends: string[];
      sentRequests: string[];
      receivedRequests: string[];
    }) => void,
  ) {
    const userRef = doc(db, "users", uid);
    return onSnapshot(userRef, (snap) => {
      const data = snap.data();
      callback({
        friends: data?.friends || [],
        sentRequests: data?.sentRequests || [],
        receivedRequests: data?.receivedRequests || [],
      });
    });
  },

  async sendFriendRequest(currentUid: string, targetUid: string) {
    const batch = writeBatch(db);
    batch.update(doc(db, "users", currentUid), {
      sentRequests: arrayUnion(targetUid),
    });
    batch.update(doc(db, "users", targetUid), {
      receivedRequests: arrayUnion(currentUid),
    });
    await batch.commit();
  },

  async cancelRequest(currentUid: string, targetUid: string) {
    const batch = writeBatch(db);
    batch.update(doc(db, "users", currentUid), {
      sentRequests: arrayRemove(targetUid),
    });
    batch.update(doc(db, "users", targetUid), {
      receivedRequests: arrayRemove(currentUid),
    });
    await batch.commit();
  },

  async acceptFriendRequest(currentUid: string, requesterUid: string) {
    const batch = writeBatch(db);
    batch.update(doc(db, "users", currentUid), {
      receivedRequests: arrayRemove(requesterUid),
      friends: arrayUnion(requesterUid),
    });
    batch.update(doc(db, "users", requesterUid), {
      sentRequests: arrayRemove(currentUid),
      friends: arrayUnion(currentUid),
    });
    await batch.commit();
  },

  async rejectFriendRequest(currentUid: string, requesterUid: string) {
    const batch = writeBatch(db);
    batch.update(doc(db, "users", currentUid), {
      receivedRequests: arrayRemove(requesterUid),
    });
    batch.update(doc(db, "users", requesterUid), {
      sentRequests: arrayRemove(currentUid),
    });
    await batch.commit();
  },

  async removeFriend(currentUid: string, friendUid: string) {
    const batch = writeBatch(db);
    batch.update(doc(db, "users", currentUid), {
      friends: arrayRemove(friendUid),
    });
    batch.update(doc(db, "users", friendUid), {
      friends: arrayRemove(currentUid),
    });
    await batch.commit();
  },

  async getUsersByIds(uids: string[]): Promise<User[]> {
    if (!uids.length) return [];
    const snaps = await Promise.all(
      uids.map((id) => getDoc(doc(db, "users", id))),
    );
    return snaps
      .filter((s) => s.exists())
      .map((s) => {
        const data = s.data()!;
        return {
          uid: s.id,
          email: data.email || "",
          fullName: data.fullName || data.displayName || "",
          avatar: data.photoURL || data.avatar || null,
          bio: data.bio,
          ...data,
        } as User;
      });
  },
};
