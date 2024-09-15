// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "spm-web-app.firebaseapp.com",
    projectId: "spm-web-app",
    storageBucket: "spm-web-app.appspot.com",
    messagingSenderId: "913804523625",
    appId: "1:913804523625:web:660e3bc0a3bfe53d428af8",
    measurementId: "G-KH5T0657Z8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Firebase Authentication and get a reference to the service
export const auth = getAuth(app);