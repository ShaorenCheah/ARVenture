import { getAuth } from 'firebase/auth';
import {
  getDocs,
  collection,
  query,
  orderBy,
  Timestamp,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

import { ARSpotFormInputs } from './arSpotValidation';

import { db, storage } from '@/lib/firebase';

export interface ArSpot {
  id: string;
  name: string;
  address: string;
  description: string;
  arURL: string;
  collectibleId: string;
  collectibleTips?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priority: number;
  createdAt: string;
  imgURL?: string;
  iconURL?: string;
}

export interface CollectibleData {
  title: string;
  description: string;
  redemptionCode: string;
  priority: number;
  imageURL?: string;
  tips: string;
}

export interface CollectibleOption {
  id: string;
  title: string;
  description: string;
  redemptionCode: string;
  priority: number;
  imageURL?: string;
  arSpotId?: string;
}

// Helper function to upload image and return storage path
const uploadImage = async (file: File, path: string): Promise<string> => {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return path; // Return storage path, not download URL
};

// Helper function to delete image from storage
const deleteImage = async (path: string): Promise<void> => {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('Failed to delete image:', path, error);
  }
};

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

      let collectibleTips = '';
      if (data.collectibleId) {
        try {
          const collectible = await fetchCollectibleData(data.collectibleId);
          collectibleTips = collectible?.tips || '';
        } catch (e) {
          console.warn(`Failed to fetch collectible for ${doc.id}:`, e);
        }
      }

      return {
        id: doc.id,
        name: data.name || '',
        address: data.address || '',
        description: data.description || '',
        arURL: data.arURL || '',
        collectibleId: data.collectibleId || '',
        collectibleTips,
        coordinates: {
          lat: parseFloat((data.coordinates?.lat ?? 0).toFixed(4)),
          lng: parseFloat((data.coordinates?.lng ?? 0).toFixed(4)),
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

export const fetchCollectibleData = async (
  collectibleId: string
): Promise<CollectibleData | null> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');

  try {
    const docRef = doc(db, 'collectibles', collectibleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      let imageUrl: string | undefined = undefined;
      if (data.imageURL) {
        try {
          imageUrl = await getDownloadURL(ref(storage, data.imageURL));
        } catch {
          console.warn(`Collectible image not found: ${data.imageURL}`);
        }
      }

      return {
        title: data.title || '',
        description: data.description || '',
        redemptionCode: data.redemptionCode || '',
        priority: data.priority ?? 0,
        imageURL: imageUrl,
        tips: data.tips || '',
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching collectible data:', error);
    return null;
  }
};

// FETCH ALL COLLECTIBLES
export const fetchAllCollectibles = async (): Promise<CollectibleOption[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');

  try {
    const q = query(collection(db, 'collectibles'), orderBy('priority', 'asc'));
    const snapshot = await getDocs(q);

    return Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        let imageUrl: string | undefined = undefined;
        if (data.imageURL) {
          try {
            imageUrl = await getDownloadURL(ref(storage, data.imageURL));
          } catch {
            console.warn(`Collectible image not found for ${doc.id}: ${data.imageURL}`);
          }
        }

        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          redemptionCode: data.redemptionCode || '',
          priority: data.priority ?? 0,
          imageURL: imageUrl,
          arSpotId: data.arSpotId || undefined,
        };
      })
    );
  } catch (error) {
    console.error('Error fetching collectibles:', error);
    throw error;
  }
};

// CREATE AR SPOT
export const createARSpot = async (data: ARSpotFormInputs): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const id = data.name.trim().toLowerCase().replace(/\s+/g, '_');

  const existingSpot = await getDoc(doc(db, 'ar_spots', id));
  if (existingSpot.exists()) {
    throw new Error('AR Spot with this name already exists');
  }

  let imgURL = '';
  let iconURL = '';

  try {
    if (data.imageFile) {
      const ext = data.imageFile.name.split('.').pop();
      imgURL = await uploadImage(data.imageFile, `ar_spots/${id}.${ext}`);
    }

    if (data.iconFile) {
      const ext = data.iconFile.name.split('.').pop();
      iconURL = await uploadImage(data.iconFile, `ar_spots/spots_icons/${id}_icon.${ext}`);
    }

    await setDoc(doc(db, 'ar_spots', id), {
      name: data.name,
      description: data.description,
      address: data.address,
      arURL: data.arURL,
      collectibleId: data.hasCollectible ? data.collectibleId : '',
      priority: data.priority,
      coordinates: {
        lat: parseFloat(data.coordinates.lat.toFixed(4)),
        lng: parseFloat(data.coordinates.lng.toFixed(4)),
      },
      createdAt: serverTimestamp(),
      imgURL,
      iconURL,
    });

    // Update the selected collectible to reference this AR spot
    if (data.hasCollectible && data.collectibleId) {
      await updateDoc(doc(db, 'collectibles', data.collectibleId), {
        arSpotId: id,
      });
    }
  } catch (error) {
    if (imgURL) await deleteImage(imgURL);
    if (iconURL) await deleteImage(iconURL);
    throw error;
  }
};

