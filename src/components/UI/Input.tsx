import React from 'react';

export interface InputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  inputMode,
}) => {
  const inputClasses = `
    w-full px-3 py-3 min-h-[44px] border border-paper-300 rounded-sm bg-paper-50 text-ink-950 placeholder-ink-400
    focus:outline-none focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700
    disabled:bg-paper-100 disabled:text-ink-400 disabled:cursor-not-allowed
    text-base
    ${error ? 'border-laterite-500 focus:ring-laterite-500 focus:border-laterite-500' : ''}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink-800 mb-1">
          {label}
          {required && <span className="text-courtyard-700 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={inputClasses}
      />
      
      {error && (
        <p className="mt-1 text-sm text-laterite-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
