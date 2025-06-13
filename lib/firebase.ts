// Import Firebase core functionality
import { initializeApp, getApps } from "firebase/app"

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

// Initialize Firebase app instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export { app }

// Export a function to get auth that ensures auth is only initialized when called
export function getFirebaseAuth() {
  if (typeof window !== "undefined") {
    const { getAuth } = require("firebase/auth")
    return getAuth(app)
  }
  return null
}

// Export a function to get firestore that ensures firestore is only initialized when called
export function getFirebaseFirestore() {
  if (typeof window !== "undefined") {
    const { getFirestore } = require("firebase/firestore")
    return getFirestore(app)
  }
  return null
}

// Export a function to get storage that ensures storage is only initialized when called
export function getFirebaseStorage() {
  if (typeof window !== "undefined") {
    const { getStorage } = require("firebase/storage")
    return getStorage(app)
  }
  return null
}

// Export a function to get realtime database that ensures rtdb is only initialized when called
export function getFirebaseDatabase() {
  if (typeof window !== "undefined") {
    const { getDatabase } = require("firebase/database")
    return getDatabase(app)
  }
  return null
}
