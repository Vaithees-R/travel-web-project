import React, { useState } from 'react';
import { Compass, ChevronDown } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { FLIGHT_IMAGES, TRAIN_IMAGES, BUS_IMAGES, SCENIC_IMAGES } from '../assets/travelImages';
import { FREQUENTLY_ASKED_QUESTIONS } from '../data/faqs';
import { cn } from '../utils/cn';

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const editorialShowcase = [
    SCENIC_IMAGES[0],
    TRAIN_IMAGES[3],
    FLIGHT_IMAGES[3],
    BUS_IMAGES[1],
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Large Editorial Statement Hero */}
      <section className="bg-neutral-950 text-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>VoyageHub Editorial & Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            “Travel across India is magnificent, diverse, and deeply fragmented. We are designing the unified interface to bring every journey together.”
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[10px]">Concept Design</span>
              <span className="text-neutral-200 font-semibold">Multi-Modal Travel Architecture</span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[10px]">Scope</span>
              <span className="text-neutral-200 font-semibold">Aviation • Rail • Highway • Chauffeur</span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-mono text-[10px]">Interface Standard</span>
              <span className="text-neutral-200 font-semibold">Desktop-First • Accessible Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Photography Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
          <TravelImageCarousel
            images={editorialShowcase}
            intervalMs={7000}
            aspectRatio="21/9"
            showCaption={true}
            showIndicators={true}
          />
        </div>
      </div>

      {/* 3. The Story Narrative (Editorial Essay Layout) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The Journey Problem</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Why India needs a unified travel experience
          </h2>
          <div className="prose prose-neutral text-sm sm:text-base text-neutral-600 leading-relaxed space-y-4">
            <p>
              In contemporary travel, a passenger traveling from New Delhi to a tea estate in Munnar navigates four completely disconnected systems. They book a domestic flight to Kochi on an airline portal, an express train to Aluva on an IRCTC interface, an intercity bus toward Munnar on a state transport service, and an outstation taxi up the ghat roads through a local operator.
            </p>
            <p>
              Each system has its own distinct booking formats, payment gateways, cancellation deadlines, and disparate PNR numbers. If a flight is delayed by two hours, the train berth is missed, the bus departs, and the cab sits idling with accumulating detention charges.
            </p>
            <p>
              VoyageHub was conceived to bridge this gap. Not by flattening the rich individuality of Indian transport into generic dashboard cards, but by creating an orchestrated platform where each travel service preserves its domain vocabulary while converging into a synchronized, intelligent itinerary.
            </p>
          </div>
        </div>

        {/* 4. Platform Principles (Numbered Editorial Layout, Not 4 Generic Cards) */}
        <div className="space-y-8 pt-8 border-t border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Our Foundation</span>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mt-1">
              Core Design & Architectural Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-neutral-300">01</span>
              <h3 className="text-base font-bold text-neutral-900">Domain-Specific Visual Integrity</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We reject the idea that every transport mode is just a card. Flights need aerial corridor timelines with IATA codes; trains need railway schematics with platform progress; buses require boarding lounge maps; cabs require origin-destination route pricing.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-neutral-300">02</span>
              <h3 className="text-base font-bold text-neutral-900">Truth & Transparent Information</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We believe travel products should never deploy deceptive dark patterns. All-inclusive pricing displays taxes, airport user development fees, railway reservation charges, and highway tolls upfront with zero hidden checkout fees.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-neutral-300">03</span>
              <h3 className="text-base font-bold text-neutral-900">Unified Itinerary Synchronization</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A single digital itinerary where flight delays automatically notify connected chauffeur pickups, and connecting railway schedules display realistic buffer times between airport and railway stations.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xl font-bold text-neutral-300">04</span>
              <h3 className="text-base font-bold text-neutral-900">Accessible & Restrained Engineering</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Engineered with modern React 19, TypeScript, and responsive CSS. Animations are subtle, functional, and respect user motion preferences without CPU-draining bloat or distracting parallax tricks.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Service Breakdown Editorial */}
        <div className="bg-neutral-100/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-neutral-900">
            Four Modalities, One Unified Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600">
            <div>
              <strong className="text-neutral-900 font-semibold block mb-1">✈ Scheduled Aviation</strong>
              Domestic trunk routes and international gateways with official IATA airport identifiers and baggage guidelines.
            </div>
            <div>
              <strong className="text-neutral-900 font-semibold block mb-1">🚆 Indian Railways (IRCTC)</strong>
              Vande Bharat semi-high-speed corridors, Rajdhani overnight express, and 10-digit PNR berth synchronization.
            </div>
            <div>
              <strong className="text-neutral-900 font-semibold block mb-1">🚌 Intercity Highway Coaches</strong>
              Luxury Volvo multi-axle sleepers, guaranteed boarding lounges, and live highway GPS tracking.
            </div>
            <div>
              <strong className="text-neutral-900 font-semibold block mb-1">🚕 Outstation & Chauffeur Cabs</strong>
              Point-to-point guaranteed pickups with transparent rates including toll and fuel surcharges.
            </div>
          </div>
        </div>

        {/* 6. Frequently Asked Questions near the end */}
        <div id="faqs" className="space-y-6 pt-8 border-t border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Questions & Answers</span>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Clear information about the platform prototype, ticketing models, and future milestones.
            </p>
          </div>

          <div className="space-y-3">
            {FREQUENTLY_ASKED_QUESTIONS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-2',
                        isOpen && 'rotate-180 text-neutral-900'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-600 border-t border-neutral-100 pt-3 leading-relaxed bg-neutral-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
