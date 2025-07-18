'use client';
import { setCookie } from 'cookies-next';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

const firebaseLoginErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'The email address is not valid.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Try again later.',
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    // 1. Sign in via Firebase Auth
    const res = await signInWithEmailAndPassword(auth, email, password);
    await res.user.reload(); // make sure we have latest info

    // 2. Check email verification status directly from Auth
    if (!res.user.emailVerified) {
      await signOut(auth);
      throw new Error(
        'Please verify your email before logging in. Check your inbox for the verification link.'
      );
    }

    // 3. Fetch role from Firestore (optional enhancement: create doc if missing)
    const userRef = doc(db, 'users', res.user.uid);
    const userSnap = await getDoc(userRef);

    let role = 'user';

    if (userSnap.exists()) {
      const data = userSnap.data();
      role = data?.role || 'user';
    } else {
      // Optionally create the user doc here if it doesn't exist
      await setDoc(userRef, {
        email: res.user.email,
        displayName: res.user.displayName || '',
        emailVerified: true,
        role: 'user',
        createdAt: new Date(),
      });
    }

    // 4. Set role cookie
    setCookie('role', role, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 day
    });

    return { user: res.user, role };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code || '';
      const errorMessage =
        firebaseLoginErrorMessages[errorCode] || 'Login failed. Check your credentials.';
      throw new Error(errorMessage);
    }

    throw new Error('Login failed. Please try again.');
  }
};
