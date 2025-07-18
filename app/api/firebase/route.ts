// app/api/firebase/route.ts

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

    // Get user record by email
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord.emailVerified) {
      return NextResponse.json({ error: 'Email has not been verified yet.' }, { status: 403 });
    }

    const uid = userRecord.uid;
    const userRef = db.doc(`users/${uid}`);
    const existingDoc = await userRef.get();

    if (!existingDoc.exists) {
      await userRef.set(
        {
          email: userRecord.email,
          displayName: userRecord.displayName || '',
          emailVerified: true,
          role: 'user',
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[API Error - Create User Record]', err);

    let status = 500;
    let message = 'Internal server error';

    if (err instanceof Error) {
      message = err.message;

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
