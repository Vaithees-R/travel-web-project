import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { FlightsPage } from '../pages/FlightsPage';
import { TrainsPage } from '../pages/TrainsPage';
import { BusesPage } from '../pages/BusesPage';
import { CabsPage } from '../pages/CabsPage';
import { BookingsPage } from '../pages/BookingsPage';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="flights" element={<FlightsPage />} />
        <Route path="trains" element={<TrainsPage />} />
        <Route path="buses" element={<BusesPage />} />
        <Route path="cabs" element={<CabsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
