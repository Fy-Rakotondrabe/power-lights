// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5tAtG1TZ_kd6xeBy_io997XcGIvFvgYI",
  authDomain: "power-lights-17e93.firebaseapp.com",
  projectId: "power-lights-17e93",
  storageBucket: "power-lights-17e93.firebasestorage.app",
  messagingSenderId: "9313136699",
  appId: "1:9313136699:web:5287600c5c855d112bec1e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { app, firebaseConfig, db }; // Exporting app, firebaseConfig, and db
