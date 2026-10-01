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
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

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
  const { user, isAuthenticated, logout } = useAuth();
  
  // Interactive state
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Intelligent scroll listener: optimize visual weight and avoid obscuring content
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Escape collapses navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPinned) {
        setIsFocused(false);
        setIsHovered(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinned]);

  // Determine current active mode
  const currentMode = TRAVEL_MODES.find((m) => location.pathname === m.path);
  const activeLabel = currentMode ? currentMode.label : location.pathname === '/' ? 'Home' : location.pathname === '/about' ? 'About' : location.pathname === '/bookings' ? 'Trips' : 'Voyage';

  // Expansion condition
  const isExpanded = isHovered || isFocused || isPinned || mobileMenuOpen;

  return (
    <>
      {/* Top Floating Dynamic Island Container */}
      <header
        className={cn(
          'fixed top-2.5 sm:top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300',
          isScrolled && !isExpanded ? 'opacity-95' : 'opacity-100'
        )}
      >
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
            'bg-neutral-950/90 backdrop-blur-md text-white border border-neutral-700/60 shadow-xl',
            'flex items-center',
            isExpanded
              ? 'rounded-2xl px-3 py-1.5 w-full max-w-2xl lg:max-w-3xl justify-between'
              : 'rounded-full px-3.5 py-1.5 w-auto gap-3 cursor-pointer hover:bg-neutral-900 hover:border-neutral-500'
          )}
        >
          {/* Brand & Compact Pill State */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg py-1 px-1.5 group transition-colors"
              title="Return to VoyageHub Home"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="font-semibold text-xs sm:text-sm tracking-tight text-white leading-none">
                Voyage<span className="text-emerald-400">Hub</span>
              </span>
            </button>

            {/* Inactive state badge indicator */}
            {!isExpanded && (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs">
                <span className="text-neutral-300 font-medium text-[11px] sm:text-xs">
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
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
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
            <div className="hidden md:flex items-center gap-1 border-l border-neutral-800 pl-2">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/bookings"
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                      location.pathname.startsWith('/bookings') && 'text-emerald-400 bg-neutral-800'
                    )}
                    title="My Trips & Itinerary"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>My Trips</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                      location.pathname === '/profile' && 'text-emerald-400 bg-neutral-800'
                    )}
                    title="Traveler Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="max-w-[85px] truncate">{user?.fullName.split(' ')[0] || 'Profile'}</span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/about"
                    className={cn(
                      'flex items-center px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                      location.pathname === '/about' && 'text-emerald-400 bg-neutral-800'
                    )}
                    title="About VoyageHub"
                  >
                    <span>About</span>
                  </NavLink>

                  <NavLink
                    to="/login"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors whitespace-nowrap shrink-0',
                      location.pathname === '/login' && 'text-emerald-400 bg-neutral-800'
                    )}
                    title="Account Login"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </NavLink>

                  <NavLink
                    to="/register"
                    className={cn(
                      'flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border',
                      location.pathname === '/register'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-2xs'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/30'
                    )}
                    title="Create Traveler Account"
                  >
                    <span>Sign Up</span>
                  </NavLink>
                </>
              )}

              {/* Pin / Unpin button */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={cn(
                  'p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ml-0.5',
                  isPinned && 'text-emerald-400 bg-neutral-800'
                )}
                title={isPinned ? 'Unpin navigation' : 'Pin navigation expanded'}
                aria-label={isPinned ? 'Unpin navigation' : 'Pin navigation'}
              >
                {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            /* Idle trigger helper hint */
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 select-none">
              <span className="hidden sm:inline">Explore</span>
              <kbd className="hidden sm:inline-block px-1 py-0.5 text-[9px] bg-neutral-800/80 rounded border border-neutral-700 font-mono text-neutral-400">
                hover
              </kbd>
            </div>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            className="md:hidden p-1 text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer when Island is opened on smaller screens */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-40 bg-neutral-950/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-16 left-4 right-4 bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
              Travel Experiences
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
                      'flex items-center gap-2 p-3 min-h-[44px] rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                      isActive ? 'bg-white text-neutral-900 font-semibold' : 'bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between px-1 text-xs">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/bookings"
                    className="text-neutral-300 hover:text-white flex items-center gap-1.5 font-medium min-h-[44px] px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>My Trips</span>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="text-neutral-300 hover:text-white flex items-center gap-1.5 font-medium min-h-[44px] px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 min-h-[44px] px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/about"
                    className="text-neutral-300 hover:text-white font-medium whitespace-nowrap min-h-[44px] flex items-center px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    About
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-neutral-200 hover:text-white font-medium whitespace-nowrap min-h-[44px] flex items-center px-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-3.5 py-2 min-h-[38px] flex items-center justify-center rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-white font-medium whitespace-nowrap text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

