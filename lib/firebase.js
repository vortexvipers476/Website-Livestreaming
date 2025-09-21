import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUvOWcm1hvyQ25UfPsRXc7gB4aG8Hhkj8",
  authDomain: "website-livestreaming-15db7.firebaseapp.com",
  projectId: "website-livestreaming-15db7",
  storageBucket: "website-livestreaming-15db7.firebasestorage.app",
  messagingSenderId: "432251830237",
  appId: "1:432251830237:web:387ac4f96faddfe7530034",
  measurementId: "G-EGR7PKX533"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Initialize Analytics (hanya di browser)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Error initializing Analytics:", error);
  }
}

export { db, app, analytics };
