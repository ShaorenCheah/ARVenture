import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface RedemptionItem {
  id: string;
  title: string;
  description: string;
  requiredCollectibleId: string;
  requiredSpotName: string;
  stock: number;
  remaining: number;
  hasCollected: boolean;
  imageURL?: string;
}

export const fetchRedemptionItems = async (uid?: string): Promise<RedemptionItem[]> => {
  const snapshot = await getDocs(collection(db, 'redemption_items'));
  console.log('snapshot', snapshot);

  let userCollected: Set<string> = new Set();

  if (uid) {
    const userColSnap = await getDocs(collection(db, 'user_collections', uid, 'collected'));
    userColSnap.forEach((doc) => {
      userCollected.add(doc.id);
    });
  }

  const items: RedemptionItem[] = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      let imageURL = '';

      try {
        const imgRef = ref(storage, `redemption_items/${id}.png`);
        imageURL = await getDownloadURL(imgRef);
      } catch {
        console.warn(`Image for redemption ${id} not found`);
      }

      const stock = Number(data.stock) || 0;

      const redeemedSnap = await getDocs(collection(db, 'redemption_items', id, 'claimed'));
      const claimedCount = redeemedSnap.size;

      return {
        id,
        title: data.title || '',
        description: data.description || '',
        requiredCollectibleId: data.requiredCollectibleId || '',
        requiredSpotName: data.requiredSpotName || '',
        stock,
        remaining: Math.max(0, stock - claimedCount),
        hasCollected: uid ? userCollected.has(data.requiredCollectibleId) : false,
        imageURL,
      };
    })
  );

  return items.sort((a, b) => a.title.localeCompare(b.title));
};
