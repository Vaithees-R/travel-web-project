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
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

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

  // Safe proximity / hover handlers with 380ms debounce grace period
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 380); // 380ms grace period buffer to allow calm, relaxed pointer movement
  };

  // Determine current active mode
  const currentMode = TRAVEL_MODES.find((m) => location.pathname === m.path);
  const activeLabel = currentMode ? currentMode.label : location.pathname === '/' ? 'Home' : location.pathname === '/about' ? 'About' : location.pathname === '/bookings' ? 'Trips' : 'Voyage';

  // Expansion condition
  const isExpanded = isHovered || isFocused || isPinned || mobileMenuOpen || location.search.includes('expand_nav=1');

  return (
    <>
      {/* Top Floating Dynamic Island Container */}
      <header
        className={cn(
          'fixed top-2.5 sm:top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300',
          isScrolled && !isExpanded ? 'opacity-95' : 'opacity-100'
        )}
      >
        {/* Proximity / safe hover wrapper buffer */}
        <div
          className="pointer-events-auto py-1 -my-1 px-2 -mx-2 flex justify-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <nav
            ref={navRef}
            role="navigation"
            aria-label="Primary Travel Navigation"
            aria-expanded={isExpanded}
            onFocus={() => {
              if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
              setIsFocused(true);
            }}
            onBlur={(e) => {
              if (!navRef.current?.contains(e.relatedTarget as Node)) {
                setIsFocused(false);
              }
            }}
            className={cn(
              'select-none overflow-hidden rounded-full py-1.5',
              'bg-neutral-950/90 backdrop-blur-md text-white border shadow-xl',
              'flex items-center justify-between',
              'transition-[max-width,padding,background-color,border-color,box-shadow]',
              'ease-[cubic-bezier(0.35,0.25,0.25,1)]',
              isExpanded
                ? 'duration-[650ms] border-neutral-600 shadow-2xl shadow-neutral-950/60 bg-neutral-950/95 px-3.5 sm:px-4 max-w-[290px] md:max-w-[760px] w-full sm:w-max'
                : cn(
                    'duration-[600ms] border-neutral-700/70 hover:border-neutral-500 shadow-lg px-3 sm:px-3.5 cursor-pointer w-max',
                    location.pathname === '/'
                      ? 'max-w-[180px] md:max-w-[150px]'
                      : 'max-w-[260px] md:max-w-[225px]'
                  )
            )}
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(!mobileMenuOpen);
              }
            }}
          >
            {/* Brand & Compact Pill State */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/');
                }}
                className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg py-1 px-1.5 group transition-colors"
                title="Return to VoyageHub Home"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="font-semibold text-xs sm:text-sm tracking-tight text-white leading-none whitespace-nowrap">
                  Voyage<span className="text-emerald-400">Hub</span>
                </span>
              </button>

              {/* Collapsed Active Indicator Pill (visible when collapsed on non-home pages) */}
              <div
                className={cn(
                  'flex items-center gap-1.5 pl-2 border-l border-neutral-800 text-xs transition-all overflow-hidden',
                  !isExpanded && activeLabel && activeLabel !== 'Home'
                    ? 'max-w-[120px] opacity-100 duration-300 delay-[350ms]'
                    : 'max-w-0 opacity-0 pl-0 border-transparent duration-150 delay-0 pointer-events-none'
                )}
              >
                <span className="text-neutral-300 font-medium text-[11px] truncate">
                  {activeLabel}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>

              {/* Mobile collapsed active indicator dot on home page */}
              {!isExpanded && activeLabel === 'Home' && (
                <div className="flex md:hidden items-center pl-1 text-xs">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Desktop Navigation Items (Gradually unfolds with subtle stagger after island expansion begins) */}
            <div
              className={cn(
                'hidden md:flex items-center shrink-0 transition-[opacity,transform]',
                isExpanded
                  ? 'opacity-100 translate-x-0 duration-[400ms] delay-[160ms] ease-out pointer-events-auto'
                  : 'opacity-0 -translate-x-3 duration-[200ms] delay-0 ease-in pointer-events-none'
              )}
            >
              {/* Desktop Travel Modes */}
              <div className="flex items-center gap-1 px-2 border-l border-neutral-800/80 shrink-0">
                {TRAVEL_MODES.map((mode, idx) => {
                  const Icon = mode.icon;
                  const isActive = location.pathname === mode.path;
                  const staggerDelays = ['60ms', '90ms', '120ms', '150ms'];
                  return (
                    <NavLink
                      key={mode.id}
                      to={mode.path}
                      style={{
                        transitionDelay: isExpanded ? (staggerDelays[idx] || '60ms') : '0ms'
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-[300ms] ease-out whitespace-nowrap',
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

              {/* Desktop Actions & Account Controls */}
              <div className="flex items-center gap-1 pl-2 border-l border-neutral-800/80 shrink-0">
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/bookings"
                      style={{ transitionDelay: isExpanded ? '180ms' : '0ms' }}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-[300ms] text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                        location.pathname.startsWith('/bookings') && 'text-emerald-400 bg-neutral-800'
                      )}
                      title="My Trips & Itinerary"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>My Trips</span>
                    </NavLink>

                    <NavLink
                      to="/profile"
                      style={{ transitionDelay: isExpanded ? '210ms' : '0ms' }}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-[300ms] text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                        location.pathname === '/profile' && 'text-emerald-400 bg-neutral-800'
                      )}
                      title="Traveler Profile"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="max-w-[85px] truncate">{user?.fullName?.split(' ')[0] || 'Profile'}</span>
                    </NavLink>

                    <button
                      type="button"
                      style={{ transitionDelay: isExpanded ? '240ms' : '0ms' }}
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-all duration-[300ms] cursor-pointer"
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
                      style={{ transitionDelay: isExpanded ? '180ms' : '0ms' }}
                      className={cn(
                        'flex items-center px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-[300ms] text-neutral-300 hover:text-white hover:bg-neutral-800/80 whitespace-nowrap shrink-0',
                        location.pathname === '/about' && 'text-emerald-400 bg-neutral-800'
                      )}
                      title="About VoyageHub"
                    >
                      <span>About</span>
                    </NavLink>

                    <NavLink
                      to="/login"
                      style={{ transitionDelay: isExpanded ? '210ms' : '0ms' }}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all duration-[300ms] whitespace-nowrap shrink-0',
                        location.pathname === '/login' && 'text-emerald-400 bg-neutral-800'
                      )}
                      title="Account Login"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </NavLink>

                    <NavLink
                      to="/register"
                      style={{ transitionDelay: isExpanded ? '240ms' : '0ms' }}
                      className={cn(
                        'flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-[300ms] whitespace-nowrap shrink-0 border',
                        location.pathname === '/register'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-2xs font-semibold'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/30'
                      )}
                      title="Create Traveler Account"
                    >
                      <span>Sign Up</span>
                    </NavLink>
                  </>
                )}

                {/* Subtle Pin / Unpin button */}
                <button
                  type="button"
                  style={{ transitionDelay: isExpanded ? '270ms' : '0ms' }}
                  onClick={() => setIsPinned(!isPinned)}
                  className={cn(
                    'p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-[300ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ml-0.5 cursor-pointer',
                    isPinned && 'text-emerald-400 bg-neutral-800'
                  )}
                  title={isPinned ? 'Unpin navigation' : 'Pin navigation expanded'}
                  aria-label={isPinned ? 'Unpin navigation' : 'Pin navigation'}
                >
                  {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              className="md:hidden p-1 text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg transition-colors ml-1"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </nav>
        </div>
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
