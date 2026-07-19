import { describe, expect, it } from 'vitest';
import {
  calculateAge,
  formatDateInputValue,
  isLeapYear,
  parseLocalDateInput,
  validateBirthNotFuture,
} from './logic';

describe('만나이 계산', () => {
  it('생일 전: 아직 나이를 안 먹었고, 다음 생일까지 며칠 남았는지 계산한다', () => {
    const result = calculateAge(new Date(1998, 5, 15), new Date(2026, 5, 1));
    expect(result.age).toBe(27);
    expect(result.hadBirthdayThisYear).toBe(false);
    expect(result.nextBirthday).toEqual(new Date(2026, 5, 15));
    expect(result.daysUntilNextBirthday).toBe(14);
  });

  it('생일 당일: 오늘 생일이 지난 것으로 처리하고 나이가 오른다', () => {
    const result = calculateAge(new Date(1998, 5, 15), new Date(2026, 5, 15));
    expect(result.age).toBe(28);
    expect(result.hadBirthdayThisYear).toBe(true);
    expect(result.nextBirthday).toEqual(new Date(2027, 5, 15));
    expect(result.daysUntilNextBirthday).toBe(365);
  });

  it('생일 후: 이미 생일이 지난 상태로 계산한다', () => {
    const result = calculateAge(new Date(1998, 5, 15), new Date(2026, 6, 1));
    expect(result.age).toBe(28);
    expect(result.hadBirthdayThisYear).toBe(true);
    expect(result.daysUntilNextBirthday).toBe(349);
  });

  it('같은 해 출생: 만 0세로 계산한다', () => {
    const result = calculateAge(new Date(2026, 2, 1), new Date(2026, 6, 20));
    expect(result.age).toBe(0);
    expect(result.hadBirthdayThisYear).toBe(true);
  });

  it('미래 생년월일: 기준일보다 미래면 오류 메시지를 반환한다', () => {
    expect(validateBirthNotFuture(new Date(2027, 0, 1), new Date(2026, 6, 20))).toBe(
      '생년월일은 기준일보다 이전이어야 해요',
    );
  });

  it('생년월일이 기준일보다 이전이면 오류가 없다', () => {
    expect(validateBirthNotFuture(new Date(1998, 5, 15), new Date(2026, 6, 20))).toBeNull();
  });

  it('2월 29일 출생자 · 기준일이 윤년이면 실제 2월 29일로 비교한다', () => {
    const result = calculateAge(new Date(2000, 1, 29), new Date(2028, 1, 29));
    expect(result.age).toBe(28);
    expect(result.hadBirthdayThisYear).toBe(true);
  });

  it('2월 29일 출생자 · 비윤년에는 2월 28일이 지나야 생일이 지난 것으로 본다 (생일 전)', () => {
    const result = calculateAge(new Date(2000, 1, 29), new Date(2026, 1, 27));
    expect(result.age).toBe(25);
    expect(result.hadBirthdayThisYear).toBe(false);
  });

  it('2월 29일 출생자 · 비윤년 2월 28일이 지나면 생일이 지난 것으로 본다', () => {
    const result = calculateAge(new Date(2000, 1, 29), new Date(2026, 2, 1));
    expect(result.age).toBe(26);
    expect(result.hadBirthdayThisYear).toBe(true);
  });

  it('연말과 연초 경계: 12월 31일 생일자를 1월 1일 기준으로 계산한다', () => {
    const result = calculateAge(new Date(1990, 11, 31), new Date(2026, 0, 1));
    expect(result.age).toBe(35);
    expect(result.hadBirthdayThisYear).toBe(false);
    expect(result.daysUntilNextBirthday).toBe(364);
  });

  it('윤년 판별이 정확하다', () => {
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
  });

  it('로컬 날짜 처리: "YYYY-MM-DD" 문자열이 시간대 영향 없이 그대로 파싱된다', () => {
    const date = parseLocalDateInput('2026-07-20');
    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(6);
    expect(date?.getDate()).toBe(20);
    expect(formatDateInputValue(date as Date)).toBe('2026-07-20');
  });

  it('존재하지 않는 날짜(2월 30일 등)는 유효하지 않은 것으로 처리한다', () => {
    expect(parseLocalDateInput('2026-02-30')).toBeNull();
    expect(parseLocalDateInput('not-a-date')).toBeNull();
  });
});
