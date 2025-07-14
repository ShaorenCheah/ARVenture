import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase'; // Ensure db is Firestore instance

export const registerWithEmail = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    if (user) {
      // 1. Set display name
      await updateProfile(user, { displayName: name });

      // 2. Create Firestore user document with default role
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName: name,
        role: 'user', // default role
        createdAt: serverTimestamp(),
      });

      // 3. Send verification email
      await sendEmailVerification(user);

      // 4. Sign out (optional, as per your existing logic)
      await signOut(auth);
    }

    return userCredential;
  } catch (error: unknown) {
    let message = 'Something went wrong. Please try again.';

    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      }
    }

    throw new Error(message);
  }
};
