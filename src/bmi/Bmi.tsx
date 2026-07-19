import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { NumberField } from '../components/NumberField';
import { ResultCard } from '../components/ResultCard';
import { calcBmi, classifyBmi } from './logic';

const MIN_HEIGHT_CM = 30;
const MAX_HEIGHT_CM = 250;
const MIN_WEIGHT_KG = 2;
const MAX_WEIGHT_KG = 300;

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function formatBmi(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(1);
}

function validateHeight(raw: string): string | null {
  if (raw.trim() === '') return '키를 입력해주세요';
  const num = Number(raw);
  if (!Number.isFinite(num)) return '숫자를 입력해주세요';
  if (num <= 0) return '키는 0보다 커야 해요';
  if (num < MIN_HEIGHT_CM || num > MAX_HEIGHT_CM) return `${MIN_HEIGHT_CM}~${MAX_HEIGHT_CM}cm 사이로 입력해주세요`;
  return null;
}

function validateWeight(raw: string): string | null {
  if (raw.trim() === '') return '몸무게를 입력해주세요';
  const num = Number(raw);
  if (!Number.isFinite(num)) return '숫자를 입력해주세요';
  if (num <= 0) return '몸무게는 0보다 커야 해요';
  if (num < MIN_WEIGHT_KG || num > MAX_WEIGHT_KG) return `${MIN_WEIGHT_KG}~${MAX_WEIGHT_KG}kg 사이로 입력해주세요`;
  return null;
}

type BmiResult =
  | { ok: true; bmi: number; category: string; heightCm: number; weightKg: number }
  | { ok: false };

export function Bmi() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightError, setHeightError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ height: number; weight: number } | null>(null);

  const heightRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);

  const result: BmiResult = (() => {
    if (!submitted) return { ok: false };
    const bmi = calcBmi(submitted.height, submitted.weight);
    if (!Number.isFinite(bmi)) return { ok: false };
    return { ok: true, bmi, category: classifyBmi(bmi), heightCm: submitted.height, weightKg: submitted.weight };
  })();

  function handleCalculate() {
    const hError = validateHeight(height);
    const wError = validateWeight(weight);
    setHeightError(hError);
    setWeightError(wError);
    if (hError || wError) {
      setSubmitted(null);
      return;
    }
    setSubmitted({ height: Number(height), weight: Number(weight) });
  }

  function handleReset() {
    setHeight('');
    setWeight('');
    setHeightError(null);
    setWeightError(null);
    setSubmitted(null);
    heightRef.current?.focus();
  }

  function handleHeightKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      weightRef.current?.focus();
    }
  }

  function handleWeightKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCalculate();
    }
  }

  return (
    <div className="calculator">
      <div className="calculator__fields">
        <NumberField
          id="bmi-height"
          label="키"
          value={height}
          onChange={setHeight}
          placeholder="예) 170"
          unit="cm"
          error={heightError}
          inputRef={heightRef}
          onKeyDown={handleHeightKeyDown}
        />
        <NumberField
          id="bmi-weight"
          label="몸무게"
          value={weight}
          onChange={setWeight}
          placeholder="예) 65"
          unit="kg"
          error={weightError}
          inputRef={weightRef}
          onKeyDown={handleWeightKeyDown}
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
          value={result.ok ? formatBmi(result.bmi) : '-'}
          caption={result.ok ? result.category : '키와 몸무게를 입력하고 계산하기를 눌러주세요.'}
          detail={
            result.ok
              ? `${formatNumber(result.weightKg)} ÷ (${(result.heightCm / 100).toFixed(2)}m × ${(result.heightCm / 100).toFixed(2)}m) = ${formatBmi(result.bmi)} · 입력: 키 ${formatNumber(result.heightCm)}cm · 몸무게 ${formatNumber(result.weightKg)}kg`
              : undefined
          }
        />
        <img
          className="mascot-result"
          src="/mascot/borong-reading.webp"
          width={80}
          height={80}
          alt="책을 읽고 있는 계산해보롱 마스코트 보롱이"
          loading="lazy"
        />
      </div>

      <p className="calculator__disclaimer">
        BMI는 참고용 지표이며 개인의 체형과 건강 상태를 모두 반영하지 않습니다. 성인 기준입니다.
      </p>
    </div>
  );
}
