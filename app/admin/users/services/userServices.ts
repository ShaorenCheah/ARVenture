import { getAuth } from 'firebase/auth';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface ARSpotOption {
  id: string;
  name: string;
}

export interface UserRecord {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  displayName: string;
  emailVerified: boolean;
  delegatedSpot?: string;
}

export const fetchARSpots = async (): Promise<ARSpotOption[]> => {
  const snapshot = await getDocs(collection(db, 'ar_spots'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Unnamed Spot',
    };
  });
};

export const fetchUsers = async (): Promise<UserRecord[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');

  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email || '',
      role: data.role || 'user',
      createdAt:
        data.createdAt?.toDate().toLocaleString('en-MY', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }) || '',
      displayName: data.displayName || '',
      emailVerified: data.emailVerified ?? false,
      delegatedSpot: data.delegatedSpot || '',
    };
  });
};
