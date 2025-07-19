import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface Collectible {
  id: string;
  title: string;
  description: string;
  imageURL?: string;
  redemptionCode: string;
  priority: number;
  createdAt: Timestamp;
}

export interface UserCollectible {
  collectedAt: Timestamp;
  redemptionCode: string;
  arSpotId: string;
}

export const fetchAllCollectibles = async (
  uid?: string
): Promise<(Collectible & { collected?: boolean; collectedAt?: string })[]> => {
  const snapshot = await getDocs(collection(db, 'collectibles'));

  let userCollected: Record<string, UserCollectible> = {};

  if (uid) {
    const userColSnap = await getDocs(collection(db, 'users', uid, 'collected_items'));
    userCollected = {};
    userColSnap.forEach((doc) => {
      userCollected[doc.id] = doc.data() as UserCollectible;
    });
  }

  const collectibles = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const isCollected = !!userCollected[id];
      const collectedAt = userCollected[id]?.collectedAt?.toDate().toISOString() || '';

      let imageURL = '';
      if (isCollected) {
        try {
          const imageRef = ref(storage, `${data.imageURL}`);
          imageURL = await getDownloadURL(imageRef);
        } catch {
          console.warn(`Image not found for ${id}`);
        }
      }

      return {
        id,
        title: data.title,
        description: data.description,
        redemptionCode: data.redemptionCode,
        priority: data.priority,
        createdAt: data.createdAt,
        imageURL,
        collected: isCollected,
        collectedAt,
      };
    })
  );

  return collectibles.sort((a, b) => a.priority - b.priority);
};
