// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBuHsMLlZa1bvuKXNMePVLvvj6aGJlyIlk",
    authDomain: "booking-react-1c2a2.firebaseapp.com",
    projectId: "booking-react-1c2a2",
    storageBucket: "booking-react-1c2a2.firebasestorage.app",
    messagingSenderId: "1085004540368",
    appId: "1:1085004540368:web:a639cc50953d50c7ca31d5",
    measurementId: "G-R7DVS74VHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
export { firebaseConfig };