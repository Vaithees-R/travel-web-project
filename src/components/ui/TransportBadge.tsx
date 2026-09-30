import React from 'react';
import { Plane, Train, Bus, Car, Compass } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CanonicalTransportType, TransportType } from '../../types/travel';

export type { CanonicalTransportType, TransportType };

export interface TransportBadgeProps {
  type: TransportType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'pill' | 'subtle' | 'outline' | 'solid';
}

const normalizeTransportType = (type: string): CanonicalTransportType | null => {
  switch (type) {
    case 'flight':
    case 'flights':
      return 'flight';
    case 'train':
    case 'trains':
      return 'train';
    case 'bus':
    case 'buses':
      return 'bus';
    case 'cab':
    case 'cabs':
      return 'cab';
    default:
      return null;
  }
};

const TRANSPORT_CONFIG: Record<
  CanonicalTransportType,
  {
    defaultLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    colorSubtle: string;
    colorOutline: string;
    colorSolid: string;
  }
> = {
  flight: {
    defaultLabel: 'Flight',
    icon: Plane,
    colorSubtle: 'bg-sky-50 text-sky-700 border-sky-200/80',
    colorOutline: 'border-sky-500 text-sky-700 bg-transparent',
    colorSolid: 'bg-sky-600 text-white border-transparent',
  },
  train: {
    defaultLabel: 'IRCTC Train',
    icon: Train,
    colorSubtle: 'bg-amber-50 text-amber-800 border-amber-200/80',
    colorOutline: 'border-amber-600 text-amber-800 bg-transparent',
    colorSolid: 'bg-amber-700 text-white border-transparent',
  },
  bus: {
    defaultLabel: 'Intercity Bus',
    icon: Bus,
    colorSubtle: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    colorOutline: 'border-emerald-600 text-emerald-800 bg-transparent',
    colorSolid: 'bg-emerald-700 text-white border-transparent',
  },
  cab: {
    defaultLabel: 'Chauffeur Cab',
    icon: Car,
    colorSubtle: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    colorOutline: 'border-indigo-600 text-indigo-800 bg-transparent',
    colorSolid: 'bg-indigo-700 text-white border-transparent',
  },
};

export const TransportBadge: React.FC<TransportBadgeProps> = ({
  type,
  label,
  size = 'md',
  className,
  variant = 'subtle',
}) => {
  const normalized = normalizeTransportType(type);
  const config = normalized ? TRANSPORT_CONFIG[normalized] : null;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  // Defensive fallback UI: render an intentional, safe fallback rather than crashing the React application
  if (!config) {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium leading-none select-none text-xs px-2.5 py-1 gap-1.5 rounded-md border bg-neutral-100 text-neutral-600 border-neutral-200',
          sizeClasses,
          className
        )}
      >
        <Compass className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>{label || (typeof type === 'string' && type ? type : 'Travel')}</span>
      </span>
    );
  }

  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const variantClass = {
    pill: `${config.colorSubtle} rounded-full border`,
    subtle: `${config.colorSubtle} rounded-md border`,
    outline: `${config.colorOutline} rounded-md border`,
    solid: `${config.colorSolid} rounded-md border`,
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium leading-none transition-colors select-none',
        sizeClasses,
        variantClass,
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{displayLabel}</span>
    </span>
  );
};
