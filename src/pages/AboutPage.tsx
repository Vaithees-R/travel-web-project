import React, { useState } from 'react';
import { Compass, ShieldCheck, Zap, HelpCircle, ChevronDown } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { FREQUENTLY_ASKED_QUESTIONS } from '../data/faqs';
import { cn } from '../utils/cn';

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="space-y-10">
      <PageHeader
        badge="About VoyageHub"
        title="Engineering Modern Indian & Global Travel"
        description="Rebuilding the legacy 2025 platform into a high-performance, accessible, multi-modal travel ecosystem."
      />

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-neutral-900">Multi-Modal Integration</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Eliminates switching between disjointed apps for flights, trains, intercity buses, and cabs. All four modalities are supported with tailored domain parameters.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-neutral-900">2026 Modern Performance</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Built on Vite, React 19, TypeScript, and modern CSS architecture. Instant route rendering and keyboard-first accessibility without bloated legacy scripts.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-neutral-900">Authorized & Verified</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Standardized IATA airport mappings, Indian Railways station classifications, and verified road fleet operators ensuring complete passenger confidence.
          </p>
        </Card>
      </div>

      {/* Preserved & Polished FAQs Section */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-neutral-800" />
          <h2 className="text-lg font-semibold text-neutral-900">Frequently Asked Questions</h2>
        </div>
        <p className="text-xs text-neutral-500">
          Refactored from the original FAQ component with clear answers and support commitments.
        </p>

        <div className="space-y-3 max-w-3xl">
          {FREQUENTLY_ASKED_QUESTIONS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-neutral-200 rounded-xl bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-neutral-400 transition-transform duration-200',
                      isOpen && 'rotate-180 text-neutral-800'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 border-t border-neutral-100 pt-3 leading-relaxed bg-neutral-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
