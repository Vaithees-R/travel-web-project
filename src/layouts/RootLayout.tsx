import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicIslandNav } from '../components/navigation/DynamicIslandNav';
import { Footer } from '../components/layout/Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 antialiased font-sans">
      {/* Floating Dynamic Island Navigation */}
      <DynamicIslandNav />

      {/* Main Content Area with adequate top clearance */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Outlet />
      </main>

      {/* Global Travel Footer */}
      <Footer />
    </div>
  );
};
