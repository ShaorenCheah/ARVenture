import { getAuth } from 'firebase/auth';
import {
  getDocs,
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { CollectibleFormInputs } from './collectibleValidation';

import { db, storage } from '@/lib/firebase';

export interface ARSpotOption {
  id: string;
  name: string;
}

export interface Collectible {
  id: string;
  title: string;
  description: string;
  redemptionCode: string;
  priority: number;
  imageURL?: string;
  tips: string;
  arSpotId?: string;
  createdAt: string;
}

export interface CollectibleWithARSpot extends Collectible {
  arSpotName?: string;
}

const uploadImage = async (file: File, path: string): Promise<string> => {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return path;
};

const deleteImage = async (path: string): Promise<void> => {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Failed to delete image:', path, err);
  }
};

export const fetchAllCollectibles = async (): Promise<CollectibleWithARSpot[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  try {
    const q = query(collection(db, 'collectibles'), orderBy('priority', 'asc'));
    const snapshot = await getDocs(q);

    return Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        let imageUrl: string | undefined = undefined;
        if (data.imageURL) {
          try {
            imageUrl = await getDownloadURL(ref(storage, data.imageURL));
          } catch {
            console.warn(`Collectible image not found for ${docSnap.id}: ${data.imageURL}`);
          }
        }

        let arSpotName: string | undefined = undefined;
        if (data.arSpotId) {
          try {
            const spotSnap = await getDoc(doc(db, 'ar_spots', data.arSpotId));
            if (spotSnap.exists()) {
              arSpotName = spotSnap.data().name || '';
            }
          } catch (err) {
            console.warn(`Failed to fetch AR Spot for collectible ${docSnap.id}:`, err);
          }
        }

        const collectible: CollectibleWithARSpot = {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          redemptionCode: data.redemptionCode || '',
          priority: data.priority ?? 0,
          imageURL: imageUrl,
          tips: data.tips || '',
          arSpotId: data.arSpotId || undefined,
          arSpotName,
          createdAt:
            data.createdAt?.toDate().toLocaleString('en-MY', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }) || '',
        };

        return collectible;
      })
    );
  } catch (error) {
    console.error('Error fetching collectibles:', error);
    throw error;
  }
};

export const createCollectible = async (data: CollectibleFormInputs): Promise<void> => {
  const id = data.title.trim().toLowerCase().replace(/\s+/g, '_');

  const docRef = doc(db, 'collectibles', id);
  const existing = await getDoc(docRef);
  if (existing.exists()) throw new Error('Collectible with this name already exists');

  let imageURL = '';
  try {
    if (data.imageFile) {
      const ext = data.imageFile.name.split('.').pop();
      imageURL = await uploadImage(data.imageFile, `collectibles/${id}.${ext}`);
    }

    await setDoc(docRef, {
      title: data.title,
      description: data.description,
      redemptionCode: data.redemptionCode,
      tips: data.tips,
      priority: data.priority,
      imageURL,
      arSpotId: data.arSpotId || '',
      createdAt: new Date(),
    });
  } catch (error) {
    if (imageURL) await deleteImage(imageURL);
    throw error;
  }
};

export const updateCollectible = async (
  data: CollectibleFormInputs,
  id: string,
  existingImagePath?: string
): Promise<void> => {
  const docRef = doc(db, 'collectibles', id);

  const current = await getDoc(docRef);
  if (!current.exists()) throw new Error('Collectible not found');

  let imageURL = existingImagePath || '';

  try {
    if (data.imageFile) {
      if (existingImagePath) await deleteImage(existingImagePath);
      const ext = data.imageFile.name.split('.').pop();
      imageURL = await uploadImage(data.imageFile, `collectibles/${id}.${ext}`);
    }

    await updateDoc(docRef, {
      title: data.title,
      description: data.description,
      redemptionCode: data.redemptionCode,
      tips: data.tips,
      priority: data.priority,
      imageURL,
      arSpotId: data.arSpotId || '',
      createdAt: new Date(),
    });
  } catch (err) {
    console.error('Error updating collectible:', err);
    throw err;
  }
};

export const deleteCollectible = async (id: string): Promise<void> => {
  const docRef = doc(db, 'collectibles', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Collectible not found');

  const { imageURL } = docSnap.data();
  if (imageURL) await deleteImage(imageURL);
  await deleteDoc(docRef);
};
