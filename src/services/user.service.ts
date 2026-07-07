// src/services/user.service.ts
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { User } from "../types/user";

export const userService = {
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
