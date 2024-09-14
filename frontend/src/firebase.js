// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBODIBKWkKDpXvZgRNtkrKtSVz-ecFHYo",
    authDomain: "ssd-app-966c1.firebaseapp.com",
    projectId: "ssd-app-966c1",
    storageBucket: "ssd-app-966c1.appspot.com",
    messagingSenderId: "596503753275",
    appId: "1:596503753275:web:6f10534dfb20221881621e",
    measurementId: "G-C9SFKKCEGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Firebase Authentication and get a reference to the service
export const auth = getAuth(app);