import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getPublicPath } from '@/lib/utils/path';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
        <p className="text-xl mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href={getPublicPath('/')}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go back to home
        </Link>
      </div>
    </main>
  );
} 