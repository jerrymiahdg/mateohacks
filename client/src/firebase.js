// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDLtBVlSaqngQ4QOtYF3Mz3dodJIKpRGk",
  authDomain: "mateohacks-project.firebaseapp.com",
  projectId: "mateohacks-project",
  storageBucket: "mateohacks-project.appspot.com",
  messagingSenderId: "549783915292",
  appId: "1:549783915292:web:ca6232f9b64d12ecec08d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
