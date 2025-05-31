'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCountries, checkApiHealth } from '@/lib/api';
import { Country } from '@/types/country';

type FilterType = 'a-z' | 'z-a' | 'population-asc' | 'population-desc' | 'region';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('a-z');
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

  // Filter and sort countries based on search term and filter type
  const getFilteredAndSortedCountries = () => {
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (filterType) {
      case 'a-z':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'population-asc':
        return filtered.sort((a, b) => a.population - b.population);
      case 'population-desc':
        return filtered.sort((a, b) => b.population - a.population);
      case 'region':
        return filtered.sort((a, b) => {
          const regionA = a.region || 'Unknown';
          const regionB = b.region || 'Unknown';
          if (regionA === regionB) {
            return a.name.localeCompare(b.name);
          }
          return regionA.localeCompare(regionB);
        });
      default:
        return filtered;
    }
  };

  // Group countries by region for region filter
  const getCountriesByRegion = () => {
    const filteredCountries = getFilteredAndSortedCountries();
    const grouped = filteredCountries.reduce((acc, country) => {
      const region = country.region || 'Unknown';
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(country);
      return acc;
    }, {} as Record<string, Country[]>);

    // Sort regions alphabetically and sort countries within each region
    const sortedRegions = Object.keys(grouped).sort();
    const result: Record<string, Country[]> = {};
    sortedRegions.forEach(region => {
      result[region] = grouped[region].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return result;
  };

  const filteredCountries = getFilteredAndSortedCountries();
  const countriesByRegion = filterType === 'region' ? getCountriesByRegion() : {};

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
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative max-w-md flex-1">
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
            
            <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white min-w-[180px]"
              >
                <option value="a-z">🔤 A-Z (Name)</option>
                <option value="z-a">🔤 Z-A (Name)</option>
                <option value="population-desc">👥 Population (High-Low)</option>
                <option value="population-asc">👥 Population (Low-High)</option>
                <option value="region">🌍 Group by Region</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Found {filterType === 'region' ? Object.values(countriesByRegion).flat().length : filteredCountries.length} countries 
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            {filterType === 'region' && (
              <p className="text-sm text-blue-600 font-medium">
                📍 {Object.keys(countriesByRegion).length} regions
              </p>
            )}
          </div>
        </div>

        {/* Countries Display */}
        {filterType === 'region' ? (
          // Region-grouped display
          <div className="space-y-8">
            {Object.entries(countriesByRegion).map(([region, regionCountries]) => (
              <div key={region}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{region}</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {regionCountries.length} countries
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {regionCountries.map((country) => (
                    <CountryCard key={country.name} country={country} showPopulation={filterType.includes('population')} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Regular grid display
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredCountries.map((country) => (
              <CountryCard key={country.name} country={country} showPopulation={filterType.includes('population')} />
            ))}
          </div>
        )}

        {/* No Results */}
        {(filterType === 'region' ? Object.values(countriesByRegion).flat().length === 0 : filteredCountries.length === 0) && searchTerm && (
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

// Country Card Component
function CountryCard({ country, showPopulation }: { country: Country; showPopulation: boolean }) {
  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  return (
    <Link
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
        {showPopulation && (
          <p className="text-xs text-gray-500 mt-1">
            👥 {formatPopulation(country.population)}
          </p>
        )}
        {country.region && (
          <p className="text-xs text-blue-600 mt-1 truncate">
            📍 {country.region}
          </p>
        )}
      </div>
    </Link>
  );
}
