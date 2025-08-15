'use client';

import { useState, useEffect } from 'react';
import { DaycareResponse, DaycareFeature } from '@/lib/types/daycare';
import DaycareCard from '@/components/DaycareCard';
import AddressSearch from '@/components/AddressSearch';

export default function Home() {
  const [daycares, setDaycares] = useState<DaycareFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState<{ x: number; y: number } | null>(null);
  const [searchDistance, setSearchDistance] = useState('5000');
  const [filters, setFilters] = useState({
    subsidyOnly: false,
    cwelccOnly: false,
    ageGroup: 'all'
  });

  useEffect(() => {
    if (searchLocation) {
      fetchDaycaresByLocation(searchLocation);
    } else {
      fetchDaycares();
    }
  }, [searchLocation, searchDistance]);

  const fetchDaycares = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daycares?limit=50');
      const data: DaycareResponse = await response.json();
      setDaycares(data.features || []);
    } catch (error) {
      console.error('Error fetching daycares:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaycaresByLocation = async (location: { x: number; y: number }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/daycares-by-location?x=${location.x}&y=${location.y}&distance=${searchDistance}`
      );
      const data = await response.json();
      setDaycares(data.features || []);
    } catch (error) {
      console.error('Error fetching daycares by location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (coordinates: { x: number; y: number }) => {
    setSearchLocation(coordinates);
  };

  const clearLocationSearch = () => {
    setSearchLocation(null);
  };

  const filteredDaycares = daycares.filter(daycare => {
    const { properties } = daycare;
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!properties.NAME.toLowerCase().includes(search) && 
          !properties.ADDRESS.toLowerCase().includes(search)) {
        return false;
      }
    }

    // Subsidy filter
    if (filters.subsidyOnly && properties.TYPE !== 1) {
      return false;
    }

    // CWELCC filter
    if (filters.cwelccOnly && properties.CWELCC_FLAG !== 'Y') {
      return false;
    }

    // Age group filter
    if (filters.ageGroup !== 'all') {
      switch (filters.ageGroup) {
        case 'infant':
          if (properties.IGSPACE === 0) return false;
          break;
        case 'toddler':
          if (properties.TGSPACE === 0) return false;
          break;
        case 'preschool':
          if (properties.PGSPACE === 0) return false;
          break;
        case 'kindergarten':
          if (properties.KGSPACE === 0) return false;
          break;
        case 'school':
          if (properties.SGSPACE === 0) return false;
          break;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Toronto Daycare Finder
            </h1>
            <p className="mt-2 text-gray-600">
              Find the perfect licensed child care center for your family
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-8">
          <div className="space-y-4">
            {/* Location Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search by Location</label>
              <AddressSearch onLocationSelect={handleLocationSelect} />
              {searchLocation && (
                <div className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-md">
                  <span className="text-sm text-orange-800">Searching within {parseInt(searchDistance) / 1000}km of selected location</span>
                  <button
                    onClick={clearLocationSearch}
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    Clear location
                  </button>
                </div>
              )}
            </div>

            {/* Distance Selector */}
            {searchLocation && (
              <div className="flex items-center gap-2">
                <label htmlFor="distance" className="text-sm text-gray-700">Search radius:</label>
                <select
                  id="distance"
                  value={searchDistance}
                  onChange={(e) => setSearchDistance(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="1000">1 km</option>
                  <option value="2000">2 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">10 km</option>
                </select>
              </div>
            )}

            {/* Name Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by daycare name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subsidy"
                  checked={filters.subsidyOnly}
                  onChange={(e) => setFilters({...filters, subsidyOnly: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="subsidy" className="ml-2 text-sm text-gray-700">
                  Subsidy Available
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cwelcc"
                  checked={filters.cwelccOnly}
                  onChange={(e) => setFilters({...filters, cwelccOnly: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="cwelcc" className="ml-2 text-sm text-gray-700">
                  CWELCC Program
                </label>
              </div>

              <select
                value={filters.ageGroup}
                onChange={(e) => setFilters({...filters, ageGroup: e.target.value})}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Age Groups</option>
                <option value="infant">Infant</option>
                <option value="toddler">Toddler</option>
                <option value="preschool">Preschool</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="school">School Age</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredDaycares.length} of {daycares.length} daycares
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDaycares.map((daycare) => (
              <DaycareCard key={daycare.id} daycare={daycare} />
            ))}
          </div>
        )}

        {!loading && filteredDaycares.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No daycares found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}