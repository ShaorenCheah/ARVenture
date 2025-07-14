import { getDocs, collection } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

export interface ArSpot {
  id: string;
  name: string;
  description: string;
  priority: number;
  imageUrl: string;
  iconUrl?: string;
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
      let imageUrl = '';
      let iconUrl = '';

      // Fetch main image
      try {
        const storageRef = ref(storage, `ar_spots/${id}.jpg`);
        imageUrl = await getDownloadURL(storageRef);
      } catch {
        console.warn(`Image for ${id} not found`);
      }

      // Fetch icon
      try {
        const iconRef = ref(storage, `ar_spots/spots_icons/${id}_icon.jpg`);
        iconUrl = await getDownloadURL(iconRef);
      } catch {
        console.warn(`Icon for ${id} not found`);
      }

      return {
        id,
        name: data.name,
        description: data.description,
        priority: data.priority || 99,
        imageUrl,
        iconUrl,
        address: data.address,
        collectibleTips: data.collectibleTips,
        modalDescription: data.modalDescription,
        arURL: data.arURL,
      };
    })
  );

  return spots.sort((a, b) => a.priority - b.priority);
}
