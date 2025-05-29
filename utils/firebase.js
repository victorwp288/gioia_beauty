// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpzaeStBX4aG_5wmuSFMeQWi0cuWZNxb0",
  authDomain: "clinic-90089.firebaseapp.com",
  projectId: "clinic-90089",
  storageBucket: "clinic-90089.firebasestorage.app",
  messagingSenderId: "837534506588",
  appId: "1:837534506588:web:29e2c3b59d053c64515099",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, analytics };
