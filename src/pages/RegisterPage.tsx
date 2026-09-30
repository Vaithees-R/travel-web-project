import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { SCENIC_IMAGES, BUS_IMAGES, CAB_IMAGES } from '../assets/travelImages';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  // Destination after registration
  const fromLocation = (location.state as { from?: { pathname: string; search?: string } })?.from;
  const returnUrl = fromLocation ? `${fromLocation.pathname}${fromLocation.search || ''}` : '/profile';

  const registerShowcase = [
    SCENIC_IMAGES[1],
    BUS_IMAGES[2],
    CAB_IMAGES[1],
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please provide a valid mobile number';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate(returnUrl, { replace: true });
    } else {
      setGeneralError(result.error || 'Failed to create traveler account.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* LEFT: Travel Image Visual Panel */}
        <div className="lg:col-span-6 relative bg-neutral-950 flex flex-col justify-between overflow-hidden p-8 sm:p-12 text-white">
          {/* Subtle Carousel in Background */}
          <div className="absolute inset-0 z-0">
            <TravelImageCarousel
              images={registerShowcase}
              intervalMs={7000}
              aspectRatio="auto"
              className="w-full h-full"
              showOverlay={true}
              overlayGradient="from-neutral-950 via-neutral-950/70 to-neutral-950/40"
              showCaption={false}
              showIndicators={false}
            />
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Voyage<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
          </div>

          {/* Bottom Editorial Narrative */}
          <div className="relative z-10 space-y-4 max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Join the Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              A single passenger profile for every mode of transit.
            </h2>
            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Synchronized bookings across air, rail, highway coaches, and cabs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unified cancellation and simulated instant refunds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Persistent traveler identity across all browser sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Focused Registration Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Create Traveler Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Begin your journey
              </h1>
              <p className="text-xs text-neutral-500">
                Register to manage multi-modal itineraries and personal e-tickets
              </p>
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full h-10 px-3.5 text-xs sm:text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-300'
                  }`}
                  required
                />
                {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="rahul.sharma@example.com"
                  className={`w-full h-10 px-3.5 text-xs sm:text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-300'
                  }`}
                  required
                />
                {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Mobile Number (for simulated PNR alerts)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full h-10 px-3.5 text-xs sm:text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-300'
                  }`}
                  required
                />
                {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-700 block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      placeholder="Min 6 chars"
                      className={`w-full h-10 pl-3.5 pr-8 text-xs sm:text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all ${
                        errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-300'
                      }`}
                      required
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {errors.password && <p className="text-[11px] text-rose-600">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 block">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Repeat password"
                    className={`w-full h-10 px-3.5 text-xs sm:text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all ${
                      errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-300'
                    }`}
                    required
                  />
                  {errors.confirmPassword && <p className="text-[11px] text-rose-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Traveler Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Full-Stack Notice */}
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-neutral-600 leading-normal">
                <strong>Full-Stack Registration:</strong> Accounts are persisted to PostgreSQL with salted bcrypt password hashing and tokenized JWT sessions.
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100 text-center text-xs text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" state={{ from: fromLocation }} className="font-semibold text-emerald-700 hover:underline">
                Sign in to account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
