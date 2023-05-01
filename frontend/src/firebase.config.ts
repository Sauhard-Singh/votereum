// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcZpYVuSqEtQe4L7bcETfhb5KyOVhDNng",
  authDomain: "mobile-1c395.firebaseapp.com",
  projectId: "mobile-1c395",
  storageBucket: "mobile-1c395.appspot.com",
  messagingSenderId: "26047478945",
  appId: "1:26047478945:web:304bf17393d26727ab04e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
