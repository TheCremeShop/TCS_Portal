
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import UserDashboard from '@/pages/UserDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <>
      <Helmet>
        <title>DataGrid Pro - Excel-Style Data Management</title>
        <meta name="description" content="Professional Excel-style data grid with advanced lookup capabilities and multi-database integration" />
      </Helmet>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </>
  );
}

export default App;
