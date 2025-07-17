'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FirebaseRedirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!mode || !oobCode) {
      router.replace('/not-found');
      return;
    }

    if (mode === 'verifyEmail') {
      router.replace(`/firebase/verify-email?mode=${mode}&oobCode=${oobCode}`);
    } else if (mode === 'resetPassword') {
      router.replace(`/firebase/reset-password?mode=${mode}&oobCode=${oobCode}`);
    } else {
      router.replace('/not-found');
    }
  }, [searchParams, router]);

  return null;
}
