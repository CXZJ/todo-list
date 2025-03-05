import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCyEWVTiPhEatJo5SVaqLZFyvaroMGrCZs",
  authDomain: "todo-list-17537.firebaseapp.com",
  projectId: "todo-list-17537",
  storageBucket: "todo-list-17537.firebasestorage.app",
  messagingSenderId: "989558318794",
  appId: "1:989558318794:web:0a2de2a88c5d7a0161b633",
  measurementId: "G-327YW3YDL7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
