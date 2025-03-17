import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RepoMind - GitHub Repository Explorer',
  description: 'Discover and explore GitHub repositories with intelligent insights',
};

// Helper to get the correct public path with base path
const getPublicAssetPath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src={getPublicAssetPath('/gh-pages-spa-router.js')} type="text/javascript" />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}>
        {children}
      </body>
    </html>
  );
} 