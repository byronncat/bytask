'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/constants/serverConfig';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTE.TIMER_SESSION);
  }, [router]);

  return null;
}
