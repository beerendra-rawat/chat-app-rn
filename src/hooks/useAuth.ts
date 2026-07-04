// src/hooks/useAuth.ts

import { useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { auth } from "../config/firebase";
import { useAppDispatch } from "../redux/store/hooks";
import {
  logout,
  setError,
  setLoading,
  setUser,
} from "../redux/slice/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  /**
   * ----------------------------------------------------
   * Listen Firebase Authentication State
   * ----------------------------------------------------
   * Automatically updates Redux whenever the user
   * logs in, logs out, or the app restores a session.
   */
  useEffect(() => {
    console.log("🔥 Auth Listener Started");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User Session Restored");
        console.log("👤 UID:", user.uid);
        console.log("📧 Email:", user.email);
      } else {
        console.log("🚪 No authenticated user found");
      }

      dispatch(setUser(user));
    });

    return () => {
      console.log("🛑 Auth Listener Removed");
      unsubscribe();
    };
  }, [dispatch]);

  /**
   * ----------------------------------------------------
   * Email & Password Login
   * ----------------------------------------------------
   */
  const loginWithEmail = async (email: string, password: string) => {
    console.log("📧 Starting Email Login...");

    dispatch(setLoading(true));

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Email Login Successful");
      console.log("👤 UID:", user.uid);

      dispatch(setUser(user));

      return user;
    } catch (error: any) {
      const message =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : error.message;

      console.log("❌ Email Login Failed");
      console.log("Reason:", message);

      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Clear previous Google session.
   * Prevents automatic account selection.
   */
  const resetGoogleSession = async () => {
    try {
      console.log("🧹 Clearing previous Google session...");

      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
    } catch {
      console.log("ℹ️ No previous Google session found");
    }
  };

  /**
   * Extract Google ID Token safely.
   */
  const getIdToken = (response: any) =>
    response?.idToken ?? response?.data?.idToken;

  /**
   * ----------------------------------------------------
   * Google Sign In
   * ----------------------------------------------------
   */
  const loginWithGoogle = async () => {
    console.log("🚀 Starting Google Login...");

    dispatch(setLoading(true));

    try {
      await resetGoogleSession();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("✅ Google Play Services Available");

      const response = await GoogleSignin.signIn();

      console.log("📥 Google account selected");

      const idToken = getIdToken(response);

      if (!idToken) {
        throw new Error("Google ID Token not found.");
      }

      console.log("🔑 Google ID Token Received");

      const credential = GoogleAuthProvider.credential(idToken);

      const { user } = await signInWithCredential(auth, credential);

      console.log("✅ Firebase Google Authentication Successful");
      console.log("👤 UID:", user.uid);
      console.log("📧 Email:", user.email);

      dispatch(setUser(user));

      return user;
    } catch (error: any) {
      let message = error.message;

      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          message = "Google Sign-In cancelled by user.";
          break;

        case statusCodes.IN_PROGRESS:
          message = "Google Sign-In already in progress.";
          break;

        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = "Google Play Services not available.";
          break;
      }

      console.log("❌ Google Login Failed");
      console.log("Reason:", message);

      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * ----------------------------------------------------
   * Logout User
   * ----------------------------------------------------
   */
  const signOut = async () => {
    console.log("🚪 Signing out user...");

    dispatch(setLoading(true));

    try {
      await firebaseSignOut(auth);
      await resetGoogleSession();

      console.log("✅ User Logged Out Successfully");

      dispatch(logout());
    } catch (error: any) {
      console.log("❌ Logout Failed");
      console.log("Reason:", error.message);

      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    loginWithEmail,
    loginWithGoogle,
    signOut,
  };
};
