import type { User as FirebaseUser } from "firebase/auth";

export type AppUser = FirebaseUser & {
  bio?: string;
  photoURL?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
};
