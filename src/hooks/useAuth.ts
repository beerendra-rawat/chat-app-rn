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
import { registerUser } from "../services/auth.service";

import { useAppDispatch } from "../redux/store/hooks";
import {
  logout,
  setError,
  setLoading,
  setUser,
} from "../redux/slice/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  //Firebase Authentication Listener
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

  //Email Login
  const loginWithEmail = async (email: string, password: string) => {
    dispatch(setLoading(true));

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      dispatch(setUser(user));

      return user;
    } catch (error: any) {
      let message = error.message;

      switch (error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;

        case "auth/user-not-found":
          message = "User not found.";
          break;

        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
      }

      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  //Email Signup
  const signupWithEmail = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    dispatch(setLoading(true));

    try {
      const user = await registerUser(fullName, email.trim(), password);

      dispatch(setUser(user));

      return user;
    } catch (error: any) {
      let message = error.message;

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Email already exists.";
          break;

        case "auth/invalid-email":
          message = "Invalid email address.";
          break;

        case "auth/weak-password":
          message = "Password must be at least 6 characters.";
          break;
      }

      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  //Reset Google Session
  const resetGoogleSession = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
    } catch {
      // Ignore if no previous session exists
    }
  };

  //Google Sign In
  const loginWithGoogle = async () => {
    dispatch(setLoading(true));

    try {
      await resetGoogleSession();

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (response.type !== "success" || !response.data?.idToken) {
        throw new Error("Google ID Token not found.");
      }
      const idToken = response.data.idToken;
      const credential = GoogleAuthProvider.credential(idToken);
      const { user } = await signInWithCredential(auth, credential);

      dispatch(setUser(user));

      return user;
    } catch (error: any) {
      let message = "Google Sign-In failed.";

      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          message = "Google Sign-In cancelled.";
          break;

        case statusCodes.IN_PROGRESS:
          message = "Google Sign-In already in progress.";
          break;

        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = "Google Play Services not available.";
          break;

        case "auth/account-exists-with-different-credential":
          message = "An account already exists with another sign-in method.";
          break;

        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;

        default:
          message = error.message || message;
      }

      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  //Logout
  const signOut = async () => {
    dispatch(setLoading(true));

    try {
      await firebaseSignOut(auth);

      await resetGoogleSession();

      dispatch(logout());
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    signOut,
  };
};
