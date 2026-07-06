// src/services/profile.service.ts
import { updateProfile } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { uploadToCloudinary } from "../utils/cloudinary";

const PROFILE_COLLECTION = "users";

export type ProfileData = {
  uid: string;
  fullName?: string;
  bio?: string;
  photoURL?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const updateUserProfile = async (
  fullName: string,
  bio: string,
  photoURL?: string, // ← Now accept URL directly
) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No authenticated user");

  try {
    await updateProfile(currentUser, {
      displayName: fullName.trim(),
      photoURL: photoURL || null,
    });

    const userRef = doc(db, PROFILE_COLLECTION, currentUser.uid);
    const now = new Date().toISOString();

    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        fullName: fullName.trim(),
        bio: bio.trim() || "",
        photoURL: photoURL || null,
        email: currentUser.email,
        updatedAt: now,
      },
      { merge: true },
    );

    await currentUser.reload();
    return auth.currentUser!;
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};

export const subscribeToProfile = (
  uid: string,
  callback: (profile: ProfileData | null) => void,
) => {
  const profileRef = doc(db, PROFILE_COLLECTION, uid);

  return onSnapshot(
    profileRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      const data = snapshot.data() as Omit<ProfileData, "uid">;
      callback({ uid: snapshot.id, ...data });
    },
    (error) => {
      console.error("Profile listener error:", error);
      callback(null);
    },
  );
};
