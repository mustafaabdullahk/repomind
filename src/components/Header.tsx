'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPublicPath } from '@/lib/utils/path';

export default function Header() {
  const pathname = usePathname();

  // Determine if a link is active based on the current path
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };
  
  // For debugging paths in deployment
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Current path:', pathname);
      console.log('Base path:', process.env.NEXT_PUBLIC_BASE_PATH);
      console.log('Home link:', getPublicPath('/'));
      console.log('Settings link:', getPublicPath('/settings'));
    }
  }, [pathname]);

  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={getPublicPath('/')} className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="font-bold text-xl">RepoMind</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href={getPublicPath('/')} 
            className={`text-sm font-medium ${
              isActive('/') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Search
          </Link>
          <Link 
            href={getPublicPath('/trending')} 
            className={`text-sm font-medium ${
              isActive('/trending') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Trending
          </Link>
          <Link 
            href={getPublicPath('/about')} 
            className={`text-sm font-medium ${
              isActive('/about') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            About
          </Link>
          <Link 
            href={getPublicPath('/settings')} 
            className={`text-sm font-medium ${
              isActive('/settings') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button 
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 