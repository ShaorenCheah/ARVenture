import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

export const registerWithEmail = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName: name });

      await sendEmailVerification(user, {
        url: `https://ar-venture.vercel.app/firebase/verify-email?email=${encodeURIComponent(email)}`,
      });

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
