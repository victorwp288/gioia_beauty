// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAuWwmKaTpYR4AlGaRo1CXDkUb_XlaOinU',
  authDomain: 'clinic-418813.firebaseapp.com',
  projectId: 'clinic-418813',
  storageBucket: 'clinic-418813.appspot.com',
  messagingSenderId: '988012998371',
  appId: '1:988012998371:web:85f7ca36a9154e3c799fd6',
  measurementId: 'G-5HM2L5RPHD',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
const auth = getAuth(app)
const db = getFirestore(app)

export { db, auth, analytics }
