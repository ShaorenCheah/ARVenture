import { getDocs, collection } from 'firebase/firestore';
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
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const id = doc.id;

      let imageURL = '';
      let iconURL = '';

      // Prefer Firebase document image paths if available
      if (data.imgURL) {
        try {
          const storageRef = ref(storage, data.imgURL);
          imageURL = await getDownloadURL(storageRef);
        } catch {
          console.warn(`Failed to load image from path: ${data.imgURL}`);
        }
      }

      if (data.iconURL) {
        try {
          const iconRef = ref(storage, data.iconURL);
          iconURL = await getDownloadURL(iconRef);
        } catch {
          console.warn(`Failed to load icon from path: ${data.iconURL}`);
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
        collectibleTips: data.collectibleTips,
        modalDescription: data.modalDescription,
        arURL: data.arURL,
      };
    })
  );

  return spots.sort((a, b) => a.priority - b.priority);
}
