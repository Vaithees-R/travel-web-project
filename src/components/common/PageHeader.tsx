import React from 'react';
import { Badge } from '../ui/Badge';

export interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-neutral-200">
      <div className="space-y-1.5">
        {badge && (
          <div>
            <Badge variant="accent">{badge}</Badge>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
          {description}
        </p>

      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
