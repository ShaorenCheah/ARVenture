import { getAuth } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserRecord {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  displayName: string;
  emailVerified: boolean;
}

export const fetchUsers = async (): Promise<UserRecord[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');

  const snapshot = await getDocs(collection(db, 'users'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const isCurrentUser = doc.id === currentUser.uid;

    return {
      id: doc.id,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt?.toDate().toLocaleDateString() || '',
      displayName: data.displayName,
      emailVerified: data.emailVerified,
    };
  });
};
