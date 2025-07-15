import { getDoc, getDocs, collection, doc } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface CollectibleHistory {
  title?: string;
  arSpotName?: string;
  redemptionCode?: string;
  collectedAt?: Date;
}

export interface RedemptionHistory {
  title?: string;
  couponCode?: string;
  collectibleTitle?: string;
  redeemedBy?: string;
  redeemedAt?: Date;
}

export interface UserActivityStats {
  totalCollected: number;
  totalRedeemed: number;
  lastCollectedAt: Date | null;
  lastRedeemedAt: Date | null;
}

export const fetchUserActivityData = async (
  userId: string
): Promise<{
  stats: UserActivityStats | null;
  collected: CollectibleHistory[];
  redeemed: RedemptionHistory[];
}> => {
  try {
    // Fetch user_activity summary document
    const activityDoc = await getDoc(doc(db, 'user_activity', userId));

    const stats: UserActivityStats | null = activityDoc.exists()
      ? {
          totalCollected: activityDoc.data().totalCollected || 0,
          totalRedeemed: activityDoc.data().totalRedeemed || 0,
          lastCollectedAt: activityDoc.data().lastCollectedAt?.toDate() || null,
          lastRedeemedAt: activityDoc.data().lastRedeemedAt?.toDate() || null,
        }
      : null;

    // Fetch collectibles_history
    const collectedSnap = await getDocs(
      collection(db, `user_activity/${userId}/collectibles_history`)
    );
    const collected: CollectibleHistory[] = collectedSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        title: data.title || '',
        arSpotName: data.arSpotName || '',
        redemptionCode: data.redemptionCode || '',
        collectedAt: data.collectedAt?.toDate() || null,
      };
    });

    // Fetch redemptions_history
    const redeemedSnap = await getDocs(
      collection(db, `user_activity/${userId}/redemptions_history`)
    );
    const redeemed: RedemptionHistory[] = redeemedSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        title: data.title || '',
        couponCode: data.couponCode || '',
        collectibleTitle: data.collectibleTitle || '',
        redeemedBy: data.redeemedBy || '',
        redeemedAt: data.redeemedAt?.toDate() || null,
      };
    });

    return { stats, collected, redeemed };
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return { stats: null, collected: [], redeemed: [] };
  }
};
