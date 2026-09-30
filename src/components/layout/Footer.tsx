import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Headphones, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20 border-t border-neutral-800">
      {/* Trust Badges Bar */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">IRCTC & Airline Authorized</h4>
              <p className="text-xs text-neutral-400">100% verified tickets & secured transactions</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Journey Support</h4>
              <p className="text-xs text-neutral-400">On-trip helpline across India & international legs</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Transparent Pricing</h4>
              <p className="text-xs text-neutral-400">Zero hidden convenience fees on all bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">
              Voyage<span className="text-emerald-400">Hub</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
            A unified multi-modal travel platform for India and international destinations. 
            Book domestic flights, IRCTC train berths, intercity coaches, and outstation cabs with ease.
          </p>
          <div className="pt-2 text-xs text-neutral-500">
            © {new Date().getFullYear()} VoyageHub Technologies. All rights reserved.
          </div>
        </div>

        {/* Services column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/flights" className="hover:text-white transition-colors">Flights Booking</Link></li>
            <li><Link to="/trains" className="hover:text-white transition-colors">IRCTC Trains</Link></li>
            <li><Link to="/buses" className="hover:text-white transition-colors">Intercity Buses</Link></li>
            <li><Link to="/cabs" className="hover:text-white transition-colors">Outstation Cabs</Link></li>
            <li><Link to="/bookings" className="hover:text-white transition-colors">My Trips & PNR</Link></li>
          </ul>
        </div>

        {/* Popular Hubs column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Popular Hubs</h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>New Delhi (DEL / NDLS)</li>
            <li>Mumbai (BOM / CSMT)</li>
            <li>Bengaluru (BLR / SBC)</li>
            <li>Chennai (MAA / MAS)</li>
            <li>Hyderabad (HYD / SC)</li>
          </ul>
        </div>

        {/* Company & Support column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Customer Care</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
