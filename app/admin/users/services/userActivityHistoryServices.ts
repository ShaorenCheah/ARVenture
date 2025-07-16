import { collection, getDocs, Timestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface UserActivityStats {
  totalCollected: number;
  lastCollectedAt?: Date;
  totalRedeemed: number;
  lastRedeemedAt?: Date;
}

export interface CollectedItem {
  title: string;
  description: string;
  redemptionCode?: string;
  arSpotId?: string;
  collectedAt: Date;
}

export interface RedeemedItem {
  title: string;
  code?: string;
  status: 'pending' | 'fulfilled';
  redeemedBy?: string;
  spotName?: string;
  redeemedAt?: Date;
  claimedAt: Date;
}

export async function fetchUserActivityData(userId: string): Promise<{
  stats: UserActivityStats;
  collected: CollectedItem[];
  redeemed: RedeemedItem[];
}> {
  const collectedRef = collection(db, 'users', userId, 'collected_items');
  const redeemedRef = collection(db, 'users', userId, 'redeemed_items');

  const collectedSnap = await getDocs(collectedRef);
  const redeemedSnap = await getDocs(redeemedRef);

  const collected: CollectedItem[] = [];
  const redeemed: RedeemedItem[] = [];

  collectedSnap.forEach((docSnap) => {
    const data = docSnap.data();
    collected.push({
      title: data.title || 'Unknown',
      description: data.description || '',
      redemptionCode: data.redemptionCode || '',
      arSpotId: data.arSpotId,
      collectedAt: (data.collectedAt as Timestamp)?.toDate?.() || new Date(0),
    });
  });

  redeemedSnap.forEach((docSnap) => {
    const data = docSnap.data();
    redeemed.push({
      title: data.title || 'Unknown',
      code: data.code,
      status: data.status || 'pending',
      redeemedBy: data.redeemedBy,
      spotName: data.spotName,
      claimedAt: (data.claimedAt as Timestamp)?.toDate?.() || new Date(0),
      redeemedAt: data.redeemedAt ? (data.redeemedAt as Timestamp)?.toDate?.() : undefined,
    });
  });

  const stats: UserActivityStats = {
    totalCollected: collected.length,
    lastCollectedAt: collected.length
      ? collected.reduce(
          (latest, item) => (item.collectedAt > latest ? item.collectedAt : latest),
          new Date(0)
        )
      : undefined,
    totalRedeemed: redeemed.length,
    lastRedeemedAt: redeemed.length
      ? redeemed.reduce(
          (latest, item) =>
            (item.redeemedAt ?? item.claimedAt) > latest
              ? (item.redeemedAt ?? item.claimedAt)
              : latest,
          new Date(0)
        )
      : undefined,
  };

  return { stats, collected, redeemed };
}
