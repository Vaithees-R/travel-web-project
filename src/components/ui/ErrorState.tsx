import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryText?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Content',
  description,
  onRetry,
  retryText = 'Try Again',
  secondaryActionText,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'bg-white rounded-3xl border border-rose-200/90 p-8 sm:p-10 text-center space-y-4 shadow-2xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{description}</p>
      </div>

      {(onRetry || onSecondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>{retryText}</span>
            </Button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
