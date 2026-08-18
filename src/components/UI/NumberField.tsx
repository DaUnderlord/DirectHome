import React, { useEffect, useState } from 'react';

interface NumberFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  allowDecimal?: boolean;
  hint?: string;
  error?: string;
  className?: string;
}

function sanitize(raw: string, allowDecimal: boolean) {
  const cleaned = allowDecimal ? raw.replace(/[^\d.]/g, '') : raw.replace(/\D/g, '');
  if (!allowDecimal) return cleaned;
  const [head, ...rest] = cleaned.split('.');
  return rest.length ? `${head}.${rest.join('')}` : head;
}

const fieldClass =
  'w-full min-h-12 px-4 py-3 text-base rounded-sm bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700';

const NumberField: React.FC<NumberFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  prefix,
  suffix,
  placeholder,
  allowDecimal = false,
  hint,
  error,
  className = '',
}) => {
  const [draft, setDraft] = useState(Number.isFinite(value) ? String(value) : '');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDraft(Number.isFinite(value) ? String(value) : '');
    }
  }, [value, focused]);

  const commit = (raw: string) => {
    if (raw.trim() === '') {
      const fallback = min ?? 0;
      onChange(fallback);
      setDraft(String(fallback));
      return;
    }
    let next = allowDecimal ? Number(raw) : parseInt(raw, 10);
    if (!Number.isFinite(next)) next = min ?? 0;
    if (min != null) next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-sm font-medium text-ink-800 mb-2">{label}</span>
      )}
      <span className="relative block">
        {prefix && (
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-ink-500 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type="text"
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          pattern={allowDecimal ? '[0-9]*[.]?[0-9]*' : '[0-9]*'}
          autoComplete="off"
          enterKeyHint="done"
          placeholder={placeholder}
          value={draft}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const next = sanitize(e.target.value, allowDecimal);
            setDraft(next);
            if (next === '') return;
            const parsed = allowDecimal ? Number(next) : parseInt(next, 10);
            if (!Number.isFinite(parsed)) return;
            onChange(parsed);
          }}
          onBlur={() => {
            setFocused(false);
            commit(draft);
          }}
          className={`${fieldClass} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-14' : ''} ${
            error ? 'border-red-500 focus:ring-red-400 focus:border-red-500' : ''
          }`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </span>
      {error ? (
        <span className="mt-1 block text-sm text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-500">{hint}</span>
      ) : null}
    </label>
  );
};

export const toolSelectClass =
  'w-full min-h-12 px-4 py-3 text-base rounded-sm bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700';

export const toolInputClass = fieldClass;

export default NumberField;
