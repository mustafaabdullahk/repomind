'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/lib/utils/analytics';
import { isStaticExport } from '@/lib/static-export';

export default function AnalyticsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // During static export, don't call client hooks
  const isStatic = isStaticExport();
  const pathname = usePathname();
  const searchParams = isStatic ? null : useSearchParams();

  useEffect(() => {
    // Skip analytics during static build
    if (isStatic) return;
    
    if (pathname) {
      // Create URL from path and search params
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Send pageview event to Google Analytics
      pageview(url);
      
      // Log page view for debugging (remove in production)
      console.log(`Analytics: Page view sent for ${url}`);
    }
  }, [pathname, searchParams, isStatic]);

  return children;
} 