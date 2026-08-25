import React, { useState } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import { Contact } from '../../types/contact';
import { Badge } from '../ui/Badge';

export interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  index?: number;
  isNew?: boolean;
}

const REMOVE_ANIMATION_MS = 180;

/**
 * A single directory row. Column bases are fixed so every row aligns on the
 * same vertical rhythm on wide screens, and wrap naturally on narrow ones.
 */
export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onDelete,
  index = 0,
  isNew = false,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const handleDelete = () => {
    setIsRemoving(true);
    window.setTimeout(() => onDelete(contact.id), REMOVE_ANIMATION_MS);
  };

  const handleCopy = (text: string, field: 'email' | 'phone') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    }
  };

  return (
    <article
      aria-labelledby={`contact-name-${contact.id}`}
      style={{
        animationDelay: isRemoving ? undefined : `${Math.min(index, 12) * 25}ms`,
        transitionDuration: `${REMOVE_ANIMATION_MS}ms`,
      }}
      className={`animate-row-in group relative flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line-soft pl-3.5 pr-[52px] transition-[opacity,transform,max-height,padding,background-color] ease-[cubic-bezier(0.4,0,1,1)] last:border-b-0 hover:bg-[#FBFAF7] sm:pl-5 ${
        isNew ? 'animate-highlight' : ''
      } ${
        isRemoving
          ? 'pointer-events-none max-h-0 overflow-hidden !py-0 opacity-0'
          : 'max-h-[320px] min-h-[58px] py-3.5 opacity-100'
      }`}
    >
      {/* Accent rail: appears on hover/focus to reinforce the row as one scannable unit */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-accent transition-transform duration-150 group-hover:scale-y-100 group-focus-within:scale-y-100"
      />

      {/* Column 1: Name */}
      <div className="min-w-0 shrink grow basis-[170px]">
        <h3
          id={`contact-name-${contact.id}`}
          title={contact.name}
          className="truncate text-[15px] font-medium leading-[1.35] tracking-tight text-ink-900"
        >
          {contact.name}
        </h3>
      </div>

      {/* Column 2: Email */}
      <div className="group/email relative flex items-center min-w-0 shrink grow basis-[196px]">
        <a
          href={`mailto:${contact.email}`}
          title={`Enviar correo a ${contact.email}`}
          className="truncate text-[13.5px] text-ink-500 transition-colors hover:text-accent focus:outline-none focus-visible:text-accent focus-visible:underline"
        >
          {contact.email}
        </a>
        <button
          type="button"
          onClick={() => handleCopy(contact.email, 'email')}
          aria-label={`Copiar correo ${contact.email}`}
          title="Copiar correo"
          className="ml-1.5 hidden h-5 w-5 shrink-0 items-center justify-center rounded text-ink-300 opacity-0 transition-all hover:bg-line-soft hover:text-ink-900 group-hover/email:opacity-100 focus:opacity-100 sm:inline-flex"
        >
          {copiedField === 'email' ? (
            <Check className="h-3 w-3 text-accent" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
        </button>
        {copiedField === 'email' && (
          <span
            role="status"
            className="animate-fade-in absolute -top-5 left-0 z-10 rounded bg-ink-900 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
          >
            Copiado
          </span>
        )}
      </div>

      {/* Column 3: Phone */}
      <div className="group/phone relative flex items-center min-w-0 shrink basis-[128px]">
        {contact.phone ? (
          <>
            <a
              href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
              title={`Llamar a ${contact.phone}`}
              className="truncate text-[13.5px] text-ink-500 transition-colors hover:text-accent focus:outline-none focus-visible:text-accent focus-visible:underline"
            >
              {contact.phone}
            </a>
            <button
              type="button"
              onClick={() => handleCopy(contact.phone!, 'phone')}
              aria-label={`Copiar teléfono ${contact.phone}`}
              title="Copiar teléfono"
              className="ml-1.5 hidden h-5 w-5 shrink-0 items-center justify-center rounded text-ink-300 opacity-0 transition-all hover:bg-line-soft hover:text-ink-900 group-hover/phone:opacity-100 focus:opacity-100 sm:inline-flex"
            >
              {copiedField === 'phone' ? (
                <Check className="h-3 w-3 text-accent" aria-hidden="true" />
              ) : (
                <Copy className="h-3 w-3" aria-hidden="true" />
              )}
            </button>
            {copiedField === 'phone' && (
              <span
                role="status"
                className="animate-fade-in absolute -top-5 left-0 z-10 rounded bg-ink-900 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
              >
                Copiado
              </span>
            )}
          </>
        ) : (
          <span className="block truncate text-[13px] text-ink-300">Sin teléfono</span>
        )}
      </div>

      {/* Column 4: Department */}
      <div className="shrink-0 basis-[116px]">
        <Badge department={contact.department} />
      </div>

      {/* Delete Action */}
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Eliminar a ${contact.name}`}
        title={`Eliminar a ${contact.name}`}
        className="absolute right-2.5 top-[13px] flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-ink-300 transition-[color,background-color,border-color,transform] duration-150 hover:border-[#EBD5D0] hover:bg-danger-tint hover:text-danger active:scale-90 focus:outline-none focus-visible:border-danger focus-visible:bg-danger-tint focus-visible:text-danger focus-visible:ring-[3px] focus-visible:ring-danger/15 sm:right-3.5"
      >
        <Trash2 className="h-[15px] w-[15px]" aria-hidden="true" />
      </button>
    </article>
  );
};
