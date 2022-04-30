import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCWA7Yaa0k9wT1x4D-gBY-P2ox5xuMJWfw",
  authDomain: "upload-app-4cb2d.firebaseapp.com",
  projectId: "upload-app-4cb2d",
  storageBucket: "upload-app-4cb2d.appspot.com",
  messagingSenderId: "706507927430",
  appId: "1:706507927430:web:61c49198378f130bb48607"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);