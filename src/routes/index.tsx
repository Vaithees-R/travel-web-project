import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { FlightsPage } from '../pages/FlightsPage';
import { TrainsPage } from '../pages/TrainsPage';
import { BusesPage } from '../pages/BusesPage';
import { CabsPage } from '../pages/CabsPage';
import { BookingsPage } from '../pages/BookingsPage';
import { BookingDetailPage } from '../pages/BookingDetailPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { PassengerDetailsPage } from '../pages/PassengerDetailsPage';
import { BookingReviewPage } from '../pages/BookingReviewPage';
import { BookingConfirmationPage } from '../pages/BookingConfirmationPage';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Service Landing Pages */}
        <Route index element={<HomePage />} />
        <Route path="flights" element={<FlightsPage />} />
        <Route path="trains" element={<TrainsPage />} />
        <Route path="buses" element={<BusesPage />} />
        <Route path="cabs" element={<CabsPage />} />

        {/* Phase 3: Functional Search & Booking Flow */}
        <Route path=":service/results" element={<SearchResultsPage />} />
        <Route path=":service/passengers" element={<PassengerDetailsPage />} />
        <Route path=":service/review" element={<BookingReviewPage />} />
        <Route path=":service/confirmation/:bookingId" element={<BookingConfirmationPage />} />

        {/* Protected Travel Account & Itinerary Center */}
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Informational & Auth Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
