'use client';

import React, { useState, Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import RepositoryList from '@/components/RepositoryList';
import HeaderWrapper from '@/components/HeaderWrapper';

// Simple loading fallback
function SearchResultsFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearchResults = (results: any) => {
    setSearchResults(results);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <HeaderWrapper />
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold mb-6">GitHub Repository Search</h1>
        <Suspense fallback={<SearchResultsFallback />}>
          <SearchBar onSearchResults={handleSearchResults} />
          
          <div className="mt-8">
            <RepositoryList results={searchResults} />
          </div>
        </Suspense>
      </div>
    </main>
  );
} 