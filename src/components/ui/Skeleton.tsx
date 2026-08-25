import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-shimmer rounded-[3px] ${className}`} aria-hidden="true" />
  );
};

/**
 * Mirrors ContactCard geometry exactly (same min-height, paddings and column
 * bases) so the loading -> content transition produces no layout shift.
 */
export const ContactRowSkeleton: React.FC<{ nameWidth: string; emailWidth: string }> = ({
  nameWidth,
  emailWidth,
}) => {
  return (
    <div className="flex min-h-[58px] flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line-soft py-3.5 pl-3.5 pr-[52px] last:border-b-0 sm:pl-5">
      <div className="min-w-0 shrink grow basis-[170px]">
        <Skeleton className={`h-3 ${nameWidth}`} />
      </div>
      <div className="min-w-0 shrink grow basis-[196px]">
        <Skeleton className={`h-2.5 ${emailWidth}`} />
      </div>
      <div className="min-w-0 shrink basis-[128px]">
        <Skeleton className="h-2.5 w-[104px]" />
      </div>
      <div className="shrink-0 basis-[116px]">
        <Skeleton className="h-[22px] w-[88px] rounded-full" />
      </div>
    </div>
  );
};

const SKELETON_ROWS = [
  { nameWidth: 'w-[132px]', emailWidth: 'w-[196px]' },
  { nameWidth: 'w-[108px]', emailWidth: 'w-[212px]' },
  { nameWidth: 'w-[148px]', emailWidth: 'w-[176px]' },
  { nameWidth: 'w-[116px]', emailWidth: 'w-[204px]' },
  { nameWidth: 'w-[140px]', emailWidth: 'w-[188px]' },
  { nameWidth: 'w-[104px]', emailWidth: 'w-[216px]' },
];

export const ContactListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgba(27,26,23,0.04)]"
      aria-label="Cargando contactos"
      role="status"
    >
      {SKELETON_ROWS.slice(0, count).map((row, index) => (
        <ContactRowSkeleton key={index} {...row} />
      ))}
      <span className="sr-only">Cargando lista de contactos...</span>
    </div>
  );
};
