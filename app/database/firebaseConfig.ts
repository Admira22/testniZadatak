"use client"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeOCFG24dBO_0MIFGy5a06pi1DquMBXb8",
  authDomain: "moj-projekat-5dfbd.firebaseapp.com",
  projectId: "moj-projekat-5dfbd",
  storageBucket: "moj-projekat-5dfbd.firebasestorage.app",
  messagingSenderId: "1010898877012",
  appId: "1:1010898877012:web:c1e8028c3bba1f739fcbc1",
  measurementId: "G-0BEK8CP55E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);