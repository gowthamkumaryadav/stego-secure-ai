import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Your config
const firebaseConfig = {
  apiKey: "AIzaSyBnyPN-cyDjP9GHuKKWBHZ--hPq38aT3Xw",
  authDomain: "stego-ai.firebaseapp.com",
  projectId: "stego-ai",
  storageBucket: "stego-ai.firebasestorage.app",
  messagingSenderId: "711242150956",
  appId: "1:711242150956:web:aa6e6b45f3bd349ecccd89",
  measurementId: "G-V3VWJYSZDD"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();