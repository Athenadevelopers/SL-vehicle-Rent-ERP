import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPMglfN6aBuVZ9r3E881sjIjphhZHsHA8",
  authDomain: "trackace-vo2gn.firebaseapp.com",
  databaseURL: "https://trackace-vo2gn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trackace-vo2gn",
  storageBucket: "trackace-vo2gn.firebasestorage.app",
  messagingSenderId: "305838510077",
  appId: "1:305838510077:web:ba74a58c2d53c8cc6cd394",
}

// Initialize Firebase
let app
let auth
let db
let storage
let rtdb

// Check if we're in the browser environment
if (typeof window !== "undefined") {
  try {
    // Initialize Firebase only if it hasn't been initialized yet
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

    // Initialize services
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    rtdb = getDatabase(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
} else {
  // Server-side initialization if needed
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
}

export { app, auth, db, storage, rtdb }
