import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrnngFMX_V9gOKzocFjBv9VVQkHm7sw2o",
  authDomain: "spark-ai-82d2e.firebaseapp.com",
  projectId: "spark-ai-82d2e",
  storageBucket: "spark-ai-82d2e.appspot.com",
  messagingSenderId: "693224931875",
  appId: "1:693224931875:web:062055ba95a4121e1b6796",
  measurementId: "G-67LJZV0E2D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
