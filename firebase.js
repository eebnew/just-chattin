import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDywZieUhZn8KZeZQ0nG7NJKwWe0auApTY",
  authDomain: "just-chattin.firebaseapp.com",
  projectId: "just-chattin",
  storageBucket: "just-chattin.appspot.com",
  messagingSenderId: "586919905592",
  appId: "1:586919905592:web:5e5103b3c104a05be4d9cd"
};

let app;

if(!firebase.apps.length){
  app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export {db, auth};