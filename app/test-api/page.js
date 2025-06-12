'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestApiPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApiEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a mock user object for testing
      const mockUser = {
        id: 'test-id',
        primaryEmailAddress: {
          emailAddress: 'test@example.com'
        },
        fullName: 'Test User',
        imageUrl: 'https://via.placeholder.com/150'
      };

      // Call the verify-user API
      const response = await axios.post('/api/verify-user', {
        user: mockUser
      });

      setResult(response.data);
    } catch (err) {
      console.error('API test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button
        onClick={testApiEndpoint}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
      >
        {loading ? 'Testing...' : 'Test API Endpoint'}
      </button>
      
      {error && (
        <div className="bg-red-50 p-4 border border-red-200 rounded mb-4">
          <h2 className="text-red-700 font-bold mb-2">Error</h2>
          <p className="mb-2">{error.message}</p>
          {error.status && <p className="mb-2">Status: {error.status}</p>}
          {error.data && (
            <pre className="bg-red-100 p-2 rounded overflow-x-auto text-sm">
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 p-4 border border-green-200 rounded">
          <h2 className="text-green-700 font-bold mb-2">API Response</h2>
          <pre className="bg-green-100 p-2 rounded overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 