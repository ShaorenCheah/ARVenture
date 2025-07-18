import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

import { RedemptionItemFormInputs } from './redemptionItemValidation';

import { db, storage } from '@/lib/firebase';

export interface RedemptionItem {
  id: string;
  title: string;
  description: string;
  priority: number;
  stock: number;
  requiredCollectibleId: string;
  requiredSpotName: string;
  createdAt?: import('firebase/firestore').Timestamp;
  imgURL?: string;
  resolvedImgURL?: string;
  isExpired: boolean;
}

export interface ARSpotCollectibleOption {
  collectibleId: string;
  arSpotId: string;
  arSpotName: string;
  label: string;
}

async function uploadImage(file: File, path: string): Promise<string> {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return path;
}

async function deleteImage(path: string): Promise<void> {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Failed to delete image:', path, err);
  }
}

export async function fetchAvailableRedemptionPairs(): Promise<ARSpotCollectibleOption[]> {
  const spotsSnap = await getDocs(collection(db, 'ar_spots'));
  const pairs: ARSpotCollectibleOption[] = [];

  for (const spotDoc of spotsSnap.docs) {
    const spot = spotDoc.data();
    if (spot.collectibleId && !spot.redemptionItemId) {
      const collectibleSnap = await getDoc(doc(db, 'collectibles', spot.collectibleId));
      if (collectibleSnap.exists()) {
        pairs.push({
          collectibleId: spot.collectibleId,
          arSpotId: spotDoc.id,
          arSpotName: spot.name,
          label: `${spot.name} - ${collectibleSnap.data().title}`,
        });
      }
    }
  }

  return pairs;
}

export async function fetchAllRedemptionItems(): Promise<RedemptionItem[]> {
  const snapshot = await getDocs(
    query(collection(db, 'redemption_items'), orderBy('priority', 'asc'))
  );

  return Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      let resolvedImgURL: string | undefined = undefined;
      if (data.imgURL) {
        try {
          resolvedImgURL = await getDownloadURL(ref(storage, data.imgURL));
        } catch {
          console.warn(`Image not found for redemption item ${docSnap.id}: ${data.imgURL}`);
        }
      }

      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        stock: data.stock,
        requiredCollectibleId: data.requiredCollectibleId,
        requiredSpotName: data.requiredSpotName,
        createdAt: data.createdAt,
        imgURL: data.imgURL,
        resolvedImgURL,
        isExpired: data.isExpired ?? false,
      };
    })
  );
}

export async function createRedemptionItem(
  data: Omit<RedemptionItemFormInputs, 'requiredSpotName'>
): Promise<void> {
  const id = data.title.trim().toLowerCase().replace(/\s+/g, '_');
  const itemRef = doc(db, 'redemption_items', id);

  let imgURL = '';
  let requiredSpotName = '';

  try {
    // Resolve AR Spot name from collectibleId
    const spotQuery = query(
      collection(db, 'ar_spots'),
      where('collectibleId', '==', data.requiredCollectibleId)
    );
    const spotSnap = await getDocs(spotQuery);
    if (spotSnap.empty) throw new Error('No AR Spot linked to selected collectible');
    const spotDoc = spotSnap.docs[0];
    requiredSpotName = spotDoc.data().name || '';

    // Upload image
    if (data.imageFile) {
      const ext = data.imageFile.name.split('.').pop();
      imgURL = await uploadImage(
        data.imageFile,
        `redemption_items/${id}.${ext}`
      );
    }

    // Save to Firestore
    await setDoc(itemRef, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      stock: data.stock,
      requiredCollectibleId: data.requiredCollectibleId,
      requiredSpotName,
      createdAt: serverTimestamp(),
      imgURL,
      isExpired: false,
    });

    // Link back to AR Spot
    await updateDoc(doc(db, 'ar_spots', spotDoc.id), {
      redemptionItemId: id,
    });
  } catch (error) {
    if (imgURL) await deleteImage(imgURL);
    throw error;
  }
}

export async function updateRedemptionItem(
  id: string,
  data: Omit<RedemptionItemFormInputs, 'requiredSpotName'>,
  existingImgPath?: string
): Promise<void> {
  const itemRef = doc(db, 'redemption_items', id);

  let imgURL = existingImgPath || '';
  let requiredSpotName = '';

  try {
    const existingSnap = await getDoc(itemRef);
    if (!existingSnap.exists()) throw new Error('Redemption item not found');
    const existingData = existingSnap.data();

    // Resolve AR Spot name again
    const spotQuery = query(
      collection(db, 'ar_spots'),
      where('collectibleId', '==', data.requiredCollectibleId)
    );
    const spotSnap = await getDocs(spotQuery);
    if (spotSnap.empty) throw new Error('No AR Spot linked to selected collectible');
    const spotDoc = spotSnap.docs[0];
    requiredSpotName = spotDoc.data().name || '';

    // Replace image if changed
    if (data.imageFile) {
      if (existingImgPath) await deleteImage(existingImgPath);
      const ext = data.imageFile.name.split('.').pop();
      imgURL = await uploadImage(
        data.imageFile,
        `redemption_items/redemption_${requiredSpotName.toLowerCase().replace(/\s+/g, '_')}.${ext}`
      );
    }

    // Update Firestore doc
    await updateDoc(itemRef, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      stock: data.stock,
      requiredCollectibleId: data.requiredCollectibleId,
      requiredSpotName,
      imgURL,
      isExpired: existingData.isExpired ?? false,
    });
  } catch (err) {
    console.error('Error updating redemption item:', err);
    throw err;
  }
}

export async function deleteRedemptionItem(id: string): Promise<void> {
  const itemRef = doc(db, 'redemption_items', id);
  const docSnap = await getDoc(itemRef);

  if (!docSnap.exists()) throw new Error('Redemption item not found');

  const { imgURL } = docSnap.data();
  if (imgURL) await deleteImage(imgURL);
  await deleteDoc(itemRef);

  const spotQuery = query(collection(db, 'ar_spots'), where('redemptionItemId', '==', id));
  const spotSnap = await getDocs(spotQuery);
  if (!spotSnap.empty) {
    const spotDoc = spotSnap.docs[0];
    await updateDoc(doc(db, 'ar_spots', spotDoc.id), {
      redemptionItemId: '',
    });
  }
}

export async function expireRedemptionItem(id: string): Promise<void> {
  const itemRef = doc(db, 'redemption_items', id);
  const itemSnap = await getDoc(itemRef);
  if (!itemSnap.exists()) throw new Error('Redemption item not found');

  await updateDoc(itemRef, {
    isExpired: true,
  });

  const spotQuery = query(collection(db, 'ar_spots'), where('redemptionItemId', '==', id));
  const spotSnap = await getDocs(spotQuery);
  if (!spotSnap.empty) {
    const spotDoc = spotSnap.docs[0];
    await updateDoc(doc(db, 'ar_spots', spotDoc.id), {
      redemptionItemId: '',
    });
  }
}
