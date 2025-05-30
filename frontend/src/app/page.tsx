'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllFlags } from '@/lib/api';

interface FlagData {
  name: string;
  flag: string;
  code: string;
}

export default function Home() {
  const [flags, setFlags] = useState<FlagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchFlags() {
      try {
        const flagData = await getAllFlags();
        setFlags(flagData);
      } catch (err) {
        setError('Failed to load flags');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFlags();
  }, []);

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Flag Explorer</h1>
          <p className="mt-2 text-gray-600">Discover countries and their flags from around the world</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredFlags.map((flag) => (
            <Link
              key={flag.code}
              href={`/country/${encodeURIComponent(flag.name)}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-[3/2] relative overflow-hidden rounded-t-lg">
                <Image
                  src={flag.flag}
                  alt={`Flag of ${flag.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {flag.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{flag.code}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredFlags.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500">No countries found matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
