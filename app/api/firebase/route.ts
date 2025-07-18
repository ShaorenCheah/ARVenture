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

    // Add logging here to debug
    console.log('User record:', {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime
    });

    if (!userRecord.emailVerified) {
      console.log('Email verification check failed for:', email);
      return NextResponse.json({ error: 'Email has not been verified yet.' }, { status: 403 });
    }

    const uid = userRecord.uid;
    const userRef = db.doc(`users/${uid}`);
    const existingDoc = await userRef.get();

    console.log('Existing document check:', {
      exists: existingDoc.exists,
      uid: uid
    });

    if (!existingDoc.exists) {
      console.log('Creating new user document for:', email);
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
      console.log('User document created successfully');
    } else {
      console.log('User document already exists, skipping creation');
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