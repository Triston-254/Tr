import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-w1W8xVQjTBJvYD65poBbbtK68nC7mOA",
  authDomain: "feedback-4c853.firebaseapp.com",
  projectId: "feedback-4c853",
  storageBucket: "feedback-4c853.firebasestorage.app",
  messagingSenderId: "11375245754",
  appId: "1:11375245754:web:f248ce6fd904bbb25c8583",
  measurementId: "G-PQDH7KCKXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add connection debugging
console.log('Firebase config projectId:', firebaseConfig.projectId);
console.log('Firebase app initialized:', app.name);

// Enable persistence (optional)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support all of the features needed to enable persistence');
    }
  });