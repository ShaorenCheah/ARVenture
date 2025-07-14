import { getAuth } from 'firebase/auth';
import { getDocs, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface ArSpot {
  id: string;
  name: string;
  address: string;
  description: string;
  arURL: string;
  collectibleId: string;
  collectibleTips: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priority: number;
  createdAt: string; // formatted for display
  imgURL?: string;
  iconURL?: string;
}

export const fetchArSpots = async (): Promise<ArSpot[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');

  const q = query(collection(db, 'ar_spots'), orderBy('priority', 'asc'));
  const snapshot = await getDocs(q);

  return Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const timestamp: Timestamp | undefined = data.createdAt;

      let imageUrl: string | undefined = undefined;
      let iconUrl: string | undefined = undefined;

      if (data.imgURL) {
        try {
          imageUrl = await getDownloadURL(ref(storage, data.imgURL));
        } catch {
          console.warn(`Image not found for ${doc.id}: ${data.imgURL}`);
        }
      }

      if (data.iconURL) {
        try {
          iconUrl = await getDownloadURL(ref(storage, data.iconURL));
        } catch {
          console.warn(`Icon not found for ${doc.id}: ${data.iconURL}`);
        }
      }

      return {
        id: doc.id,
        name: data.name || '',
        address: data.address || '',
        description: data.description || '',
        arURL: data.arURL || '',
        collectibleId: data.collectibleId || '',
        collectibleTips: data.collectibleTips || '',
        coordinates: {
          lat: data.coordinates?.lat ?? 0,
          lng: data.coordinates?.lng ?? 0,
        },
        priority: data.priority ?? 0,
        createdAt: timestamp
          ? timestamp.toDate().toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '',
        imgURL: imageUrl,
        iconURL: iconUrl,
      };
    })
  );
};
