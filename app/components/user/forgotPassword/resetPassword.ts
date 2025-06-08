'use client';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    const errorCode = error.code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/invalid-email': 'Invalid email address.',
    };
    const errorMessage = errorMessages[errorCode as string] || 'Failed to send reset email.';
    throw new Error(errorMessage);
  }
};
