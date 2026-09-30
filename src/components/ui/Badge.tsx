import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    accent: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    outline: 'bg-transparent text-neutral-600 border-neutral-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
