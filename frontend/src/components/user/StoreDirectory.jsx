import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllStores } from '../../services/store.service';
import { submitRating } from '../../services/rating.service';
import StoreCard from './StoreCard';
import { toast } from 'react-toastify';

const StoreDirectory = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    } else {
      setFilteredStores(stores);
    }
  }, [searchTerm, stores]);

  const fetchStores = async () => {
    try {
      const data = await getAllStores();
      setStores(data);
      setFilteredStores(data);
    } catch (error) {
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleRating = async (storeId, rating) => {
    try {
      await submitRating(storeId, parseInt(rating));
      toast.success('Rating submitted successfully');
      fetchStores();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen">
      {/* Main Header - Classic style */}
      <header className="bg-white border-b border-gray-300 py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
              <p className="text-sm text-gray-600">Find and rate local stores in your area</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section - Classic style */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-white p-6 border border-gray-300 rounded shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label className="block text-sm font-bold mb-1" htmlFor="store-search">
                Search by Name or Address
              </label>
              <input
                className="w-full border-gray-400 rounded-sm focus:ring-0 focus:border-blue-500 text-lg p-2"
                id="store-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Main Street Grocers..."
              />
            </div>
            <button
              type="submit"
              className="bg-[#4A90E2] hover:brightness-110 text-white px-8 py-2.5 font-bold uppercase tracking-wide border-b-4 border-[#357ABD] active:translate-y-0.5 transition-all w-full md:w-auto"
            >
              Search Stores
            </button>
          </form>
        </div>
      </section>

      {/* Store Listing - Classic style */}
      <main className="container mx-auto px-4 pb-20">
        {filteredStores.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
            <p className="text-gray-500 text-lg">No stores found matching your search.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredStores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onRatingSubmit={(rating) => handleRating(store.id, rating)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer - Classic style */}
      <footer className="bg-gray-200 border-t border-gray-300 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-xs">
          <p>© 2024 Store Directory Online. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <button className="hover:underline">Terms of Service</button>
            <button className="hover:underline">Privacy Policy</button>
            <button className="hover:underline">Contact Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreDirectory;