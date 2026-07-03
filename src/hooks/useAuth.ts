// src/hooks/useAuth.ts
import { useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useAppDispatch } from "../redux/store/hooks";
import {
  setUser,
  setLoading,
  setError,
  logout,
} from "../redux/slice/authSlice";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      dispatch(setUser(userCredential.user));
      return userCredential.user;
    } catch (error: any) {
      const message =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : error.message;
      dispatch(setError(message));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch(setLoading(true));

      // Strong cleanup
      try {
        await GoogleSignin.signOut();
        await GoogleSignin.revokeAccess();
      } catch (e) {
        // Ignore
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      let idToken: string | undefined = undefined;

      if ("idToken" in userInfo && typeof userInfo.idToken === "string") {
        idToken = userInfo.idToken;
      } else if (
        userInfo.data &&
        "idToken" in userInfo.data &&
        typeof userInfo.data.idToken === "string"
      ) {
        idToken = userInfo.data.idToken;
      }

      if (!idToken) {
        throw new Error("Failed to get ID token");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      dispatch(setUser(userCredential.user));
      return userCredential.user;
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      dispatch(setError(error.message || "Google sign in failed"));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);

      try {
        await GoogleSignin.signOut();
        await GoogleSignin.revokeAccess();
      } catch (e) {
        console.warn("Google cleanup warning:", e);
      }

      dispatch(logout());
    } catch (error: any) {
      console.error("Sign out error:", error);
      dispatch(logout());
    }
  };

  return { loginWithEmail, loginWithGoogle, signOut };
};
