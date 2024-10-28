// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSjdEXy7Et3x46wdCp1xsyAbhLOWgR9uY",
  authDomain: "talkio-30a60.firebaseapp.com",
  projectId: "talkio-30a60",
  storageBucket: "talkio-30a60.appspot.com",
  messagingSenderId: "178802693379",
  appId: "1:178802693379:web:930e19cd012edb38a40536",
  measurementId: "G-C1YLSJMC8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)