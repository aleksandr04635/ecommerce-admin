//import jwt from "jsonwebtoken";
import mongoose from "mongoose";
//import dotenv from "dotenv";
//dotenv.config();

//FIREBASE_API_KEY=AIzaSyDUvxFA7Vv_FHmhzmxLsWs-Iw5BNdpHFuw

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "mern-blog-1c1f6.firebaseapp.com",
  projectId: "mern-blog-1c1f6",
  storageBucket: "mern-blog-1c1f6.appspot.com",
  messagingSenderId: "916742751526",
  appId: "1:916742751526:web:3c028738af122cfece6de7",
};

//console.log("firebaseConfig:", firebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
