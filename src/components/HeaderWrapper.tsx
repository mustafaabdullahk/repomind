'use client';

import React, { Suspense } from 'react';
import Header from './Header';

// Simple loading state for the header
function HeaderFallback() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function HeaderWrapper() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <Header />
    </Suspense>
  );
} 