// BMI(체질량지수) 계산 로직. 브라우저 API를 사용하지 않는 순수 함수만 둔다.
export type BmiCategory = '저체중' | '정상' | '과체중' | '비만' | '고도비만';

/** BMI = 몸무게(kg) / 키(m)^2. 소수 둘째 자리에서 반올림한 원시 수치를 반환한다(표시는 첫째 자리까지). */
export function calcBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 100) / 100;
}

/**
 * 계산해보롱 서비스 기준 BMI 구간 분류.
 * 대한민국 성인 기준으로 서비스에서 자체적으로 정한 구간이며, 의학적 진단 기준이 아니다.
 * - 18.5 미만: 저체중
 * - 18.5 이상 23 미만: 정상
 * - 23 이상 25 미만: 과체중
 * - 25 이상 30 미만: 비만
 * - 30 이상: 고도비만
 */
export function classifyBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '비만';
  return '고도비만';
}
