'use client';

import React from 'react';
import Header from '@/components/Header';
import TrendingRepositories from '@/components/TrendingRepositories';

export default function TrendingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold mb-6">Trending Repositories</h1>
        <div className="mt-6">
          <TrendingRepositories />
        </div>
      </div>
    </main>
  );
} 