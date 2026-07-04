import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "../config/firebase";

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await updateProfile(credential.user, {
    displayName: fullName,
  });

  await credential.user.reload();

  return auth.currentUser!;
};
