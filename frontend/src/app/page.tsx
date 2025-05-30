'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCountries, checkApiHealth } from '@/lib/api';
import { Country } from '@/types/country';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        setLoading(true);
        setError(null);

        // Check API health first
        try {
          await checkApiHealth();
          setApiHealthy(true);
        } catch {
          setApiHealthy(false);
          throw new Error('Backend API is not available. Please make sure the server is running.');
        }

        // Fetch countries
        const countryData = await getAllCountries();
        setCountries(countryData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load countries';
        setError(errorMessage);
        console.error('Error initializing app:', err);
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading countries...</p>
          <p className="mt-2 text-sm text-gray-500">Connecting to backend API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          {!apiHealthy && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Backend Server Status</h3>
              <p className="text-sm text-yellow-700">
                Make sure your backend server is running on port 8001:
              </p>
              <code className="block mt-2 text-xs bg-yellow-100 p-2 rounded">
                cd backend && source venv/bin/activate && uvicorn app.main:app --host 127.0.0.1 --port 8001
              </code>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                🌍 Flag Explorer
              </h1>
              <p className="mt-2 text-gray-600">Discover countries and their flags from around the world</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiHealthy ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-500">
                {apiHealthy ? 'API Connected' : 'API Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Found {filteredCountries.length} countries
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredCountries.map((country) => (
            <Link
              key={country.name}
              href={`/country/${encodeURIComponent(country.name)}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="aspect-[3/2] relative overflow-hidden rounded-t-lg bg-gray-100">
                <Image
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={country.name}>
                  {country.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCountries.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
            <p className="text-gray-500">No countries match &ldquo;{searchTerm}&rdquo;. Try a different search term.</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Powered by our own <strong>Country API</strong> backend 🚀
          </p>
          <p className="mt-1">
            Data from{' '}
            <a
              href="https://restcountries.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              REST Countries API
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
