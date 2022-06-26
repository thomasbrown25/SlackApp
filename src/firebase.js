// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getAnalytics } from 'firebase/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC5tBuoUjP4xTAvY9_IGrxr3PhsDXgGnw8',
    authDomain: 'slack-app-e7dec.firebaseapp.com',
    projectId: 'slack-app-e7dec',
    storageBucket: 'slack-app-e7dec.appspot.com',
    messagingSenderId: '88576952207',
    appId: '1:88576952207:web:2d7d1eca31b5edd0996dfa',
    measurementId: 'G-CRSZLVZ3J1'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebase);

export default firebase;
