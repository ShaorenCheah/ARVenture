import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface Collectible {
  id: string;
  title: string;
  description: string;
  imageURL?: string; // Optional initially
  redemptionCode: string;
  priority: number;
  createdAt: Timestamp;
}

export interface UserCollectible {
  collectedDate: string;
}

export const fetchAllCollectibles = async (uid?: string): Promise<Collectible[]> => {
  const snapshot = await getDocs(collection(db, 'collectibles'));

  let userCollected: Record<string, UserCollectible> = {};

  if (uid) {
    const userColRef = collection(db, 'user_collections', uid, 'collected');
    const userColSnap = await getDocs(userColRef);
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
      const collectedDate = userCollected[id]?.collectedDate || '';

      let imageURL = '';
      if (isCollected) {
        try {
          const imageRef = ref(storage, `collectibles/${id}.png`);
          imageURL = await getDownloadURL(imageRef);
        } catch {
          console.warn(`Image not found for ${id}`);
        }
      }

      return {
        id,
        ...data,
        imageURL,
        collected: isCollected,
        collectedDate,
      } as Collectible & { collected?: boolean; collectedDate?: string };
    })
  );

  return collectibles.sort((a, b) => a.priority - b.priority);
};
