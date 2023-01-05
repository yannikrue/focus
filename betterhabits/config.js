import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAh6eRZWEu6_w-P9UuPss5Tr7hLT1b5GOw",
  authDomain: "habits-ynk.firebaseapp.com",
  projectId: "habits-ynk",
  storageBucket: "habits-ynk.appspot.com",
  messagingSenderId: "656551783148",
  appId: "1:656551783148:web:8dfa88eb6a0e08c46ad3c9",
  measurementId: "G-QBBWEH7EM9"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };