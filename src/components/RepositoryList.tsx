"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Repository } from '@/lib/github/types';
import RepositorySummary from './RepositorySummary';
import { AIProvider } from '@/lib/ai';

// Define Repository type locally instead of importing from the GitHub client
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

interface RepositoryListProps {
  results?: SearchResponse | null;
}

// Mock data for initial UI development
const mockRepositories: Repository[] = [
  {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 207000,
    language: 'JavaScript',
    updated_at: '2023-05-15T10:30:00Z',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    },
  },
  {
    id: 2,
    name: 'next.js',
    full_name: 'vercel/next.js',
    description: 'The React Framework for Production',
    html_url: 'https://github.com/vercel/next.js',
    stargazers_count: 105000,
    language: 'TypeScript',
    updated_at: '2023-05-18T14:20:00Z',
    owner: {
      login: 'vercel',
      avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4',
    },
  },
];

export default function RepositoryList({ results }: RepositoryListProps) {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [aiProvider, setAiProvider] = useState<AIProvider>('openai');
  
  // Force a remount of the RepositorySummary component when provider changes
  const [summaryKey, setSummaryKey] = useState(0);
  
  // Debug the current provider state
  useEffect(() => {
    console.log("Current provider in RepositoryList state:", aiProvider);
  }, [aiProvider]);
  
  // Use search results if available, otherwise use mock data
  const repositories = results?.items || mockRepositories;
  const totalCount = results?.total_count;
  
  // Direct switch functions with debugging
  const switchToOpenAI = () => {
    console.log("Switching to OpenAI");
    setAiProvider('openai');
    setSummaryKey(prev => prev + 1);
  };
  
  const switchToMistral = () => {
    console.log("Switching to Mistral");
    setAiProvider('mistral');
    setSummaryKey(prev => prev + 1);
  };
  
  if (repositories.length === 0) {
    return (
      <div className="text-center p-8 rounded-lg bg-white shadow-md dark:bg-slate-800">
        <p className="text-gray-500 dark:text-gray-400">
          No repositories found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {totalCount !== undefined ? `Results (${totalCount.toLocaleString()} repositories found)` : 'Results'}
        </h2>
        {selectedRepository && (
          <div className="flex items-center space-x-2">
            <span className="text-sm">AI Provider:</span>
            
            {/* Replace dropdown with direct buttons */}
            <div className="flex space-x-2">
              <button
                onClick={switchToOpenAI}
                className={`px-3 py-1 text-xs rounded ${
                  aiProvider === 'openai' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                OpenAI
              </button>
              
              <button
                onClick={switchToMistral}
                className={`px-3 py-1 text-xs rounded ${
                  aiProvider === 'mistral' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Mistral
              </button>
            </div>
            
            {/* Visual indicator of current provider */}
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              Active: {aiProvider}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {repositories.map((repo) => (
          <div 
            key={repo.id} 
            className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 relative">
                  <Image 
                    src={repo.owner.avatar_url} 
                    alt={`${repo.owner.login}'s avatar`} 
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {repo.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1 text-yellow-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-sm font-medium">
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>
                {repo.language && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated on {new Date(repo.updated_at).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30 dark:hover:bg-blue-900/40"
                >
                  View Repository
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
                <button
                  onClick={() => setSelectedRepository(selectedRepository?.id === repo.id ? null : repo)}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 dark:ring-gray-400/30 dark:hover:bg-gray-900/40"
                >
                  {selectedRepository?.id === repo.id ? 'Hide Summary' : 'AI Summary'}
                </button>
              </div>
            </div>
            
            {selectedRepository?.id === repo.id && (
              <div className="mt-4">
                <RepositorySummary repository={repo} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 