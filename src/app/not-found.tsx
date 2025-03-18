'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import HeaderWrapper from '@/components/HeaderWrapper';
import { getPublicPath } from '@/lib/utils/path';

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link
        href={getPublicPath('/')}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

function NotFoundFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-pulse">
      <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="container mx-auto px-4">
      <HeaderWrapper />
      <Suspense fallback={<NotFoundFallback />}>
        <NotFoundContent />
      </Suspense>
    </main>
  );
} 