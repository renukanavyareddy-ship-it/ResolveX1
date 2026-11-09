import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Citizen Pages
import UserDashboard from './pages/UserDashboard';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotificationsPage from './pages/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#ffffff',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '500',
                padding: '12px 18px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                }
              }
            }}
          />

          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/track" element={<TrackComplaintPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Authenticated Citizen / User Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/submit-complaint" element={<SubmitComplaintPage />} />
              <Route path="/my-complaints" element={<MyComplaintsPage />} />
              <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Authenticated Administrator Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute adminOnly={true}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
