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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const rtdb = getDatabase(app)

export { app, auth, db, storage, rtdb }
