import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3IZ1uVO-Xf9IyEwlJOqqYORXhgjq9I18",
  authDomain: "oders-noodles.firebaseapp.com",
  projectId: "oders-noodles",
  storageBucket: "oders-noodles.firebasestorage.app",
  messagingSenderId: "916923318331",
  appId: "1:916923318331:web:5d9f741ffeba31c2fc5c1e",
  measurementId: "G-H9V0HNBTQ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };