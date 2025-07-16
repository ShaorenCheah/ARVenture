import { getDocs, doc, collection, query, where, Timestamp, writeBatch } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface RedemptionHistory {
  code: string;
  claimedAt: Timestamp;
  redeemedAt: Timestamp | null;
  redeemedBy: string;
  status: 'pending' | 'fulfilled';
  userId: string;
  userName: string;
}

export interface RedemptionItemRecord {
  id: string;
  title: string;
  requiredCollectibleId: string;
  requiredSpotName: string;
  histories: (RedemptionHistory & { historyId: string })[];
}

export async function fetchRedemptionHistoriesByRole(
  role: 'admin' | 'employee',
  assignedCollectibleIds: string[]
): Promise<RedemptionItemRecord[]> {
  const snapshot = await getDocs(collection(db, 'redemption_items'));
  const results: RedemptionItemRecord[] = [];

  for (const itemDoc of snapshot.docs) {
    const data = itemDoc.data();
    const itemId = itemDoc.id;

    // Only allow items if admin or assigned to the employee
    if (
      role === 'admin' ||
      (role === 'employee' && assignedCollectibleIds.includes(data.requiredCollectibleId))
    ) {
      const historyCol = collection(db, 'redemption_items', itemId, 'history');
      const historySnap = await getDocs(historyCol);
      const histories: (RedemptionHistory & { historyId: string })[] = [];

      historySnap.forEach((h) => {
        const hist = h.data() as RedemptionHistory;
        histories.push({ ...hist, historyId: h.id });
      });

      results.push({
        id: itemId,
        title: data.title,
        requiredCollectibleId: data.requiredCollectibleId,
        requiredSpotName: data.requiredSpotName,
        histories,
      });
    }
  }

  return results;
}

export async function redeemCode(
  code: string,
  currentUserId: string,
  currentUserName: string
): Promise<{ success: boolean; message: string }> {
  const itemSnap = await getDocs(collection(db, 'redemption_items'));

  for (const item of itemSnap.docs) {
    const itemId = item.id;
    const historyRef = collection(db, 'redemption_items', itemId, 'history');
    const historyQuery = query(historyRef, where('code', '==', code));
    const result = await getDocs(historyQuery);

    if (!result.empty) {
      const docRef = result.docs[0].ref;
      const record = result.docs[0].data() as RedemptionHistory;

      if (record.status !== 'pending') {
        return { success: false, message: 'Code has already been redeemed.' };
      }

      const userRedeemedRef = doc(db, 'users', record.userId, 'redeemed_items', itemId);

      const batch = writeBatch(db);

      batch.update(docRef, {
        redeemedAt: Timestamp.now(),
        redeemedBy: currentUserName,
        status: 'fulfilled',
      });

      batch.update(userRedeemedRef, {
        redeemedAt: Timestamp.now(),
        redeemedBy: currentUserName,
        status: 'fulfilled',
      });

      await batch.commit();

      return { success: true, message: 'Code redeemed successfully.' };
    }
  }

  return { success: false, message: 'Code not found.' };
}
