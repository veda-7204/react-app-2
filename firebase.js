// firebase.js

import firebase from 'firebase/app';
import 'firebase/auth'; // Import other services if needed

const firebaseConfig = {
    apiKey: "AIzaSyDBKsNkBBCejT5b5kjB9rDz-uX2_O7RaqA",
    authDomain: "finalreact-b95cd.firebaseapp.com",
    projectId: "finalreact-b95cd",
    storageBucket: "finalreact-b95cd.appspot.com",
    messagingSenderId: "250543185860",
    appId: "1:250543185860:android:8e86c61cd5072c12500e91" // Replace with your actual app ID
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase; // Export the firebase instance
