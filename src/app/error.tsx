'use client';

import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <Layout>
      <div className="container-custom py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We're sorry, but we're having trouble loading this page.
          </p>
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    </Layout>
  );
}