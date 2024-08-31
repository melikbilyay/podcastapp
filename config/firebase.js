import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLd7X72OpxeX8AQyfbgC8d25sIHws0s8k",
    authDomain: "podcastapp-2e521.firebaseapp.com",
    projectId: "podcastapp-2e521",
    storageBucket: "podcastapp-2e521.appspot.com",
    messagingSenderId: "444891502936",
    appId: "1:444891502936:web:9168e3f8459eca4dfeed2d",
    measurementId: "G-1G8JFE2240"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
