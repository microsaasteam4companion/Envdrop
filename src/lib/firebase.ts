import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtWNZ9t21ZwWynt-gKPJBIKLItKu_hM4g",
  authDomain: "env-share-655a8.firebaseapp.com",
  projectId: "env-share-655a8",
  storageBucket: "env-share-655a8.firebasestorage.app",
  messagingSenderId: "717170078822",
  appId: "1:717170078822:web:e341bdbd8f1cd67f41a9a7"
};

// Initialize Firebase (Singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
