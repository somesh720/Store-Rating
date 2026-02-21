import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOwnerDashboard } from '../../services/store.service';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getOwnerDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRatingBadgeClass = (rating) => {
    if (rating >= 4.5) return 'rating-badge-green';
    if (rating >= 3.5) return 'rating-badge-yellow';
    return 'rating-badge-red';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight text-indigo-600">StoreDash</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Hero Metric */}
        <section className="mb-12 text-center md:text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Total Satisfaction
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-7xl md:text-8xl font-black text-gray-900 leading-none">
              Average Rating: {dashboard?.averageRating || '0.0'}
            </span>
            <div className="flex items-center text-yellow-400">
              <svg className="w-12 h-12 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Your Stores */}
        {dashboard?.stores && dashboard.stores.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Stores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.stores.map(store => (
                <div key={store.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold">{store.name}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Table Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Recent Reviews</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Rating (1-5)</th>
                  <th className="px-6 py-4">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard?.ratings && dashboard.ratings.length > 0 ? (
                  dashboard.ratings.map((rating) => (
                    <tr key={rating.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {rating.user_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getRatingBadgeClass(rating.rating)}`}>
                          {rating.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 italic">
                        "{rating.comment || 'No comment provided'}"
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No reviews yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {dashboard?.ratings && dashboard.ratings.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>Showing {dashboard.ratings.length} of {dashboard.ratings.length} reviews</span>
              <div className="space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;