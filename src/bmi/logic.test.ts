import { describe, expect, it } from 'vitest';
import { calcBmi, classifyBmi } from './logic';

describe('BMI 계산', () => {
  it('170cm, 65kg → BMI 22.49, 정상', () => {
    const bmi = calcBmi(170, 65);
    expect(bmi).toBeCloseTo(22.49, 2);
    expect(classifyBmi(bmi)).toBe('정상');
  });

  it('160cm, 45kg → BMI 17.58, 저체중', () => {
    const bmi = calcBmi(160, 45);
    expect(bmi).toBeCloseTo(17.58, 2);
    expect(classifyBmi(bmi)).toBe('저체중');
  });

  it('경계값 18.5는 정상', () => {
    expect(classifyBmi(18.5)).toBe('정상');
  });

  it('경계값 23은 과체중', () => {
    expect(classifyBmi(23)).toBe('과체중');
  });

  it('경계값 25는 비만', () => {
    expect(classifyBmi(25)).toBe('비만');
  });

  it('경계값 30은 고도비만', () => {
    expect(classifyBmi(30)).toBe('고도비만');
  });

  it('키가 0이면 계산 결과가 유한하지 않다 (UI에서 별도로 막아야 함)', () => {
    expect(Number.isFinite(calcBmi(0, 65))).toBe(false);
  });

  it('소수 입력도 정확히 계산한다', () => {
    const bmi = calcBmi(170.5, 65.3);
    expect(bmi).toBeCloseTo(22.46, 2);
  });
});
