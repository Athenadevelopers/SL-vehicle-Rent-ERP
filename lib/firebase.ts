// Import Firebase core functionality
import { initializeApp, getApps } from "firebase/app"
// Import Firebase services directly
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPMglfN6aBuVZ9r3E881sjIjphhZHsHA8",
  authDomain: "trackace-vo2gn.firebaseapp.com",
  databaseURL: "https://trackace-vo2gn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trackace-vo2gn",
  storageBucket: "trackace-vo2gn.firebasestorage.app",
  messagingSenderId: "305838510077",
  appId: "1:305838510077:web:ba74a58c2d53c8cc6cd394",
}

// Create a client-side only version of Firebase
let firebase = {
  app: null,
  auth: null,
  firestore: null,
  storage: null,
  database: null,
}

// Initialize Firebase only on the client side
if (typeof window !== "undefined") {
  // Initialize Firebase app if it hasn't been initialized yet
  if (!firebase.app) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    firebase = {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
      storage: getStorage(app),
      database: getDatabase(app),
    }
  }
}

export default firebase
