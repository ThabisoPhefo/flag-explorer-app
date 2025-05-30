'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCountryByName } from '@/lib/api';
import { Country } from '@/types/country';

export default function CountryDetail() {
  const params = useParams();
  const router = useRouter();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryName = decodeURIComponent(params.name as string);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const countryData = await getCountryByName(countryName);
        setCountry(countryData);
      } catch (err) {
        setError('Failed to load country details');
        console.error(err);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Country not found'}</div>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{country.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {country.flag && (
                <div className="aspect-[3/2] relative">
                  <Image
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Country Information</h2>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country Name</dt>
                  <dd className="mt-1 text-lg text-gray-900">{country.name}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Country Code</dt>
                  <dd className="mt-1 text-lg text-gray-900">{country.code}</dd>
                </div>

                {country.capital && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Capital</dt>
                    <dd className="mt-1 text-lg text-gray-900">{country.capital}</dd>
                  </div>
                )}

                {country.region && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Region</dt>
                    <dd className="mt-1 text-lg text-gray-900">{country.region}</dd>
                  </div>
                )}

                {country.population && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Population</dt>
                    <dd className="mt-1 text-lg text-gray-900">{formatNumber(country.population)}</dd>
                  </div>
                )}

                {country.area && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Area</dt>
                    <dd className="mt-1 text-lg text-gray-900">{formatNumber(country.area)} km²</dd>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Explore More Countries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 