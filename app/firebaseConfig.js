// firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe3Qe7kleT-uTaPiyapU7P7OV2sVhHJy8",
  authDomain: "todo-mobile-2e381.firebaseapp.com",
  projectId: "todo-mobile-2e381",
  storageBucket: "todo-mobile-2e381.appspot.com",
  messagingSenderId: "505651085487",
  appId: "1:505651085487:web:f7a3da094bd4b5bcdd545a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
