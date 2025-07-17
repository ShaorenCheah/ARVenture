import { Suspense } from 'react';

import FirebaseRedirectClient from './FirebaseRedirectClient';

export default function FirebasePage() {
  return (
    <Suspense fallback={null}>
      <FirebaseRedirectClient />
    </Suspense>
  );
}
