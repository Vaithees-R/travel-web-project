import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  secondaryActionHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  secondaryActionText,
  onSecondaryAction,
  secondaryActionHref,
  children,
  className,
}) => {
  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        'bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-5 shadow-2xs',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto border border-neutral-200/60">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="max-w-md mx-auto space-y-1.5">
        <h3 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{description}</p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionHref ? (
            <Link to={actionHref}>
              <Button variant="primary" size="md">
                {actionText}
              </Button>
            </Link>
          ) : actionText && onAction ? (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionText}
            </Button>
          ) : null}

          {secondaryActionHref ? (
            <Link to={secondaryActionHref}>
              <Button variant="outline" size="md">
                {secondaryActionText}
              </Button>
            </Link>
          ) : secondaryActionText && onSecondaryAction ? (
            <Button variant="outline" size="md" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          ) : null}
        </div>
      )}

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};
