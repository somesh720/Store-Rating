import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

// User Components
import StoreDirectory from './components/user/StoreDirectory';

// Owner Components
import OwnerDashboard from './components/owner/OwnerDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={
              <PrivateRoute role="normal_user">
                <StoreDirectory />
              </PrivateRoute>
            } />
            
            {/* Store Owner Routes */}
            <Route path="/owner/dashboard" element={
              <PrivateRoute role="store_owner">
                <OwnerDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;