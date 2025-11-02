import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDhc70V7ANjnFxhoYgh3190ss9wcrmobk",
  authDomain: "farmculator.firebaseapp.com",
  projectId: "farmculator",
  storageBucket: "farmculator.firebasestorage.app",
  messagingSenderId: "374106061083",
  appId: "1:374106061083:web:17224a52ddeb1c90bbbbbe",
  measurementId: "G-2D6605PPVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app, auth};