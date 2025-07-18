// To create user record in firebase after authentication

import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { auth, db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string.' },
        { status: 400 }
      );
    }

    // Get user UID by email
    const userRecord = await auth.getUserByEmail(email);
    const uid = userRecord.uid;

    // Write to Firestore
    const userRef = db.doc(`users/${uid}`);
    await userRef.set(
      {
        email: userRecord.email,
        displayName: userRecord.displayName || '',
        emailVerified: userRecord.emailVerified,
        role: 'user',
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[API Error - Create User Record]', err);

    let status = 500;
    let message = 'Internal server error';

    if (err instanceof Error) {
      message = err.message;

      // Optional: narrow further if using Firebase AuthError types
      if ('code' in err && typeof err.code === 'string') {
        if (err.code === 'auth/user-not-found') {
          status = 404;
          message = 'User not found for the given email.';
        }
      }
    }

    return NextResponse.json({ error: message }, { status });
  }
}
