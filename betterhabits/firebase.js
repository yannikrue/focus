// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcI3t19maNIV2CWrgv9URq6BisyvL8iBQ",
  authDomain: "betterhabits-ynk.firebaseapp.com",
  projectId: "betterhabits-ynk",
  storageBucket: "betterhabits-ynk.appspot.com",
  messagingSenderId: "20760425741",
  appId: "1:20760425741:web:95f8a50f92e7ed8572ac44"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();

export { auth };