import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * All variants share height, radius, typography and transition.
 * Only color, border and emphasis change.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-[#FDFCFA] shadow-[0_1px_2px_rgba(29,91,82,0.25)] hover:border-accent-dark hover:bg-accent-dark hover:shadow-[0_2px_6px_rgba(29,91,82,0.3)] active:bg-[#123B35] active:shadow-none',
  secondary:
    'border-line-strong bg-surface text-ink-900 hover:border-[#BEB9AE] hover:bg-[#F5F3EE] active:bg-line-soft',
  outline:
    'border-line-strong bg-surface text-ink-900 hover:border-[#BEB9AE] hover:bg-[#F5F3EE] active:bg-line-soft',
  ghost:
    'border-transparent bg-transparent text-ink-500 hover:bg-line-soft hover:text-ink-900 active:bg-line',
  danger:
    'border-[#EBD5D0] bg-danger-tint text-danger hover:bg-danger-hover active:bg-[#EBD5D0]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={`inline-flex shrink-0 select-none items-center justify-center rounded-lg border font-medium touch-manipulation transition-[color,background-color,border-color,box-shadow,transform] duration-150 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line disabled:bg-line-soft disabled:text-[#6F6A61] disabled:shadow-none disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
