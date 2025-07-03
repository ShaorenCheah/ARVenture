'use client';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';

const RADIUS_METERS = 5000;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

export const redeemCollectibleWithLocation = async (
  code: string,
  uid: string,
  position: GeolocationPosition | null
): Promise<{
  success: boolean;
  message: string;
  data?: {
    imageURL?: string;
    title: string;
    description: string;
  };
}> => {
  if (!position) {
    return { success: false, message: 'Location access required.' };
  }

  const collectibleQuery = query(
    collection(db, 'collectibles'),
    where('redemptionCode', '==', code)
  );
  const collectibleSnap = await getDocs(collectibleQuery);

  if (collectibleSnap.empty) {
    return { success: false, message: 'Invalid redemption code.' };
  }

  const collectibleDoc = collectibleSnap.docs[0];
  const collectibleId = collectibleDoc.id;
  const collectibleData = collectibleDoc.data();
  const arSpotId = collectibleData.arSpotId;

  if (!arSpotId) {
    return { success: false, message: 'Collectible is not linked to an AR Spot.' };
  }

  // Check if already redeemed
  const userCollectibleDoc = await getDoc(
    doc(db, 'user_collections', uid, 'collected', collectibleId)
  );
  if (userCollectibleDoc.exists()) {
    return { success: false, message: 'You have already redeemed this collectible.' };
  }

  const arSpotDoc = await getDoc(doc(db, 'ar_spots', arSpotId));
  if (!arSpotDoc.exists()) {
    return { success: false, message: 'AR Spot not found for this collectible.' };
  }

  const arSpotData = arSpotDoc.data();
  const lat = arSpotData.coordinates?.lat;
  const lng = arSpotData.coordinates?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { success: false, message: 'AR Spot coordinates are invalid or missing.' };
  }

  const distance = haversineDistance(position.coords.latitude, position.coords.longitude, lat, lng);

  if (distance > RADIUS_METERS) {
    return { success: false, message: `You are too far away. (${Math.round(distance)}m)` };
  }

  await setDoc(doc(db, 'user_collections', uid, 'collected', collectibleId), {
    collectedDate: new Date().toISOString(),
    redeemedFrom: code,
    redeemedAt: serverTimestamp(),
  });

  let imageURL = '';
  try {
    const imageRef = ref(storage, `collectibles/${collectibleId}.png`);
    imageURL = await getDownloadURL(imageRef);
  } catch {
    console.warn(`No image found for collectible ${collectibleId}`);
  }

  return {
    success: true,
    message: 'Collectible successfully redeemed!',
    data: {
      title: collectibleData.title,
      description: collectibleData.description,
      imageURL,
    },
  };
};
