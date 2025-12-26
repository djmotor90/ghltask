'use client';

import { useEffect, useState } from 'react';
import client from '@/lib/api-client';

export default function Page() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get OAuth authorization URL from backend
    const getAuthUrl = async () => {
      try {
        const response = await client.get<{ url: string }>('/auth/authorize');
        setAuthUrl(response.data.url);
      } catch (err) {
        setError('Failed to get authorization URL');
        console.error(err);
      }
    };

    getAuthUrl();

    // Check for error from callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setError(`Authentication error: ${params.get('error')}`);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">GHL Task Management</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {authUrl ? (
          <a
            href={authUrl}
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-center transition"
          >
            Login with GoHighLevel
          </a>
        ) : (
          <button
            disabled
            className="block w-full bg-gray-400 text-white font-bold py-3 px-4 rounded text-center cursor-not-allowed"
          >
            Loading...
          </button>
        )}
      </div>
    </div>
  );
}
