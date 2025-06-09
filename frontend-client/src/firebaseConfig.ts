import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBl1R6fAI4OvN3OjAk4SWPhoFjq872OWxs",
  authDomain: "e-commerce-10954.firebaseapp.com",
  projectId: "e-commerce-10954",
  storageBucket: "e-commerce-10954.firebasestorage.app",
  messagingSenderId: "274450905142",
  appId: "1:274450905142:web:fbc55755ee8a8c88c74097",
  measurementId: "G-TBKT66EYL6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
