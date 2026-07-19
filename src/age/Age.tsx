import { useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { ResultCard } from '../components/ResultCard';
import {
  calculateAge,
  formatDateInputValue,
  formatDisplayDate,
  parseLocalDateInput,
  validateBirthNotFuture,
} from './logic';

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  inputRef?: RefObject<HTMLInputElement | null>;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function DateField({ id, label, value, onChange, error, inputRef, onKeyDown }: DateFieldProps) {
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
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error && (
        <p className="number-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type AgeResultState =
  | {
      ok: true;
      age: number;
      hadBirthdayThisYear: boolean;
      nextBirthday: string;
      daysUntilNextBirthday: number;
      birthDisplay: string;
      referenceDisplay: string;
    }
  | { ok: false };

export function Age() {
  const today = formatDateInputValue(new Date());
  const [birth, setBirth] = useState('');
  const [reference, setReference] = useState(today);
  const [birthError, setBirthError] = useState<string | null>(null);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [result, setResult] = useState<AgeResultState>({ ok: false });

  const birthRef = useRef<HTMLInputElement>(null);
  const referenceRef = useRef<HTMLInputElement>(null);

  function handleCalculate() {
    const birthDate = parseLocalDateInput(birth);
    const referenceDate = parseLocalDateInput(reference);

    let bError: string | null = null;
    let rError: string | null = null;

    if (!birthDate) bError = '생년월일을 확인해주세요';
    if (!referenceDate) rError = '기준일을 확인해주세요';

    if (birthDate && referenceDate) {
      bError = validateBirthNotFuture(birthDate, referenceDate);
    }

    setBirthError(bError);
    setReferenceError(rError);

    if (bError || rError || !birthDate || !referenceDate) {
      setResult({ ok: false });
      return;
    }

    const calculated = calculateAge(birthDate, referenceDate);
    setResult({
      ok: true,
      age: calculated.age,
      hadBirthdayThisYear: calculated.hadBirthdayThisYear,
      nextBirthday: formatDisplayDate(calculated.nextBirthday),
      daysUntilNextBirthday: calculated.daysUntilNextBirthday,
      birthDisplay: formatDisplayDate(birthDate),
      referenceDisplay: formatDisplayDate(referenceDate),
    });
  }

  function handleReset() {
    setBirth('');
    setReference(today);
    setBirthError(null);
    setReferenceError(null);
    setResult({ ok: false });
    birthRef.current?.focus();
  }

  function handleBirthKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      referenceRef.current?.focus();
    }
  }

  function handleReferenceKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCalculate();
    }
  }

  return (
    <div className="calculator">
      <div className="calculator__fields">
        <DateField
          id="age-birth"
          label="생년월일"
          value={birth}
          onChange={setBirth}
          error={birthError}
          inputRef={birthRef}
          onKeyDown={handleBirthKeyDown}
        />
        <DateField
          id="age-reference"
          label="기준일"
          value={reference}
          onChange={setReference}
          error={referenceError}
          inputRef={referenceRef}
          onKeyDown={handleReferenceKeyDown}
        />
      </div>

      <div className="calculator__actions">
        <button type="button" className="btn-primary-action" onClick={handleCalculate}>
          계산하기
        </button>
        <button type="button" className="btn-secondary-action" onClick={handleReset}>
          초기화
        </button>
      </div>

      <div className="calculator__result-row">
        <ResultCard
          value={result.ok ? `만 ${result.age}세` : '-'}
          caption={
            result.ok
              ? result.hadBirthdayThisYear
                ? '올해 생일이 지났습니다.'
                : '아직 올해 생일이 지나지 않았습니다.'
              : '생년월일과 기준일을 입력하고 계산하기를 눌러주세요.'
          }
          detail={
            result.ok
              ? `다음 생일(${result.nextBirthday})까지 ${result.daysUntilNextBirthday}일 남았습니다 · 생년월일 ${result.birthDisplay} · 기준일 ${result.referenceDisplay}`
              : undefined
          }
        />
        <img
          className="mascot-result"
          src="/mascot/borong-ribbon.webp"
          width={80}
          height={80}
          alt="리본을 한 계산해보롱 마스코트 보롱이"
          loading="lazy"
        />
      </div>
    </div>
  );
}
