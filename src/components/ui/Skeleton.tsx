import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-neutral-200/80 rounded-xl', className)}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-white rounded-3xl border border-neutral-200 p-6 space-y-4 animate-pulse shadow-2xs',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonResultCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-white rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-5 animate-pulse',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-28 h-5 rounded-md" />
        </div>
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>

      {/* Route & Times */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 flex items-center justify-between sm:justify-start sm:gap-8">
          <div className="space-y-1.5">
            <Skeleton className="w-20 h-7 rounded-md" />
            <Skeleton className="w-12 h-3.5 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>

          <div className="flex-1 max-w-[140px] px-2 space-y-2 flex flex-col items-center">
            <Skeleton className="w-12 h-3 rounded-md" />
            <Skeleton className="w-full h-1 rounded-full" />
            <Skeleton className="w-14 h-2.5 rounded-md" />
          </div>

          <div className="space-y-1.5 text-right sm:text-left">
            <Skeleton className="w-20 h-7 rounded-md" />
            <Skeleton className="w-12 h-3.5 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>
        </div>

        {/* Price & CTA */}
        <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
          <div className="space-y-1 text-left md:text-right">
            <Skeleton className="w-16 h-3 rounded-md" />
            <Skeleton className="w-24 h-7 rounded-md" />
          </div>
          <Skeleton className="w-28 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTripCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-white rounded-3xl border border-neutral-200 p-6 space-y-4 animate-pulse shadow-2xs',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-24 h-4 rounded-md" />
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div className="space-y-1">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
        <div className="space-y-1 sm:text-right">
          <Skeleton className="w-20 h-6 rounded-md sm:ml-auto" />
          <Skeleton className="w-14 h-3 rounded-md sm:ml-auto" />
        </div>
      </div>

      <div className="pt-2 flex justify-between items-center border-t border-neutral-100">
        <Skeleton className="w-32 h-4 rounded-md" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};
