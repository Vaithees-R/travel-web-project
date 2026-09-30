import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Train, Bus, Car, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const serviceCards = [
    {
      title: 'Flights',
      description: 'Domestic & International scheduled airlines across India and global hubs.',
      path: '/flights',
      icon: Plane,
      badge: 'Domestic & Global',
      color: 'text-sky-600 bg-sky-50',
    },
    {
      title: 'Trains',
      description: 'IRCTC quota integration, Vande Bharat, Rajdhani, Shatabdi, and express trains.',
      path: '/trains',
      icon: Train,
      badge: 'IRCTC India',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Buses',
      description: 'Intercity AC sleepers, luxury volvo coaches, and state transport across Indian routes.',
      path: '/buses',
      icon: Bus,
      badge: 'All India',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Cabs',
      description: 'Hourly city rentals, outstation one-way/roundtrips, and guaranteed airport transfers.',
      path: '/cabs',
      icon: Car,
      badge: 'Point-to-Point',
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-neutral-900 text-white p-8 sm:p-12 border border-neutral-800 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="accent" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            Phase 1 • Modern 2026 Platform Foundation
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Seamless travel across India and beyond.
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            One unified booking ecosystem for flights, trains, intercity buses, and outstation cabs. 
            Engineered with modern performance, accessibility, and clean design.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/flights">
              <Button variant="secondary" size="md" className="gap-2 font-medium">
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="md" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                Platform Architecture
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative geometric background */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Services Grid (Phase 1 Routing Verification) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">Travel Verticals</h2>
            <p className="text-xs text-neutral-500">Select any vertical to verify route initialization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} to={service.path} className="group block focus-visible:outline-none">
                <Card hoverEffect className="p-5 h-full flex flex-col justify-between group-focus-visible:ring-2 group-focus-visible:ring-neutral-900">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="neutral">{service.badge}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-neutral-900 group-hover:text-emerald-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center text-xs font-medium text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                    <span>Enter portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 text-neutral-400 group-hover:text-neutral-900" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Phase 1 Verification Notice */}
      <section className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-900">Phase 1 Foundation Active</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Vite, React 19, TypeScript, Tailwind CSS, and client-side routing are verified. 
              The Dynamic Island navigation above is functional with hover expansion, keyboard focus, and pinning. 
              Full search forms and booking workflows will be constructed in subsequent phases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
