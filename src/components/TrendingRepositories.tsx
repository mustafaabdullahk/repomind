'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTrendingRepositories, TrendingMetric, TrendingPeriod } from '@/hooks/useTrendingRepositories';

export default function TrendingRepositories() {
  const { 
    repositories, 
    isLoading, 
    error, 
    fetchTrending, 
    options 
  } = useTrendingRepositories();
  
  const [selectedRepository, setSelectedRepository] = useState<number | null>(null);
  
  // Toggle repository selection
  const toggleRepository = (id: number) => {
    setSelectedRepository(selectedRepository === id ? null : id);
  };
  
  // Handle metric change
  const handleMetricChange = (metric: TrendingMetric) => {
    fetchTrending({ metric });
  };
  
  // Handle period change
  const handlePeriodChange = (period: TrendingPeriod) => {
    fetchTrending({ period });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate engagement score (just an example, can be customized)
  const calculateEngagementScore = (repo: any) => {
    const starsWeight = 1;
    const forksWeight = 2;
    const watchersWeight = 0.5;
    
    return (
      (repo.stargazers_count * starsWeight) + 
      (repo.forks_count * forksWeight) + 
      (repo.watchers_count * watchersWeight)
    ).toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="text-center p-8 rounded-lg bg-white shadow-md dark:bg-slate-800">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading trending repositories...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 rounded-lg bg-white shadow-md dark:bg-slate-800">
        <p className="text-red-500">
          Error: {error}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">Trending Repositories</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Metric Controls */}
          <div className="flex rounded-md bg-gray-100 dark:bg-slate-700">
            <button
              onClick={() => handleMetricChange('stars')}
              className={`px-3 py-1 text-sm rounded-l-md ${
                options.metric === 'stars' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              Stars
            </button>
            <button
              onClick={() => handleMetricChange('forks')}
              className={`px-3 py-1 text-sm ${
                options.metric === 'forks' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              Forks
            </button>
            <button
              onClick={() => handleMetricChange('updated')}
              className={`px-3 py-1 text-sm rounded-r-md ${
                options.metric === 'updated' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              Recent
            </button>
          </div>
          
          {/* Time Period Controls */}
          <div className="flex rounded-md bg-gray-100 dark:bg-slate-700">
            <button
              onClick={() => handlePeriodChange('day')}
              className={`px-3 py-1 text-sm rounded-l-md ${
                options.period === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-3 py-1 text-sm ${
                options.period === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-3 py-1 text-sm rounded-r-md ${
                options.period === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>
      
      {repositories.length === 0 ? (
        <div className="text-center p-8 rounded-lg bg-white shadow-md dark:bg-slate-800">
          <p className="text-gray-500 dark:text-gray-400">
            No trending repositories found for the selected criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repositories.map((repo) => (
            <div 
              key={repo.id} 
              className="rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-slate-800"
            >
              <div className="flex items-start">
                <div className="h-10 w-10 relative mr-3">
                  <Image 
                    src={repo.owner.avatar_url} 
                    alt={`${repo.owner.login}'s avatar`} 
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {repo.full_name}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                    {repo.description || 'No description available.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center bg-gray-50 p-2 rounded dark:bg-slate-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Stars</span>
                  <span className="text-yellow-500 dark:text-yellow-400">{repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 p-2 rounded dark:bg-slate-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Forks</span>
                  <span className="text-green-500 dark:text-green-400">{repo.forks_count.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 p-2 rounded dark:bg-slate-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Engagement</span>
                  <span className="text-blue-500 dark:text-blue-400">{calculateEngagementScore(repo)}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  {repo.language && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                      {repo.language}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {formatDate(repo.updated_at)}
                  </span>
                </div>
                
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30 dark:hover:bg-blue-900/40"
                >
                  View 
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-1"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 