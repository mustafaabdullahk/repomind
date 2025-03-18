import React, { useState } from 'react';
import { useGitHubSearch } from '@/hooks/useGitHubSearch';
import { event } from '@/lib/utils/analytics';

interface SearchBarProps {
  onSearchResults?: (results: any) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    language: '',
    stars: '',
    sort: 'stars' as 'stars' | 'updated',
    order: 'desc' as 'asc' | 'desc',
  });
  
  const { searchRepositories, isLoading, error } = useGitHubSearch();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      // Track search event
      event({
        action: 'search',
        category: 'repository',
        label: searchQuery,
        value: filters.language ? 1 : 0, // Track if filters were used
      });
      
      const results = await searchRepositories(searchQuery, {
        language: filters.language || undefined,
        stars: filters.stars ? parseInt(filters.stars) : undefined,
        sort: filters.sort,
        order: filters.order,
      });
      
      if (results && onSearchResults) {
        // Track search results count
        event({
          action: 'search_results',
          category: 'repository',
          label: searchQuery,
          value: results.items?.length || 0,
        });
        
        onSearchResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
      
      // Track search error
      event({
        action: 'search_error',
        category: 'error',
        label: String(err),
      });
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                value={filters.language}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="stars" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Stars
              </label>
              <select
                id="stars"
                name="stars"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                value={filters.stars}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="10">10+</option>
                <option value="100">100+</option>
                <option value="1000">1,000+</option>
                <option value="10000">10,000+</option>
                <option value="50000">50,000+</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="stars">Stars</option>
                <option value="updated">Last Updated</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order
              </label>
              <select
                id="order"
                name="order"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                value={filters.order}
                onChange={handleFilterChange}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 