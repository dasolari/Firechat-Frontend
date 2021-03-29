import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAP0IQFzk_JbijyXFWAEb8ct6qa6xxKTvg",
  authDomain: "firechat-ac1af.firebaseapp.com",
  projectId: "firechat-ac1af",
  storageBucket: "firechat-ac1af.appspot.com",
  messagingSenderId: "76796436814",
  appId: "1:76796436814:web:15df939e4abdac4d5a3e1f",
  measurementId: "G-5R5VZ88BRR"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;