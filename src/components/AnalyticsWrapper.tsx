'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/lib/utils/analytics';

export default function AnalyticsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Create URL from path and search params
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Send pageview event to Google Analytics
      pageview(url);
      
      // Log page view for debugging (remove in production)
      console.log(`Analytics: Page view sent for ${url}`);
    }
  }, [pathname, searchParams]);

  return children;
} 