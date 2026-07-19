// 퍼센트 계산기의 순수 계산 함수 모음.
// 브라우저 API를 사용하지 않고 숫자만 받아 숫자를 반환한다.
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** A는 B의 몇 %인가 */
export function calcAIsPercentOfB(a: number, b: number): number {
  return round2((a / b) * 100);
}

/** B의 A%는 얼마인가 */
export function calcPercentOfB(a: number, b: number): number {
  return round2(b * (a / 100));
}

/** 기준값에서 N% 증가한 값 */
export function calcIncrease(base: number, percent: number): number {
  return round2(base * (1 + percent / 100));
}

/** 기준값에서 N% 감소한 값 */
export function calcDecrease(base: number, percent: number): number {
  return round2(base * (1 - percent / 100));
}

/** 이전 값에서 이후 값으로 변할 때의 증감률(%) */
export function calcChangeRate(before: number, after: number): number {
  return round2(((after - before) / before) * 100);
}

/** 정가에서 할인율을 적용한 판매가 */
export function calcDiscountedPrice(originalPrice: number, discountPercent: number): number {
  return round2(originalPrice * (1 - discountPercent / 100));
}

/** 할인된 판매가로부터 역산한 원래 가격(정가) */
export function calcOriginalPriceFromDiscount(discountedPrice: number, discountPercent: number): number {
  return round2(discountedPrice / (1 - discountPercent / 100));
}

/** 기준값의 N%에 해당하는 금액(증가/감소/할인 금액 표시에 공통으로 사용) */
export function calcAmountFromPercent(base: number, percent: number): number {
  return round2(base * (percent / 100));
}
