import {
  getDocs,
  doc,
  collection,
  query,
  where,
  Timestamp,
  writeBatch,
  getDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface RedemptionHistory {
  code: string;
  claimedAt: Timestamp;
  redeemedAt: Timestamp | null;
  redeemedBy: string;
  status: 'pending' | 'fulfilled';
  userId: string;
  userName: string;
  userEmail?: string;
}

export interface RedemptionItemRecord {
  id: string;
  title: string;
  requiredCollectibleId: string;
  requiredSpotName: string;
  histories: (RedemptionHistory & { historyId: string })[];
}

// Helper function to censor text for employees
function censorText(text: string, isRedeemed: boolean = false): string {
  if (!text || isRedeemed) return text;

  if (text.includes('@')) {
    // Email censoring
    const [username, domain] = text.split('@');
    if (username.length <= 2) return text;
    return `${username.slice(0, 2)}${'*'.repeat(username.length - 2)}@${domain}`;
  } else {
    // Name/code censoring
    if (text.length <= 2) return text;
    return `${text.slice(0, 2)}${'*'.repeat(text.length - 2)}`;
  }
}

// Get user's delegated spot and corresponding collectible/redemption item
async function getUserDelegatedInfo(userId: string): Promise<{
  delegatedSpot: string;
  collectibleId: string;
  redemptionItemId: string;
} | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    const delegatedSpot = userData.delegatedSpot;

    if (!delegatedSpot) return null;

    const spotDoc = await getDoc(doc(db, 'ar_spots', delegatedSpot));
    if (!spotDoc.exists()) return null;

    const spotData = spotDoc.data();
    return {
      delegatedSpot,
      collectibleId: spotData.collectibleId,
      redemptionItemId: spotData.redemptionItemId,
    };
  } catch (error) {
    console.error('Error fetching user delegated info:', error);
    return null;
  }
}

export async function fetchRedemptionHistoriesByRole(
  role: 'admin' | 'employee',
  currentUserId?: string
): Promise<RedemptionItemRecord[]> {
  const results: RedemptionItemRecord[] = [];

  if (role === 'employee' && !currentUserId) {
    return results;
  }

  let allowedRedemptionItemIds: string[] = [];

  if (role === 'employee') {
    const delegatedInfo = await getUserDelegatedInfo(currentUserId!);
    if (!delegatedInfo) return results;
    allowedRedemptionItemIds = [delegatedInfo.redemptionItemId];
  }

  const snapshot = await getDocs(collection(db, 'redemption_items'));

  for (const itemDoc of snapshot.docs) {
    const data = itemDoc.data();
    const itemId = itemDoc.id;

    // Filter items based on role
    if (role === 'employee' && !allowedRedemptionItemIds.includes(itemId)) {
      continue;
    }

    const historyCol = collection(db, 'redemption_items', itemId, 'history');
    const historySnap = await getDocs(historyCol);
    const histories: (RedemptionHistory & { historyId: string })[] = [];

    historySnap.forEach((h) => {
      const hist = h.data() as RedemptionHistory;
      const isRedeemed = hist.status === 'fulfilled';

      // Apply censoring for employees
      if (role === 'employee') {
        histories.push({
          ...hist,
          historyId: h.id,
          userName: hist.userName,
          userEmail: hist.userEmail ? censorText(hist.userEmail, isRedeemed) : undefined,
          code: censorText(hist.code, isRedeemed),
          status: hist.status === 'pending' ? 'pending' : hist.status,
        });
      } else {
        histories.push({ ...hist, historyId: h.id });
      }
    });

    results.push({
      id: itemId,
      title: data.title,
      requiredCollectibleId: data.requiredCollectibleId,
      requiredSpotName: data.requiredSpotName,
      histories,
    });
  }

  return results;
}

export async function redeemCode(
  code: string,
  currentUserId: string,
  currentUserName: string,
  userRole: 'admin' | 'employee'
): Promise<{ success: boolean; message: string }> {
  try {
    let allowedRedemptionItemIds: string[] = [];

    if (userRole === 'employee') {
      const delegatedInfo = await getUserDelegatedInfo(currentUserId);
      if (!delegatedInfo) {
        return { success: false, message: 'Employee delegation not found.' };
      }
      allowedRedemptionItemIds = [delegatedInfo.redemptionItemId];
    }

    const itemSnap = await getDocs(collection(db, 'redemption_items'));

    for (const item of itemSnap.docs) {
      const itemId = item.id;

      if (userRole === 'employee' && !allowedRedemptionItemIds.includes(itemId)) {
        continue;
      }

      const historyRef = collection(db, 'redemption_items', itemId, 'history');
      const historyQuery = query(historyRef, where('code', '==', code));
      const result = await getDocs(historyQuery);

      if (!result.empty) {
        const docRef = result.docs[0].ref;
        const record = result.docs[0].data() as RedemptionHistory;
        const itemData = item.data();

        if (record.status !== 'pending') {
          return { success: false, message: 'Code has already been redeemed.' };
        }

        const userRedeemedRef = doc(db, 'users', record.userId, 'redeemed_items', itemId);
        const userRedeemedSnap = await getDoc(userRedeemedRef);

        const batch = writeBatch(db);

        batch.update(docRef, {
          redeemedAt: Timestamp.now(),
          redeemedBy: currentUserName,
          status: 'fulfilled',
        });

        if (userRedeemedSnap.exists()) {
          batch.update(userRedeemedRef, {
            redeemedAt: Timestamp.now(),
            redeemedBy: currentUserName,
            status: 'fulfilled',
          });
        } else {
          batch.set(userRedeemedRef, {
            redeemedAt: Timestamp.now(),
            redeemedBy: currentUserName,
            status: 'fulfilled',
            code,
            claimedAt: record.claimedAt,
            title: itemData.title,
          });
        }

        await batch.commit();

        return { success: true, message: 'Code redeemed successfully.' };
      }
    }

    return { success: false, message: 'Code not found or not authorized for redemption.' };
  } catch (error) {
    console.error('[redeemCode] Error:', error);
    return { success: false, message: 'Something went wrong during redemption.' };
  }
}
