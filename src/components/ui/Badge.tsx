import React from 'react';
import { Department } from '../../types/contact';
import { DEPARTMENT_COLORS } from '../../constants/departments';

type BadgeProps = {
  department: Department;
  className?: string;
  showDot?: boolean;
};

export const Badge: React.FC<BadgeProps> = ({
  department,
  className = '',
  showDot = true,
}) => {
  const config = DEPARTMENT_COLORS[department] || {
    badge: 'bg-line-soft text-ink-500',
    dot: 'bg-ink-500',
  };

  return (
    <span
      className={`inline-flex h-[22px] items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[11.5px] font-medium leading-none ${config.badge} ${className}`}
    >
      {showDot && (
        <span
          className={`h-[5px] w-[5px] shrink-0 rounded-full ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{department}</span>
    </span>
  );
};
