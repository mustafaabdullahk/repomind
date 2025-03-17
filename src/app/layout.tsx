import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RepoMind - GitHub Repository Explorer',
  description: 'Discover and explore GitHub repositories with intelligent insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}>
        {children}
      </body>
    </html>
  );
} 