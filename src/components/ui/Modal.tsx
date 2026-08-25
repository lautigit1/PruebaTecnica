import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap = {
  sm: 'max-w-[380px]',
  md: 'max-w-[468px]',
  lg: 'max-w-[560px]',
  xl: 'max-w-[640px]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll and manage accessible focus
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const rootEl = document.getElementById('root');
    rootEl?.setAttribute('inert', '');

    const focusTarget = () => {
      if (!modalRef.current) return;
      if (modalRef.current.contains(document.activeElement)) return;

      const autoFocusEl = modalRef.current.querySelector<HTMLElement>('[autofocus]');
      if (autoFocusEl) {
        autoFocusEl.focus();
        return;
      }

      const firstInput = modalRef.current.querySelector<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      firstInput?.focus();
    };

    focusTarget();

    const getFocusableElements = (): HTMLElement[] => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      // Trap Tab focus within the dialog so it never reaches the background
      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || !modalRef.current?.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !modalRef.current?.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      rootEl?.removeAttribute('inert');
      document.removeEventListener('keydown', handleKeyDown);
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === 'function'
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A17]/40 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={modalRef}
        className={`animate-fade-in relative z-10 flex max-h-[calc(100vh-48px)] w-full flex-col rounded-xl border border-line bg-surface shadow-dialog ${maxWidthMap[maxWidth]}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-soft px-5 pb-4 pt-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-base font-semibold tracking-[-0.008em] text-ink-900"
            >
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1 text-[13px] leading-snug text-ink-400"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-ink-400 transition-colors hover:bg-line-soft hover:text-ink-900 focus:outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-col">{children}</div>
      </div>
    </div>,
    document.body
  );
};
