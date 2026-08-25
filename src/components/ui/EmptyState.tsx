import React from 'react';
import { UserX, SearchX, Plus, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export type EmptyStateType = 'no-contacts' | 'no-results';

export interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  actionLabel?: string;
  title?: string;
  description?: string;
  totalCount?: number;
  className?: string;
}

const defaultContent: Record<
  EmptyStateType,
  {
    icon: React.ComponentType<{
      className?: string;
      'aria-hidden'?: boolean | 'true' | 'false';
    }>;
    eyebrow: string;
    title: string;
    description: string;
    actionLabel: string;
    actionIcon: React.ComponentType<{
      className?: string;
      'aria-hidden'?: boolean | 'true' | 'false';
    }>;
  }
> = {
  'no-contacts': {
    icon: UserX,
    eyebrow: 'Directorio vacío',
    title: 'No hay contactos registrados',
    description:
      'Cuando agregues un contacto va a aparecer en este listado, con su departamento y sus datos de contacto.',
    actionLabel: 'Agregar primer contacto',
    actionIcon: Plus,
  },
  'no-results': {
    icon: SearchX,
    eyebrow: 'Sin coincidencias',
    title: 'No se encontraron resultados',
    description:
      'Ni el término de búsqueda ni el departamento seleccionado devolvieron contactos. Probá con otro nombre o restablecé los filtros.',
    actionLabel: 'Restablecer filtros',
    actionIcon: RotateCcw,
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
  title,
  description,
  totalCount,
  className = '',
}) => {
  const config = defaultContent[type];
  const Icon = config.icon;
  const ActionIcon = config.actionIcon;

  const displayDescription =
    description ??
    (type === 'no-results' && typeof totalCount === 'number'
      ? `${config.description} Hay ${totalCount} contactos en el directorio.`
      : config.description);

  return (
    <div
      className={`flex flex-col items-center px-5 py-12 text-center sm:px-8 ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-ink-400 mb-3">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-300">
        {config.eyebrow}
      </span>

      <h3 className="mt-2 text-base font-semibold tracking-[-0.008em] text-ink-900">
        {title ?? config.title}
      </h3>

      <p className="mt-1.5 max-w-[42ch] text-[13.5px] leading-relaxed text-ink-500 [text-wrap:pretty]">
        {displayDescription}
      </p>

      {onAction && (
        <div className="mt-5">
          <Button
            variant={type === 'no-contacts' ? 'primary' : 'secondary'}
            onClick={onAction}
            leftIcon={<ActionIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            {actionLabel ?? config.actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
