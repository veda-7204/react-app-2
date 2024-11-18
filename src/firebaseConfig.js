import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdvx2QKymofjb_XoMMpKzufxqq17L03so",
  authDomain: "growsmart-aa367.firebaseapp.com",
  projectId: "growsmart-aa367",
  storageBucket: "growsmart-aa367.appspot.com",
  messagingSenderId: "62665875649",
  appId: "1:62665875649:android:c7690f7cac972b23e67440",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { auth, firebase, firestore };
