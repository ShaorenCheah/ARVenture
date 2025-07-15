import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password.trim() ||
      typeof role !== 'string' ||
      !['user', 'merchant', 'admin'].includes(role)
    ) {
      return NextResponse.json({ message: 'Missing or invalid fields' }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      displayName: name,
      emailVerified: false,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error: unknown) {
    console.error('Create user error:', error);
    let message = 'Failed to create user';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'auth/email-already-exists') message = 'This email is already registered.';
      else if (code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (code === 'auth/invalid-password')
        message = 'Password must be at least 6 characters.';
    }

    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ message: 'Missing UID' }, { status: 400 });
    }

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Delete user from Firestore
    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}
