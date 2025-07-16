import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDDyr31vsNbQtzHQD43Uq1-ULgdDdNqhLE",
  authDomain: "my-medicine-app-88193.firebaseapp.com",
  projectId: "my-medicine-app-88193",
  storageBucket: "my-medicine-app-88193.appspot.com",
  messagingSenderId: "698178335177",
  appId: "1:698178335177:web:0ca946d46dbe3bf63bf818",
  measurementId: "G-S3WZC72H9D"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
export const auth = getAuth(app)
