import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyPlantsPage } from './pages/MyPlantsPage';
import { AddPlantPage } from './pages/AddPlantPage';
import { PlantDetailsPage } from './pages/PlantDetailsPage';
import { GrowthTimelinePage } from './pages/GrowthTimelinePage';
import { CareTrackerPage } from './pages/CareTrackerPage';
import { ProgressReportPage } from './pages/ProgressReportPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityFeedPage } from './pages/CommunityFeedPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner text="Verifying admin credentials..." />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Main Layout Component
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLandingOrAuth =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="app-container">
      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="app-layout">
        {isAuthenticated && sidebarOpen && !isLandingOrAuth && (
          <Sidebar
            isOpen={sidebarOpen}
            closeMobileSidebar={() => {
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          />
        )}

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/community" element={<CommunityFeedPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plants"
              element={
                <ProtectedRoute>
                  <MyPlantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plants/add"
              element={
                <ProtectedRoute>
                  <AddPlantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plants/:id"
              element={
                <ProtectedRoute>
                  <PlantDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/growth-timeline"
              element={
                <ProtectedRoute>
                  <GrowthTimelinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/care-tracker"
              element={
                <ProtectedRoute>
                  <CareTrackerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-report"
              element={
                <ProtectedRoute>
                  <ProgressReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <AchievementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <ChallengesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <MainLayout />
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
