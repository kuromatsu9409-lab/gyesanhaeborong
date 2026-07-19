import { describe, expect, it } from 'vitest';
import {
  calcAIsPercentOfB,
  calcChangeRate,
  calcDecrease,
  calcDiscountedPrice,
  calcIncrease,
  calcOriginalPriceFromDiscount,
  calcPercentOfB,
} from './logic';

describe('percent calculator logic', () => {
  it('A는 B의 몇 %인가: 73은 200의 36.5%', () => {
    expect(calcAIsPercentOfB(73, 200)).toBe(36.5);
  });

  it('B의 A%는 얼마인가: 200의 15%는 30', () => {
    expect(calcPercentOfB(15, 200)).toBe(30);
  });

  it('퍼센트 증가: 10000에서 20% 증가하면 12000', () => {
    expect(calcIncrease(10000, 20)).toBe(12000);
  });

  it('퍼센트 감소: 10000에서 20% 감소하면 8000', () => {
    expect(calcDecrease(10000, 20)).toBe(8000);
  });

  it('두 값의 증감률: 100에서 130이 되면 30%', () => {
    expect(calcChangeRate(100, 130)).toBe(30);
  });

  it('할인 가격: 정가 50000에서 30% 할인이면 35000', () => {
    expect(calcDiscountedPrice(50000, 30)).toBe(35000);
  });

  it('할인 전 원래 가격 역산: 30% 할인된 판매가 35000이면 원가 50000', () => {
    expect(calcOriginalPriceFromDiscount(35000, 30)).toBe(50000);
  });
});
