'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import HeaderWrapper from '@/components/HeaderWrapper';

function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6">About RepoMind</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-md dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <p className="mb-4">
          RepoMind is an intelligent GitHub explorer that combines powerful search capabilities with AI-driven
          repository analysis. The application helps developers discover and understand GitHub repositories more
          efficiently.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Advanced GitHub repository search with filtering options</li>
          <li>AI-powered repository content summarization</li>
          <li>Support for multiple AI providers: OpenAI, Mistral, Gemini, Claude, and DeepSeek</li>
          <li>Trending repositories with engagement metrics</li>
          <li>Customizable settings for AI providers</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Technologies Used</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Next.js for the frontend framework</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>GitHub API for repository data</li>
          <li>Multiple AI provider integrations</li>
        </ul>
        
        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AboutLoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto mt-12 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
      <div className="bg-white rounded-lg p-6 shadow-md dark:bg-slate-800">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeaderWrapper />
      <Suspense fallback={<AboutLoadingFallback />}>
        <AboutContent />
      </Suspense>
    </main>
  );
} 