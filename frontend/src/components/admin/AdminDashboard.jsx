import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getAllUsers } from '../../services/admin.service';
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getAllUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
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

  const handleAddUser = () => {
    setShowAddModal(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navigation Bar - Exactly as HTML */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand Section */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                AdminPanel
              </span>
            </div>
            {/* Navigation Links */}
            <div className="flex space-x-8 items-center">
              <a 
                href="#" 
                className="text-blue-600 font-semibold border-b-2 border-blue-600 px-1 pt-1 h-full flex items-center"
              >
                Users
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-700 px-1 pt-1 h-full flex items-center"
              >
                Stores
              </a>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 px-1 pt-1 h-full flex items-center font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Statistics Summary Cards - Exactly as HTML */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium opacity-90">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
          </div>
          {/* Total Stores Card */}
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium opacity-90">Total Stores</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalStores}</p>
          </div>
          {/* Total Ratings Card */}
          <div className="bg-orange-500 text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium opacity-90">Total Ratings</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalRatings.toLocaleString()}</p>
          </div>
        </section>

        {/* User Management Table Section - Exactly as HTML */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header & Action Area */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded shadow text-sm font-bold uppercase tracking-tight transition-colors"
            >
              + Add New User
            </button>
          </div>

          {/* User List Table */}
          <UserTable users={users} onUserUpdated={fetchData} />

          {/* Pagination / Footer Info */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              Showing 1 to {users.length} of {stats.totalUsers} users.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm border-t border-gray-200">
        <p>© 2023 Corporate Admin Dashboard. All rights reserved.</p>
      </footer>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddUser}
      />
    </div>
  );
};

export default AdminDashboard;