import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAMKOQ54tmoNBLQwcgUN7DFJxAiXoCx770",
  authDomain: "vibe-tek.firebaseapp.com",
  projectId: "vibe-tek",
  storageBucket: "vibe-tek.firebasestorage.app",
  messagingSenderId: "23596774218",
  appId: "1:23596774218:web:c649d89a3f0552139407b3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
