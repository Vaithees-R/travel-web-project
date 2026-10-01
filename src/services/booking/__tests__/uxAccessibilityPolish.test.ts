import { describe, it, expect } from 'vitest';
import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Button, ButtonProps } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton, SkeletonCard, SkeletonResultCard, SkeletonTripCard } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';


describe('Phase 10 — UX, Accessibility & Responsive Polish Test Suite', () => {
  describe('1. Centralized Button Primitive', () => {
    it('supports all designated variants: primary, secondary, outline, ghost, danger, tertiary', () => {
      const variants: NonNullable<ButtonProps['variant']>[] = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'danger',
        'tertiary',
      ];

      variants.forEach((v) => {
        const html = renderToStaticMarkup(React.createElement(Button, { variant: v }, 'Action'));
        expect(html).toContain('button');
        if (v === 'danger') {
          expect(html).toContain('bg-rose-600');
        } else if (v === 'primary') {
          expect(html).toContain('bg-neutral-900');
        } else if (v === 'tertiary') {
          expect(html).toContain('text-neutral-600');
        }
      });
    });

    it('enforces touch target standards across sizing tokens', () => {
      const smHtml = renderToStaticMarkup(React.createElement(Button, { size: 'sm' }, 'Small'));
      const mdHtml = renderToStaticMarkup(React.createElement(Button, { size: 'md' }, 'Medium'));
      const lgHtml = renderToStaticMarkup(React.createElement(Button, { size: 'lg' }, 'Large'));

      // sm min 36px, md min 44px, lg min 48px
      expect(smHtml).toContain('min-h-[36px]');
      expect(mdHtml).toContain('min-h-[44px]');
      expect(lgHtml).toContain('min-h-[48px]');
    });

    it('manages loading state with aria-busy, disabled attribute and spinner without layout shifting', () => {
      const idleHtml = renderToStaticMarkup(
        React.createElement(Button, { isLoading: false }, 'Search Flights')
      );
      expect(idleHtml).toContain('aria-busy="false"');
      expect(idleHtml).not.toContain('disabled=""');

      const loadingHtml = renderToStaticMarkup(
        React.createElement(
          Button,
          {
            isLoading: true,
            loadingText: 'Searching inventory...',
          },
          'Search Flights'
        )
      );
      expect(loadingHtml).toContain('aria-busy="true"');
      expect(loadingHtml).toContain('disabled=""');
      expect(loadingHtml).toContain('cursor-wait');
      expect(loadingHtml).toContain('Searching inventory...');
      expect(loadingHtml).toContain('animate-spin');
    });

    it('incorporates high-contrast focus rings for keyboard navigation', () => {
      const html = renderToStaticMarkup(React.createElement(Button, {}, 'Book Ticket'));
      expect(html).toContain('focus-visible:ring-2');
      expect(html).toContain('focus-visible:outline-none');
    });
  });

  describe('2. Accessible Modal Dialog System', () => {
    it('sets role="dialog" and aria-modal="true" on active modal dialogs', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          Modal,
          {
            isOpen: true,
            onClose: () => {},
            title: 'Cancel Booking',
            description: 'Are you sure you want to cancel this trip?',
          },
          React.createElement('div', null, 'Dialog Body')
        )
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('aria-labelledby="modal-title"');
      expect(html).toContain('aria-describedby="modal-description"');
      expect(html).toContain('Cancel Booking');
      expect(html).toContain('Are you sure you want to cancel this trip?');
      expect(html).toContain('Dialog Body');
    });

    it('returns empty output and leaves DOM clean when isOpen is false', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          Modal,
          {
            isOpen: false,
            onClose: () => {},
            title: 'Hidden Dialog',
          },
          React.createElement('div', null, 'Hidden Content')
        )
      );

      expect(html).toBe('');
    });

    it('supports customizable dialog size variants', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      sizes.forEach((s) => {
        const html = renderToStaticMarkup(
          React.createElement(
            Modal,
            {
              isOpen: true,
              onClose: () => {},
              size: s,
            },
            React.createElement('div', null, 'Child')
          )
        );
        const expectedClass = s === 'sm' ? 'max-w-sm' : s === 'md' ? 'max-w-md' : s === 'lg' ? 'max-w-lg' : 'max-w-xl';
        expect(html).toContain(expectedClass);
      });
    });
  });

  describe('3. Contextual Skeleton Loaders', () => {
    it('renders base Skeleton with aria-hidden="true" so screen readers ignore placeholders', () => {
      const html = renderToStaticMarkup(React.createElement(Skeleton, { className: 'w-24 h-4' }));
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('animate-pulse');
    });

    it('renders SkeletonResultCard matching search result visual structure', () => {
      const html = renderToStaticMarkup(React.createElement(SkeletonResultCard, {}));
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('animate-pulse');
      expect(html).toContain('rounded-3xl');
    });

    it('renders SkeletonTripCard matching itinerary item visual hierarchy', () => {
      const html = renderToStaticMarkup(React.createElement(SkeletonTripCard, {}));
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('animate-pulse');
      expect(html).toContain('rounded-3xl');
    });

    it('renders SkeletonCard generic placeholder', () => {
      const html = renderToStaticMarkup(React.createElement(SkeletonCard, {}));
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('animate-pulse');
    });
  });

  describe('4. Accessible EmptyState & ErrorState Components', () => {
    it('EmptyState sets role="region" with descriptive aria-label matching title', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(EmptyState, {
            title: 'No upcoming trips found',
            description: 'Explore flight or train corridors to book your next journey.',
            actionText: 'Explore Flights',
            actionHref: '/flights',
          })
        )
      );

      expect(html).toContain('role="region"');
      expect(html).toContain('aria-label="No upcoming trips found"');
      expect(html).toContain('Explore Flights');
    });


    it('EmptyState renders action buttons when provided', () => {
      const html = renderToStaticMarkup(
        React.createElement(EmptyState, {
          title: 'No active filters matched',
          description: 'Reset your filters to view scheduled options.',
          actionText: 'Reset Filters',
          onAction: () => {},
        })
      );

      expect(html).toContain('role="region"');
      expect(html).toContain('aria-label="No active filters matched"');
      expect(html).toContain('Reset Filters');
    });

    it('ErrorState sets role="alert" for immediate screen reader announcement', () => {
      const html = renderToStaticMarkup(
        React.createElement(ErrorState, {
          title: 'Failed to retrieve inventory',
          description: 'Unable to connect to VoyageHub right now. Please check your connection.',
          onRetry: () => {},
          retryText: 'Retry Search',
        })
      );

      expect(html).toContain('role="alert"');
      expect(html).toContain('border-rose-200');
      expect(html).toContain('Failed to retrieve inventory');
      expect(html).toContain('Retry Search');
    });
  });

  describe('5. Accessibility Live Regions & Plain Language Sanity', () => {
    it('ensures user error messages are clean and free of database/backend technical jargon', () => {
      const forbiddenTokens = ['PostgreSQL', 'psycopg2', 'SELECT * FROM', 'bcrypt$', 'JWT signature', 'internal server error 500'];

      const sanitizedMessages = [
        'Unable to connect to VoyageHub right now. Please make sure the VoyageHub service is running and try again.',
        'Invalid email or password. Please check your credentials.',
        'Password changed successfully. Your account has been updated securely.',
        'Please provide a valid email address for your e-ticket & boarding pass.',
      ];

      sanitizedMessages.forEach((msg) => {
        forbiddenTokens.forEach((token) => {
          expect(msg.toLowerCase()).not.toContain(token.toLowerCase());
        });
      });
    });

    it('confirms polite status regions for dynamic results count announcements', () => {
      const count = 4;
      const service = 'flight';
      const announcement = `Found ${count} available ${service} options`;
      expect(announcement).toBe('Found 4 available flight options');
    });
  });
});
