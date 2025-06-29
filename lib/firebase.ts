import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error("Missing required Firebase environment variables:", missingEnvVars)
  console.error("Please create a .env.local file with your Firebase configuration.")
  console.error("You can find these values in your Firebase Console under Project Settings > General")
  
  // In development, provide more helpful error
  if (process.env.NODE_ENV === "development") {
    console.error("For development, you can also use Firebase emulators by uncommenting the emulator connection lines.")
  }
  
  throw new Error(`Missing Firebase configuration: ${missingEnvVars.join(", ")}`)
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize services
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    // Only connect if not already connected and if we have a valid project ID
    if (firebaseConfig.projectId && !firebaseConfig.projectId.includes("demo-")) {
      // Uncomment these lines if you want to use Firebase emulators in development
      // connectFirestoreEmulator(db, 'localhost', 8080)
      // connectStorageEmulator(storage, 'localhost', 9199)
      // connectAuthEmulator(auth, 'http://localhost:9099')
    }
  } catch (error) {
    // Emulators already connected or not available
    console.log("Firebase emulators not connected:", error)
  }
}

export { app, db, storage, auth }

// Export configuration for debugging
export const firebaseConfigDebug = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
}
