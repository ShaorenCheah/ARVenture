'use client';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase';

const firebaseLoginErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'The email address is not valid.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Try again later.',
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Ensure up-to-date user info
    await res.user.reload();

    if (!res.user.emailVerified) {
      await signOut(auth);
      throw new Error(
        'Please verify your email before logging in. Check your inbox for the verification link.'
      );
    }

    // Optional: Force refresh token to update claims
    await res.user.getIdToken(true);

    return res.user;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      if (error.message?.includes('Please verify your email')) {
        throw error;
      }

      const errorCode = error.code || '';
      const errorMessage =
        firebaseLoginErrorMessages[errorCode] || 'Login failed. Check your credentials.';
      throw new Error(errorMessage);
    }
    // Fallback: unknown error
    throw new Error('Login failed. Please try again.');
  }
};