// UPDATE AR SPOT
export const updateARSpot = async (
  data: ARSpotFormInputs,
  spotId: string,
  existingSpotData: {
    imgURL?: string;
    iconURL?: string;
  }
): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const existingSpot = await getDoc(doc(db, 'ar_spots', spotId));
  if (!existingSpot.exists()) {
    throw new Error('AR Spot not found');
  }

  const currentData = existingSpot.data();
  const currentCollectibleId = currentData.collectibleId;

  let imgURL = existingSpotData.imgURL || '';
  let iconURL = existingSpotData.iconURL || '';

  try {
    // Handle image updates
    if (data.imageFile) {
      if (existingSpotData.imgURL) await deleteImage(existingSpotData.imgURL);
      const ext = data.imageFile.name.split('.').pop();
      imgURL = await uploadImage(data.imageFile, `ar_spots/${spotId}.${ext}`);
    }

    if (data.iconFile) {
      if (existingSpotData.iconURL) await deleteImage(existingSpotData.iconURL);
      const ext = data.iconFile.name.split('.').pop();
      iconURL = await uploadImage(data.iconFile, `ar_spots/spots_icons/${spotId}_icon.${ext}`);
    }

    // Update AR spot document
    await updateDoc(doc(db, 'ar_spots', spotId), {
      name: data.name,
      description: data.description,
      address: data.address,
      arURL: data.arURL,
      collectibleId: data.hasCollectible ? data.collectibleId : '',
      priority: data.priority,
      coordinates: {
        lat: parseFloat(data.coordinates.lat.toFixed(4)),
        lng: parseFloat(data.coordinates.lng.toFixed(4)),
      },
      imgURL,
      iconURL,
    });

    // Handle collectible assignment changes
    if (data.hasCollectible && data.collectibleId) {
      // If collectible changed, remove reference from old collectible
      if (currentCollectibleId && currentCollectibleId !== data.collectibleId) {
        await updateDoc(doc(db, 'collectibles', currentCollectibleId), {
          arSpotId: '',
        });
      }

      // Add reference to new collectible
      await updateDoc(doc(db, 'collectibles', data.collectibleId), {
        arSpotId: spotId,
      });
    } else {
      // If collectible was removed, clear the reference from the old collectible
      if (currentCollectibleId) {
        await updateDoc(doc(db, 'collectibles', currentCollectibleId), {
          arSpotId: '',
        });
      }
    }
  } catch (error) {
    console.error('Error updating AR spot:', error);
    throw error;
  }
};

export const deleteARSpot = async (spotId: string): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const spotRef = doc(db, 'ar_spots', spotId);
  const spotSnap = await getDoc(spotRef);
  if (!spotSnap.exists()) throw new Error('AR Spot not found');

  const data = spotSnap.data();
  const { imgURL, iconURL, collectibleId } = data;

  try {
    // Delete image from storage
    if (imgURL) {
      const imgRef = ref(storage, imgURL);
      await deleteObject(imgRef).catch((err) =>
        console.warn(`Failed to delete main image: ${imgURL}`, err)
      );
    }

    if (iconURL) {
      const iconRef = ref(storage, iconURL);
      await deleteObject(iconRef).catch((err) =>
        console.warn(`Failed to delete icon image: ${iconURL}`, err)
      );
    }

    // Unassign collectible if linked
    if (collectibleId) {
      const collectibleRef = doc(db, 'collectibles', collectibleId);
      await updateDoc(collectibleRef, {
        arSpotId: '',
      });
    }

    // Finally delete the AR spot
    await deleteDoc(spotRef);
  } catch (error) {
    console.error('Error deleting AR spot:', error);
    throw error;
  }
};
