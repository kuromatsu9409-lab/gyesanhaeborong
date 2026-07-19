import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { NumberField } from '../components/NumberField';
import { ResultCard } from '../components/ResultCard';
import { TabBar } from '../components/TabBar';
import {
  calcAIsPercentOfB,
  calcAmountFromPercent,
  calcChangeRate,
  calcDecrease,
  calcDiscountedPrice,
  calcIncrease,
  calcOriginalPriceFromDiscount,
  calcPercentOfB,
} from './logic';

type TabId =
  | 'a-is-percent-of-b'
  | 'percent-of-b'
  | 'discount-price'
  | 'increase'
  | 'decrease'
  | 'change-rate'
  | 'original-price';

type FieldConfig = {
  label: string;
  placeholder: string;
  unit?: string;
  allowNegative: boolean;
  disallowZero: boolean;
  min?: number;
  max?: number; // exclusive
};

type PercentResult = { ok: true; value: string; caption: string; detail?: string } | { ok: false };

type TabConfig = {
  id: TabId;
  tabLabel: string;
  title: string;
  description: string;
  field1: FieldConfig;
  field2: FieldConfig;
  computeResult: (value1: number, value2: number) => PercentResult;
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

const TABS: TabConfig[] = [
  {
    id: 'a-is-percent-of-b',
    tabLabel: 'A는 B의 %',
    title: 'A는 B의 몇 %인가',
    description: '일부 값이 전체 값의 몇 %인지 계산합니다.',
    field1: { label: '일부 값', placeholder: '예: 350', allowNegative: false, disallowZero: false },
    field2: { label: '전체 값', placeholder: '예: 500', allowNegative: false, disallowZero: true },
    computeResult: (part, whole) => {
      const percent = calcAIsPercentOfB(part, whole);
      if (!Number.isFinite(percent)) return { ok: false };
      return {
        ok: true,
        value: `${formatNumber(percent)}%`,
        caption: `${formatNumber(part)}은(는) ${formatNumber(whole)}의 ${formatNumber(percent)}%입니다`,
      };
    },
  },
  {
    id: 'percent-of-b',
    tabLabel: 'B의 A%',
    title: 'B의 A%는 얼마인가',
    description: '전체 값에서 특정 퍼센트에 해당하는 값을 계산합니다.',
    field1: { label: '전체 값', placeholder: '예: 50000', allowNegative: false, disallowZero: false },
    field2: { label: '퍼센트', placeholder: '예: 30', unit: '%', allowNegative: true, disallowZero: false },
    computeResult: (whole, percent) => {
      const value = calcPercentOfB(percent, whole);
      if (!Number.isFinite(value)) return { ok: false };
      return {
        ok: true,
        value: formatNumber(value),
        caption: `${formatNumber(whole)}의 ${formatNumber(percent)}%는 ${formatNumber(value)}입니다`,
      };
    },
  },
  {
    id: 'discount-price',
    tabLabel: '할인',
    title: 'A에서 B% 할인',
    description: '정가에서 할인율을 적용한 할인 금액과 최종 금액을 계산합니다.',
    field1: { label: '정가', placeholder: '예: 50000', unit: '원', allowNegative: false, disallowZero: false },
    field2: { label: '할인율', placeholder: '예: 30', unit: '%', allowNegative: false, disallowZero: false, min: 0, max: 100 },
    computeResult: (price, percent) => {
      const amount = calcAmountFromPercent(price, percent);
      const final = calcDiscountedPrice(price, percent);
      if (!Number.isFinite(final)) return { ok: false };
      return {
        ok: true,
        value: `${formatNumber(final)}원`,
        caption: `정가 ${formatNumber(price)}원에서 ${formatNumber(percent)}% 할인된 최종 금액입니다`,
        detail: `할인 금액 ${formatNumber(amount)}원`,
      };
    },
  },
  {
    id: 'increase',
    tabLabel: '증가',
    title: 'A에서 B% 증가',
    description: '기준값에서 특정 비율만큼 증가한 금액과 최종값을 계산합니다.',
    field1: { label: '기준값', placeholder: '예: 10000', allowNegative: true, disallowZero: false },
    field2: { label: '증가율', placeholder: '예: 20', unit: '%', allowNegative: true, disallowZero: false },
    computeResult: (base, percent) => {
      const amount = calcAmountFromPercent(base, percent);
      const final = calcIncrease(base, percent);
      if (!Number.isFinite(final)) return { ok: false };
      return {
        ok: true,
        value: formatNumber(final),
        caption: `${formatNumber(base)}에서 ${formatNumber(percent)}% 증가한 값입니다`,
        detail: `증가 금액 ${formatNumber(amount)}`,
      };
    },
  },
  {
    id: 'decrease',
    tabLabel: '감소',
    title: 'A에서 B% 감소',
    description: '기준값에서 특정 비율만큼 감소한 금액과 최종값을 계산합니다.',
    field1: { label: '기준값', placeholder: '예: 10000', allowNegative: true, disallowZero: false },
    field2: { label: '감소율', placeholder: '예: 20', unit: '%', allowNegative: true, disallowZero: false },
    computeResult: (base, percent) => {
      const amount = calcAmountFromPercent(base, percent);
      const final = calcDecrease(base, percent);
      if (!Number.isFinite(final)) return { ok: false };
      return {
        ok: true,
        value: formatNumber(final),
        caption: `${formatNumber(base)}에서 ${formatNumber(percent)}% 감소한 값입니다`,
        detail: `감소 금액 ${formatNumber(amount)}`,
      };
    },
  },
  {
    id: 'change-rate',
    tabLabel: '증감률',
    title: 'A에서 B로 변했을 때 증감률',
    description: '이전 값에서 현재 값으로 변할 때의 증감률을 계산합니다.',
    field1: { label: '이전 값', placeholder: '예: 100', allowNegative: true, disallowZero: true },
    field2: { label: '현재 값', placeholder: '예: 130', allowNegative: true, disallowZero: false },
    computeResult: (before, after) => {
      const rate = calcChangeRate(before, after);
      if (!Number.isFinite(rate)) return { ok: false };
      if (rate > 0) {
        return {
          ok: true,
          value: `${formatNumber(rate)}% 증가`,
          caption: `${formatNumber(before)}에서 ${formatNumber(after)}로 ${formatNumber(rate)}% 증가했습니다`,
        };
      }
      if (rate < 0) {
        return {
          ok: true,
          value: `${formatNumber(Math.abs(rate))}% 감소`,
          caption: `${formatNumber(before)}에서 ${formatNumber(after)}로 ${formatNumber(Math.abs(rate))}% 감소했습니다`,
        };
      }
      return {
        ok: true,
        value: '변동 없음',
        caption: `${formatNumber(before)}에서 ${formatNumber(after)}로 변동이 없습니다`,
      };
    },
  },
  {
    id: 'original-price',
    tabLabel: '역산',
    title: '할인 전 원래 가격 역산',
    description: '할인된 가격과 할인율로 할인 전 원래 가격을 역산합니다.',
    field1: { label: '할인된 가격', placeholder: '예: 35000', unit: '원', allowNegative: false, disallowZero: false },
    field2: { label: '할인율', placeholder: '예: 30', unit: '%', allowNegative: false, disallowZero: false, min: 0, max: 100 },
    computeResult: (sale, percent) => {
      const original = calcOriginalPriceFromDiscount(sale, percent);
      if (!Number.isFinite(original)) return { ok: false };
      return {
        ok: true,
        value: `${formatNumber(original)}원`,
        caption: `${formatNumber(percent)}% 할인된 가격이 ${formatNumber(sale)}원일 때 원래 가격입니다`,
      };
    },
  },
];

function validateField(raw: string, field: FieldConfig): string | null {
  if (raw.trim() === '') return '값을 입력해주세요';
  const num = Number(raw);
  if (!Number.isFinite(num)) return '숫자를 입력해주세요';
  if (!field.allowNegative && num < 0) return '0 이상의 값을 입력해주세요';
  if (field.disallowZero && num === 0) return '0은 입력할 수 없어요';
  if (field.min !== undefined && num < field.min) return `${field.min} 이상의 값을 입력해주세요`;
  if (field.max !== undefined && num >= field.max) return `${field.max} 미만의 값을 입력해주세요`;
  return null;
}

export function Percent() {
  const [activeTabId, setActiveTabId] = useState<TabId>(TABS[0].id);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ v1: number; v2: number } | null>(null);

  const field1Ref = useRef<HTMLInputElement>(null);
  const field2Ref = useRef<HTMLInputElement>(null);

  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];
  const result: PercentResult = submitted ? activeTab.computeResult(submitted.v1, submitted.v2) : { ok: false };

  function handleTabChange(id: TabId) {
    setActiveTabId(id);
    setValue1('');
    setValue2('');
    setError1(null);
    setError2(null);
    setSubmitted(null);
  }

  function handleCalculate() {
    const tab = activeTab;
    const err1 = validateField(value1, tab.field1);
    const err2 = validateField(value2, tab.field2);
    setError1(err1);
    setError2(err2);
    if (err1 || err2) {
      setSubmitted(null);
      return;
    }
    setSubmitted({ v1: Number(value1), v2: Number(value2) });
  }

  function handleReset() {
    setValue1('');
    setValue2('');
    setError1(null);
    setError2(null);
    setSubmitted(null);
    field1Ref.current?.focus();
  }

  function handleField1KeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      field2Ref.current?.focus();
    }
  }

  function handleField2KeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCalculate();
    }
  }

  return (
    <div className="calculator">
      <TabBar
        tabs={TABS.map((tab) => ({ id: tab.id, label: tab.tabLabel }))}
        activeId={activeTabId}
        onChange={handleTabChange}
      />

      <h3 className="calculator__title">{activeTab.title}</h3>
      <p className="calculator__description">{activeTab.description}</p>

      <div className="calculator__fields">
        <NumberField
          id="percent-field-1"
          label={activeTab.field1.label}
          value={value1}
          onChange={setValue1}
          placeholder={activeTab.field1.placeholder}
          unit={activeTab.field1.unit}
          error={error1}
          inputRef={field1Ref}
          onKeyDown={handleField1KeyDown}
        />
        <NumberField
          id="percent-field-2"
          label={activeTab.field2.label}
          value={value2}
          onChange={setValue2}
          placeholder={activeTab.field2.placeholder}
          unit={activeTab.field2.unit}
          error={error2}
          inputRef={field2Ref}
          onKeyDown={handleField2KeyDown}
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
          value={result.ok ? result.value : '-'}
          caption={result.ok ? result.caption : '값을 입력하고 계산하기를 눌러주세요.'}
          detail={result.ok ? result.detail : undefined}
        />
        <img
          className="mascot-result"
          src={result.ok ? '/mascot/borong-tongue.webp' : '/mascot/borong-sitting.webp'}
          width={64}
          height={64}
          alt={result.ok ? '혀를 내밀고 웃는 계산해보롱 마스코트 보롱이' : '앉아서 기다리는 계산해보롱 마스코트 보롱이'}
          loading="lazy"
        />
      </div>
    </div>
  );
}
