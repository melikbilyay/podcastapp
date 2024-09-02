import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
    apiKey: "AIzaSyBfGEiaYewpyhIpssT79-vm2ILZMavq274",
    authDomain: "pod2-7cde2.firebaseapp.com",
    projectId: "pod2-7cde2",
    storageBucket: "pod2-7cde2.appspot.com",
    messagingSenderId: "450588673968",
    appId: "1:450588673968:web:4553a27e61d3b035347875",
    measurementId: "G-HT188V0VRM"
};

// Firebase uygulaması zaten başlatılmışsa mevcut olanı kullanın, aksi halde yeni bir tane başlatın
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase servislerini başlatın
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export { auth, storage, db};
