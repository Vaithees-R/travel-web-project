import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicIslandNav } from '../components/navigation/DynamicIslandNav';
import { Footer } from '../components/layout/Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Skip to main content link for keyboard & screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-neutral-900 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Floating Dynamic Island Navigation */}
      <DynamicIslandNav />

      {/* Main Content Area with ample clearance for dynamic island */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col pt-14 sm:pt-16 focus:outline-none">
        <Outlet />
      </main>

      {/* Honest, project-oriented Global Travel Footer */}
      <Footer />
    </div>
  );
};

