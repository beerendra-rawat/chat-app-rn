// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVhqZ7h2XDU6FkHgI1MsKQ5T13yD4oBLk",
  authDomain: "chat-app-2475b.firebaseapp.com",
  projectId: "chat-app-2475b",
  storageBucket: "chat-app-2475b.firebasestorage.app",
  messagingSenderId: "314645370562",
  appId: "1:314645370562:web:ae1e5712a757446ebe0d5b",
  measurementId: "G-6BXKQSW4M2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { auth, db, storage, googleProvider };
export default app;
