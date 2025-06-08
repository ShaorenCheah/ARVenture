import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

export const registerWithEmail = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      toast.success('Account created! Please check your email to verify before logging in.', {
        duration: 8000,
      });

      await signOut(auth);
    }

    return userCredential;
  } catch (error: any) {
    let message = 'Something went wrong. Please try again.';
    if (error.code === 'auth/email-already-in-use') message = 'This email is already registered.';
    else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
    else if (error.code === 'auth/weak-password') message = 'Password is too weak.';

    toast.error(message, { duration: 6000 });
    throw error;
  }
};
