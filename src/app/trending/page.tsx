'use client';

import React, { Suspense } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import TrendingRepositories from '@/components/TrendingRepositories';

function TrendingContent() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6">Trending Repositories</h1>
      <div className="mt-6">
        <TrendingRepositories />
      </div>
    </div>
  );
}

function TrendingLoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto mt-12 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeaderWrapper />
      <Suspense fallback={<TrendingLoadingFallback />}>
        <TrendingContent />
      </Suspense>
    </main>
  );
} 