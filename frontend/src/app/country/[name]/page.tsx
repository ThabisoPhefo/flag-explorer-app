'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCountryByName } from '@/lib/api';
import { CountryDetails } from '@/types/country';

export default function CountryDetail() {
  const params = useParams();
  const router = useRouter();
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryName = decodeURIComponent(params.name as string);

  useEffect(() => {
    async function fetchCountry() {
      try {
        setLoading(true);
        setError(null);
        const countryData = await getCountryByName(countryName);
        setCountry(countryData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load country details';
        setError(errorMessage);
        console.error('Error fetching country:', err);
      } finally {
        setLoading(false);
      }
    }

    if (countryName) {
      fetchCountry();
    }
  }, [countryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Country Not Found</h1>
          <p className="text-gray-600 mb-6">{error || `"${countryName}" could not be found.`}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return 'N/A';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{country.name}</h1>
            {country.code && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {country.code}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Flag Section */}
            <div className="md:w-1/2">
              <div className="aspect-[3/2] relative bg-gray-100">
                <Image
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🌍 Country Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Country Name</dt>
                  <dd className="mt-1 text-xl font-semibold text-gray-900">{country.name}</dd>
                </div>

                {country.capital && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Capital</dt>
                    <dd className="mt-1 text-lg text-gray-900 flex items-center gap-2">
                      🏛️ {country.capital}
                    </dd>
                  </div>
                )}

                {country.region && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Region</dt>
                    <dd className="mt-1 text-lg text-gray-900 flex items-center gap-2">
                      🗺️ {country.region}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Population</dt>
                  <dd className="mt-1 text-lg text-gray-900 flex items-center gap-2">
                    👥 {formatNumber(country.population)}
                  </dd>
                </div>

                {country.area && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Area</dt>
                    <dd className="mt-1 text-lg text-gray-900 flex items-center gap-2">
                      📐 {formatNumber(country.area)} km²
                    </dd>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  🔍 Explore More Countries
                </Link>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 