import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { auth, db } from '@/lib/firebase-admin';

interface UserRecordData {
  email: string;
  displayName: string;
  emailVerified: boolean;
  role: 'admin' | 'employee';
  createdAt: FieldValue;
  delegatedSpot?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, delegatedSpot } = await req.json();

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password.trim() ||
      typeof role !== 'string' ||
      !['admin', 'employee'].includes(role)
    ) {
      return NextResponse.json({ message: 'Missing or invalid fields' }, { status: 400 });
    }

    // 1. Create Firebase Auth user with emailVerified: true
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: true,
    });

    // 2. Create Firestore user document
    const userData: UserRecordData = {
      email,
      displayName: name,
      emailVerified: true,
      role: role as 'admin' | 'employee',
      createdAt: FieldValue.serverTimestamp(),
    };

    if (role === 'employee') {
      if (typeof delegatedSpot !== 'string' || !delegatedSpot.trim()) {
        return NextResponse.json(
          { message: 'Delegated spot is required for employee role' },
          { status: 400 }
        );
      }
      userData.delegatedSpot = delegatedSpot;
    }

    await db.collection('users').doc(userRecord.uid).set(userData);

    return NextResponse.json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
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
    await auth.deleteUser(uid);

    // Delete user from Firestore
    await db.collection('users').doc(uid).delete();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}
