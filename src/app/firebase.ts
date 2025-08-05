// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgzl79KsqqcCKp2Ez6-bBDpQqYeW8cw94",
  authDomain: "todo-c389c.firebaseapp.com",
  projectId: "todo-c389c",
  storageBucket: "todo-c389c.firebasestorage.app",
  messagingSenderId: "736147378828",
  appId: "1:736147378828:web:5424e20198f034b8bb21a9",
  measurementId: "G-Q8X4XZFRB5"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;