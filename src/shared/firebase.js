import firebase from "firebase/app";

// 사용할 것들을 전부 불러옵니다 :)
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyARy15MiAMXLY9lbZg16OT-FwxSJDA_wIM",
  authDomain: "img-community-6b906.firebaseapp.com",
  projectId: "img-community-6b906",
  storageBucket: "img-community-6b906.appspot.com",
  messagingSenderId: "1095744380452",
  appId: "1:1095744380452:web:bb3b96c42c0ed6e242c2b1",
  measurementId: "G-FE6PGW3LC7",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export { auth, apiKey, firestore, storage, realtime };
