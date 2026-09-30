import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Ticket, 
  User, 
  Compass, 
  Pin, 
  PinOff,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface TravelMode {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRAVEL_MODES: TravelMode[] = [
  { id: 'flights', label: 'Flights', path: '/flights', icon: Plane },
  { id: 'trains', label: 'Trains', path: '/trains', icon: Train },
  { id: 'buses', label: 'Buses', path: '/buses', icon: Bus },
  { id: 'cabs', label: 'Cabs', path: '/cabs', icon: Car },
];

export const DynamicIslandNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Experiment state: supports hover, focus-within, click-to-expand, and user pinning
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Determine current active mode
  const currentMode = TRAVEL_MODES.find((m) => location.pathname === m.path);
  const activeLabel = currentMode ? currentMode.label : location.pathname === '/' ? 'Home' : 'Travel';

  // Expansion condition: expanded if hovered, keyboard focused, pinned, or mobile menu is active
  const isExpanded = isHovered || isFocused || isPinned || mobileMenuOpen;

  return (
    <>
      {/* Top Floating Dynamic Island Container */}
      <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          ref={navRef}
          role="navigation"
          aria-label="Primary Travel Navigation"
          aria-expanded={isExpanded}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!navRef.current?.contains(e.relatedTarget as Node)) {
              setIsFocused(false);
            }
          }}
          className={cn(
            'pointer-events-auto transition-all duration-300 ease-out',
            'bg-neutral-900/95 backdrop-blur-md text-white border border-neutral-700/60 shadow-lg',
            'flex items-center',
            isExpanded
              ? 'rounded-2xl px-3 py-2 w-full max-w-2xl justify-between'
              : 'rounded-full px-4 py-2 w-auto gap-3 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600'
          )}
        >
          {/* Brand & Compact Pill State */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
              title="Return to Home"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">
                Voyage<span className="text-emerald-400">Hub</span>
              </span>
            </button>

            {/* Inactive state badge indicator */}
            {!isExpanded && (
              <div className="flex items-center gap-2 pl-1 border-l border-neutral-700">
                <span className="text-xs text-neutral-300 font-medium">
                  {activeLabel}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Expanded State: Service Navigation & Utilities */}
          {isExpanded && (
            <div className="hidden md:flex items-center gap-1 animate-in fade-in duration-200">
              {TRAVEL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = location.pathname === mode.path;
                return (
                  <NavLink
                    key={mode.id}
                    to={mode.path}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                      isActive
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Actions & Controls */}
          {isExpanded ? (
            <div className="hidden md:flex items-center gap-1.5 border-l border-neutral-700 pl-2">
              <NavLink
                to="/bookings"
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-neutral-300 hover:text-white hover:bg-neutral-800',
                  location.pathname === '/bookings' && 'text-emerald-400 bg-neutral-800'
                )}
                title="My Bookings"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Trips</span>
              </NavLink>

              <NavLink
                to="/login"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Account Login"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </NavLink>

              {/* Experiment helper: Pin / Unpin button */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={cn(
                  'p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400',
                  isPinned && 'text-emerald-400 bg-neutral-800'
                )}
                title={isPinned ? 'Unpin navigation (enable hover auto-collapse)' : 'Pin navigation (keep expanded)'}
                aria-label={isPinned ? 'Unpin navigation' : 'Pin navigation'}
              >
                {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            /* Idle trigger helper hint */
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 select-none">
              <span className="hidden sm:inline">Services</span>
              <kbd className="hidden sm:inline-block px-1 py-0.5 text-[9px] bg-neutral-800 rounded border border-neutral-700 font-mono text-neutral-400">
                hover
              </kbd>
            </div>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            className="md:hidden p-1 text-neutral-300 hover:text-white focus-visible:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer when Island is opened on smaller screens */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-xs md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-20 left-4 right-4 bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-4 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2">
              Travel Services
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TRAVEL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = location.pathname === mode.path;
                return (
                  <NavLink
                    key={mode.id}
                    to={mode.path}
                    className={cn(
                      'flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between px-2">
              <NavLink to="/bookings" className="text-sm text-neutral-300 hover:text-white flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                <span>My Bookings</span>
              </NavLink>
              <NavLink to="/login" className="text-sm text-emerald-400 font-medium">
                Sign In
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
