import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Layers, Route, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-24 border-t border-neutral-800">
      {/* Product & Design Philosophy Bar (Honest, non-commercial language) */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0 border border-neutral-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Unified Multi-Modal</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Flights, railways, intercity coaches, and outstation cabs in one cohesive experience</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0 border border-neutral-800">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Service Storytelling</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Domain-specific route timelines, airport codes, and railway schematics</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0 border border-neutral-800">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Independent Prototype</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Experimental design system built with React 19, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand narrative */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">
              Voyage<span className="text-emerald-400">Hub</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
            An open travel interface concept designed to make transit across India seamless, intuitive, and visually distinct for every transportation mode.
          </p>
          <div className="pt-2 text-[11px] text-neutral-500 font-mono">
            VoyageHub Design Concept • Demonstration Prototype
          </div>
        </div>

        {/* Travel Verticals */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Travel Experiences</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/flights" className="hover:text-emerald-400 transition-colors">Flights & Corridors</Link></li>
            <li><Link to="/trains" className="hover:text-emerald-400 transition-colors">IRCTC Railway Timelines</Link></li>
            <li><Link to="/buses" className="hover:text-emerald-400 transition-colors">Intercity Bus Routes</Link></li>
            <li><Link to="/cabs" className="hover:text-emerald-400 transition-colors">Outstation & Airport Cabs</Link></li>
            <li><Link to="/bookings" className="hover:text-emerald-400 transition-colors">Travel Itinerary</Link></li>
          </ul>
        </div>

        {/* Major Transit Hubs */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Transit Hubs</h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>New Delhi (DEL • NDLS)</li>
            <li>Mumbai (BOM • CSMT)</li>
            <li>Bengaluru (BLR • SBC)</li>
            <li>Chennai (MAA • MAS)</li>
            <li>Hyderabad (HYD • SC)</li>
          </ul>
        </div>

        {/* Design System & Editorial */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Editorial Story</Link></li>
            <li><Link to="/about#principles" className="hover:text-emerald-400 transition-colors">Design Principles</Link></li>
            <li><Link to="/about#faqs" className="hover:text-emerald-400 transition-colors">Travel FAQs</Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Traveler Account</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
