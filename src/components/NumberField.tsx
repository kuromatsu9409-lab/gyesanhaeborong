import type { KeyboardEvent, RefObject } from 'react';

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  error?: string | null;
  inputRef?: RefObject<HTMLInputElement | null>;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder = '숫자를 입력하세요',
  unit,
  error,
  inputRef,
  onKeyDown,
}: NumberFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="number-field">
      <label className="number-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="number-field__control">
        <input
          id={id}
          ref={inputRef}
          className={`number-field__input${error ? ' number-field__input--error' : ''}`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {unit && (
          <span className="number-field__unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="number-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
