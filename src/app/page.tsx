'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import RepositoryList from '@/components/RepositoryList';
import Header from '@/components/Header';

export default function Home() {
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearchResults = (results: any) => {
    setSearchResults(results);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold mb-6">GitHub Repository Search</h1>
        <SearchBar onSearchResults={handleSearchResults} />
        
        <div className="mt-8">
          <RepositoryList results={searchResults} />
        </div>
      </div>
    </main>
  );
} 