import { useState } from 'react';
import { NumberField } from '../components/NumberField';
import { ResultCard } from '../components/ResultCard';
import { TabBar } from '../components/TabBar';
import {
  calcAIsPercentOfB,
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
  | 'increase'
  | 'decrease'
  | 'change-rate'
  | 'discount-price'
  | 'original-price';

type TabConfig = {
  id: TabId;
  tabLabel: string;
  title: string;
  field1Label: string;
  field2Label: string;
  compute: (value1: number, value2: number) => number;
  caption: (value1: number, value2: number, result: number) => string;
  suffix: string;
};

type CalculationResult = { ok: true; value: number } | { ok: false };

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function computeResult(tab: TabConfig, num1: number, num2: number, hasBothValues: boolean): CalculationResult {
  if (!hasBothValues) return { ok: false };
  const value = tab.compute(num1, num2);
  return Number.isFinite(value) ? { ok: true, value } : { ok: false };
}

const TABS: TabConfig[] = [
  {
    id: 'a-is-percent-of-b',
    tabLabel: 'A는 B의 %',
    title: 'A는 B의 몇 %인가',
    field1Label: 'A',
    field2Label: 'B',
    compute: calcAIsPercentOfB,
    caption: (a, b, result) => `${formatNumber(a)}은(는) ${formatNumber(b)}의 ${formatNumber(result)}% 입니다`,
    suffix: '%',
  },
  {
    id: 'percent-of-b',
    tabLabel: 'B의 A%',
    title: 'B의 A%는 얼마인가',
    field1Label: '기준값 (B)',
    field2Label: '퍼센트 (A, %)',
    compute: (b, a) => calcPercentOfB(a, b),
    caption: (b, a, result) => `${formatNumber(b)}의 ${formatNumber(a)}%는 ${formatNumber(result)} 입니다`,
    suffix: '',
  },
  {
    id: 'increase',
    tabLabel: '증가',
    title: '퍼센트 증가',
    field1Label: '기준값',
    field2Label: '증가율 (%)',
    compute: calcIncrease,
    caption: (base, percent, result) => `${formatNumber(base)}에서 ${formatNumber(percent)}% 증가하면 ${formatNumber(result)} 입니다`,
    suffix: '',
  },
  {
    id: 'decrease',
    tabLabel: '감소',
    title: '퍼센트 감소',
    field1Label: '기준값',
    field2Label: '감소율 (%)',
    compute: calcDecrease,
    caption: (base, percent, result) => `${formatNumber(base)}에서 ${formatNumber(percent)}% 감소하면 ${formatNumber(result)} 입니다`,
    suffix: '',
  },
  {
    id: 'change-rate',
    tabLabel: '증감률',
    title: '두 값의 증감률',
    field1Label: '이전 값',
    field2Label: '이후 값',
    compute: calcChangeRate,
    caption: (before, after, result) => `${formatNumber(before)}에서 ${formatNumber(after)}로 변하면 ${formatNumber(result)}% 증감입니다`,
    suffix: '%',
  },
  {
    id: 'discount-price',
    tabLabel: '할인가',
    title: '할인 가격',
    field1Label: '정가',
    field2Label: '할인율 (%)',
    compute: calcDiscountedPrice,
    caption: (price, discount, result) => `정가 ${formatNumber(price)}에서 ${formatNumber(discount)}% 할인하면 ${formatNumber(result)} 입니다`,
    suffix: '',
  },
  {
    id: 'original-price',
    tabLabel: '원가 역산',
    title: '할인 전 원래 가격 역산',
    field1Label: '할인된 가격',
    field2Label: '할인율 (%)',
    compute: calcOriginalPriceFromDiscount,
    caption: (sale, discount, result) => `${formatNumber(discount)}% 할인된 가격이 ${formatNumber(sale)}이면 원래 가격은 ${formatNumber(result)} 입니다`,
    suffix: '',
  },
];

export function Percent() {
  const [activeTabId, setActiveTabId] = useState<TabId>(TABS[0].id);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];

  const num1 = Number(value1);
  const num2 = Number(value2);
  const hasBothValues = value1.trim() !== '' && value2.trim() !== '' && Number.isFinite(num1) && Number.isFinite(num2);
  const result = computeResult(activeTab, num1, num2, hasBothValues);

  function handleTabChange(id: TabId) {
    setActiveTabId(id);
    setValue1('');
    setValue2('');
  }

  return (
    <div className="calculator">
      <TabBar
        tabs={TABS.map((tab) => ({ id: tab.id, label: tab.tabLabel }))}
        activeId={activeTabId}
        onChange={handleTabChange}
      />

      <h3 className="calculator__title">{activeTab.title}</h3>

      <div className="calculator__fields">
        <NumberField label={activeTab.field1Label} value={value1} onChange={setValue1} />
        <NumberField label={activeTab.field2Label} value={value2} onChange={setValue2} />
      </div>

      <div className="calculator__result-row">
        <ResultCard
          value={result.ok ? `${formatNumber(result.value)}${activeTab.suffix}` : '-'}
          caption={
            result.ok
              ? activeTab.caption(num1, num2, result.value)
              : '값을 입력하면 바로 계산됩니다.'
          }
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
