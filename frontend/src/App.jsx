import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { EventsPage } from './pages/EventsPage';
import { OpportunityMatchingPage } from './pages/OpportunityMatchingPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CareerGpsPage } from './pages/CareerGpsPage';
import { OpportunityEqualizerPage } from './pages/OpportunityEqualizerPage';
import { CareerReadinessPage } from './pages/CareerReadinessPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { CareerAssistantPage } from './pages/CareerAssistantPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/explore" element={<OpportunitiesPage />} />
          <Route path="/events-explore" element={<EventsPage />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="resume" element={<ResumeAnalyzerPage />} />
              <Route path="jobs" element={<OpportunitiesPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="matching" element={<OpportunityMatchingPage />} />
              <Route path="skill-gap" element={<SkillGapPage />} />
              <Route path="career-gps" element={<CareerGpsPage />} />
              <Route path="equalizer" element={<OpportunityEqualizerPage />} />
              <Route path="readiness" element={<CareerReadinessPage />} />
              <Route path="scholarships" element={<ScholarshipsPage />} />
              <Route path="assistant" element={<CareerAssistantPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="saved" element={<SavedOpportunitiesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
