import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicIslandNav } from '../components/navigation/DynamicIslandNav';
import { Footer } from '../components/layout/Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Floating Dynamic Island Navigation */}
      <DynamicIslandNav />

      {/* Main Content Area with ample clearance for dynamic island */}
      <main className="flex-1 w-full flex flex-col pt-14 sm:pt-16">
        <Outlet />
      </main>

      {/* Honest, project-oriented Global Travel Footer */}
      <Footer />
    </div>
  );
};
