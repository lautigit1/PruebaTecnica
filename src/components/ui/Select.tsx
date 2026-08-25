import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[] | readonly string[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Seleccione una opción',
      id: customId,
      className = '',
      containerClassName = '',
      required,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = customId || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = Boolean(error);
    const isEmpty = !value;

    return (
      <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="text-[13px] font-medium text-ink-700">
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            value={value}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            className={`h-10 w-full cursor-pointer appearance-none rounded-lg border bg-surface pl-3 pr-9 text-sm touch-manipulation transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#BEB9AE] focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:border-line disabled:bg-line-soft disabled:text-ink-300 ${
              isEmpty ? 'text-ink-400' : 'text-ink-900'
            } ${
              hasError
                ? 'border-danger-border focus:border-danger focus:ring-danger/15'
                : 'border-line-strong focus:border-accent focus:ring-accent/15'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const optionValue = typeof opt === 'string' ? opt : opt.value;
              const optionLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
        </div>

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

Select.displayName = 'Select';
