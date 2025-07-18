import {
  collection,
  getDocs,
  Timestamp,
  doc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

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
  hasRedeemed: boolean;
  hasClaimed: boolean;
  code?: string;
  claimedAt?: string;
  redeemedAt?: string;
  redeemedBy?: string;
  status?: 'pending' | 'fulfilled';
  imgURL: string;
  isExpired?: boolean;
}

function generateRedemptionCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const fetchRedemptionItems = async (uid?: string): Promise<RedemptionItem[]> => {
  const snapshot = await getDocs(collection(db, 'redemption_items'));
  const now = new Date();

  const getImgURL = async (imgURL: string): Promise<string> => {
    try {
      const imgRef = ref(storage, `${imgURL}`);
      console.log('Fetching image URL:', imgRef.fullPath);
      return await getDownloadURL(imgRef);
    } catch {
      return '';
    }
  };

  // Unauthenticated: return public data only
  if (!uid) {
    const publicItems = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        const expiration = data.expiredAt?.toDate?.();
        if (expiration && expiration < now) return null;

        const imgURL = await getImgURL(data.imgURL || '');
        const stock = Number(data.stock) || 0;
        const claimedSnap = await getDocs(collection(db, 'redemption_items', id, 'history'));
        const claimedCount = claimedSnap.size;

        return {
          id,
          title: data.title || '',
          description: data.description || '',
          requiredCollectibleId: data.requiredCollectibleId || '',
          requiredSpotName: data.requiredSpotName || '',
          stock,
          remaining: Math.max(0, stock - claimedCount),
          hasCollected: Boolean(false),
          hasRedeemed: Boolean(false),
          hasClaimed: Boolean(false),
          imgURL,
        } satisfies RedemptionItem;
      })
    );

    return publicItems.filter((item): item is RedemptionItem => item !== null);
  }

  // Authenticated: also check user's collected/redeemed data
  const userCollected = new Set<string>();
  const userRedeemed: Record<
    string,
    {
      code: string;
      claimedAt?: Timestamp;
      redeemedAt?: Timestamp;
      redeemedBy?: string;
      status: 'pending' | 'fulfilled';
    }
  > = {};

  const collectedSnap = await getDocs(collection(db, 'users', uid, 'collected_items'));
  collectedSnap.forEach((doc) => userCollected.add(doc.id));

  const redeemedSnap = await getDocs(collection(db, 'users', uid, 'redeemed_items'));
  redeemedSnap.forEach((doc) => {
    const data = doc.data();
    userRedeemed[doc.id] = {
      code: data.code,
      claimedAt: data.claimedAt,
      redeemedAt: data.redeemedAt,
      redeemedBy: data.redeemedBy,
      status: data.status,
    };
  });

  const items = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const expiration = data.expiredAt?.toDate?.();
      if (expiration && expiration < now) return null;

      const imgURL = await getImgURL(id);
      const stock = Number(data.stock) || 0;
      const claimedSnap = await getDocs(collection(db, 'redemption_items', id, 'history'));
      const claimedCount = claimedSnap.size;

      const hasCollected = userCollected.has(data.requiredCollectibleId);
      const redeemedInfo = userRedeemed[id];

      const item: RedemptionItem = {
        id,
        title: data.title || '',
        description: data.description || '',
        requiredCollectibleId: data.requiredCollectibleId || '',
        requiredSpotName: data.requiredSpotName || '',
        stock,
        remaining: Math.max(0, stock - claimedCount),
        hasCollected,
        hasClaimed: Boolean(redeemedInfo?.claimedAt),
        hasRedeemed: Boolean(redeemedInfo?.redeemedAt),
        imgURL,
      };

      if (redeemedInfo) {
        item.code = redeemedInfo.code;
        item.claimedAt = redeemedInfo.claimedAt?.toDate().toISOString() || '';
        item.redeemedAt = redeemedInfo.redeemedAt?.toDate().toISOString() || '';
        item.redeemedBy = redeemedInfo.redeemedBy || '';
        item.status = redeemedInfo.status;
      }

      return item;
    })
  );

  return items
    .filter((item): item is RedemptionItem => item !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
};

export const redeemItem = async (
  itemId: string,
  uid: string,
  userName: string
): Promise<{ success: boolean; message: string; code?: string }> => {
  const userDoc = doc(db, 'users', uid);
  const itemDoc = doc(db, 'redemption_items', itemId);
  const redemptionCode = generateRedemptionCode();

  try {
    await runTransaction(db, async (transaction) => {
      const itemSnap = await transaction.get(itemDoc);
      if (!itemSnap.exists()) throw new Error('Redemption item not found.');

      const itemData = itemSnap.data();
      const requiredCollectibleId = itemData.requiredCollectibleId;
      const stock = itemData.stock ?? 0;

      if (stock <= 0) throw new Error('Item out of stock.');

      const collectedDoc = doc(userDoc, 'collected_items', requiredCollectibleId);
      const collectedSnap = await transaction.get(collectedDoc);
      if (!collectedSnap.exists()) throw new Error('Required collectible not found.');

      const redeemedDoc = doc(userDoc, 'redeemed_items', itemId);
      const redeemedSnap = await transaction.get(redeemedDoc);
      if (redeemedSnap.exists()) throw new Error('Item already redeemed.');

      const claimedAt = serverTimestamp();

      // Deduct stock
      transaction.update(itemDoc, { stock: stock - 1 });

      // Write to redeemed_items
      transaction.set(redeemedDoc, {
        title: itemData.title,
        spotName: itemData.requiredSpotName,
        code: redemptionCode,
        claimedAt,
        status: 'pending',
        redeemedAt: null,
        redeemedBy: '',
      });

      // Write to redemption_items/{itemId}/history
      const historyDoc = doc(itemDoc, 'history', uid);
      transaction.set(historyDoc, {
        userId: uid,
        userName,
        code: redemptionCode,
        claimedAt,
        status: 'pending',
        redeemedAt: null,
        redeemedBy: '',
      });
    });

    return { success: true, message: 'Redemption successful.', code: redemptionCode };
  } catch (err: unknown) {
    return { success: false, message: (err as Error).message };
  }
};
