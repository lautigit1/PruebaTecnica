import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  optionalLabel?: string;
  monospace?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      optionalLabel,
      monospace = false,
      id: customId,
      className = '',
      containerClassName = '',
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-ink-700">
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
            {!required && optionalLabel && (
              <span className="font-normal text-ink-300"> · {optionalLabel}</span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink-900 touch-manipulation transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-ink-300 hover:border-[#BEB9AE] focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:border-line disabled:bg-line-soft disabled:text-ink-300 ${
            monospace ? 'font-mono text-[13px]' : 'text-sm'
          } ${
            hasError
              ? 'border-danger-border focus:border-danger focus:ring-danger/15'
              : 'border-line-strong focus:border-accent focus:ring-accent/15'
          } ${className}`}
          {...props}
        />

        {hasError && (
          <p id={errorId} className="text-xs leading-snug text-danger" role="alert">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-xs leading-snug text-ink-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
