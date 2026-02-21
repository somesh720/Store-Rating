import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUser, FaStore } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'store_owner':
        return '/owner/dashboard';
      case 'normal_user':
        return '/user/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center">
              <FaStore className="text-2xl text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-800">Store Ratings</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <FaUser className="mr-1" />
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;