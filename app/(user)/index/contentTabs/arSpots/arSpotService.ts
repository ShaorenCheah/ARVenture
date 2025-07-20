import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface ArSpot {
  id: string;
  name: string;
  description: string;
  priority: number;
  imageURL: string;
  iconURL?: string;
  address?: string;
  collectibleTips?: string;
  modalDescription?: string;
  arURL?: string;
}

export async function fetchArSpots(): Promise<ArSpot[]> {
  const snapshot = await getDocs(collection(db, 'ar_spots'));

  const spots: ArSpot[] = await Promise.all(
    snapshot.docs.map(async (document) => {
      const data = document.data();
      const id = document.id;

      let imageURL = '';
      let iconURL = '';
      let tips = '';

      // Load main image from Firebase Storage
      if (data.imgURL) {
        try {
          const storageRef = ref(storage, data.imgURL);
          imageURL = await getDownloadURL(storageRef);
        } catch {
          console.warn(`Failed to load image from path: ${data.imgURL}`);
        }
      }

      // Load icon image from Firebase Storage
      if (data.iconURL) {
        try {
          const iconRef = ref(storage, data.iconURL);
          iconURL = await getDownloadURL(iconRef);
        } catch {
          console.warn(`Failed to load icon from path: ${data.iconURL}`);
        }
      }

      // Load collectible tips from collectible document
      if (data.collectibleId) {
        try {
          const collectibleRef = doc(db, 'collectibles', data.collectibleId);
          const collectibleSnap = await getDoc(collectibleRef);

          if (collectibleSnap.exists()) {
            tips = collectibleSnap.data().tips;
          }
        } catch {
          console.warn(`Failed to load collectible tips: ${data.collectibleId}`);
        }
      }

      return {
        id,
        name: data.name,
        description: data.description,
        priority: data.priority || 99,
        imageURL,
        iconURL,
        address: data.address,
        collectibleTips: tips,
        modalDescription: data.modalDescription,
        arURL: data.arURL,
      };
    })
  );

  return spots.sort((a, b) => a.priority - b.priority);
}
