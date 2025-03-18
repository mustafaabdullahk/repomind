import React from 'react';
import StaticHeader from '@/components/StaticHeader';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4">
      <StaticHeader />
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
} 