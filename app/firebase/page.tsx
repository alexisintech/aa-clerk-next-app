'use client';
import { useAuth } from '@clerk/nextjs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCdwTSism1bTn8g3Pzlt1A6CGUeWNptcL0',
  authDomain: 'myapp-153c3.firebaseapp.com',
  projectId: 'myapp-153c3',
  storageBucket: 'myapp-153c3.appspot.com',
  messagingSenderId: '650044021428',
  appId: '1:650044021428:web:cd44574055c338641b15e1',
  measurementId: 'G-C8B1RR0PBH',
};

// Connect to your Firebase app
const app = initializeApp(firebaseConfig);
// Connect to your Firestore database
const db = getFirestore(app);
// Connect to Firebase auth
const auth = getAuth(app);

// Remove this if you do not have Firestore set up
// for your Firebase app
const getFirestoreData = async () => {
  const docRef = doc(db, 'example', 'example-document');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
  }
};

export default function FirebaseUI() {
  const { getToken, userId } = useAuth();

  if (!userId) {
    console.log('User needs to sign in with Clerk');
  }

  const signInWithClerk = async () => {
    console.log('Sign in with clerk');
    const token = await getToken({ template: 'integration_firebase' });
    console.log(token);
    const userCredentials = await signInWithCustomToken(auth, token || '');
    // The userCredentials.user object can call the methods of
    // the Firebase platform as an authenticated user.
    console.log('User:', userCredentials.user);
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <button onClick={signInWithClerk}>Sign in to Firebase</button>
      <button onClick={getFirestoreData}>Get document</button>
    </main>
  );
}
