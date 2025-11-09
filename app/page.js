'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to /order (the main ordering page)
    router.replace('/order');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <p className="text-gray-600">Redirecting to menu...</p>
      </div>
    </div>
  );
}
