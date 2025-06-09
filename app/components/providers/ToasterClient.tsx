'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToasterClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) return null;

  return <Toaster position="top-center" />;
}
