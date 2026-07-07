import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "../types/user";
import { User as FirebaseUser } from "firebase/auth";

export const userService = {
  // ✅ Creates/updates the Firestore profile doc for the currently authenticated user
  async ensureUserDocument(firebaseUser: FirebaseUser) {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        fullName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || null,
        bio: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existing = snap.data();
      await setDoc(
        userRef,
        {
          email: firebaseUser.email || existing.email || "",
          fullName: existing.fullName || firebaseUser.displayName || "",
          photoURL: existing.photoURL || firebaseUser.photoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  },

  async getAllUsers(currentUserUid: string): Promise<User[]> {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      return snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            email: data.email || "",
            fullName: data.fullName || data.displayName || "",
            avatar: data.photoURL || data.avatar || null,
            bio: data.bio,
            ...data,
          } as User;
        })
        .filter((u) => u.uid !== currentUserUid);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      if (error.code === "permission-denied") {
        console.warn("🔐 Check your Firestore Security Rules!");
      }
      throw error;
    }
  },

  async searchUsers(searchTerm: string, currentUserUid: string) {
    if (!searchTerm?.trim()) return [];
    const allUsers = await this.getAllUsers(currentUserUid);
    const term = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        (user.fullName?.toLowerCase() || "").includes(term) ||
        (user.email?.toLowerCase() || "").includes(term),
    );
  },
};
