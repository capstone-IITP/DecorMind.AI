// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "ai-interior-designer-d2236.firebaseapp.com",
    projectId: "ai-interior-designer-d2236",
    storageBucket: "ai-interior-designer-d2236.firebasestorage.app",
    messagingSenderId: "40068639352",
    appId: "1:40068639352:web:0a22e7770b26a0b4325b8d",
    measurementId: "G-WQZD6JHVW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
    // Import analytics dynamically
    import('firebase/analytics').then((module) => {
        const { getAnalytics } = module;
        analytics = getAnalytics(app);
    });
}

export const storage = getStorage(app);