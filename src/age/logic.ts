// 만나이 계산 로직. 브라우저 API(Date.now 등)를 직접 호출하지 않고,
// 항상 바깥에서 Date 값을 받아 계산하는 순수 함수로 작성한다.
export type AgeResult = {
  age: number;
  hadBirthdayThisYear: boolean;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
};

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * 2월 29일 생일자는 비윤년에는 2월 28일을 생일로 취급한다.
 * (계산해보롱 서비스 기준: 비윤년에는 2월 28일이 지나면 생일이 지난 것으로 처리)
 */
function observedBirthdayInYear(birthMonth: number, birthDay: number, year: number): Date {
  const day = birthMonth === 1 && birthDay === 29 && !isLeapYear(year) ? 28 : birthDay;
  return new Date(year, birthMonth, day);
}

export function calculateAge(birthDate: Date, referenceDate: Date): AgeResult {
  const birth = startOfDay(birthDate);
  const reference = startOfDay(referenceDate);
  const birthMonth = birth.getMonth();
  const birthDay = birth.getDate();

  const birthdayThisYear = observedBirthdayInYear(birthMonth, birthDay, reference.getFullYear());
  const hadBirthdayThisYear = birthdayThisYear.getTime() <= reference.getTime();

  const age = reference.getFullYear() - birth.getFullYear() - (hadBirthdayThisYear ? 0 : 1);

  const nextBirthdayYear = hadBirthdayThisYear ? reference.getFullYear() + 1 : reference.getFullYear();
  const nextBirthday = observedBirthdayInYear(birthMonth, birthDay, nextBirthdayYear);
  const daysUntilNextBirthday = Math.round((nextBirthday.getTime() - reference.getTime()) / (24 * 60 * 60 * 1000));

  return { age, hadBirthdayThisYear, nextBirthday, daysUntilNextBirthday };
}

/**
 * "YYYY-MM-DD" 형식의 문자열(HTML date input 값)을 로컬 타임존 기준 Date로 변환한다.
 * new Date(문자열)은 UTC 자정으로 해석되어 타임존에 따라 하루가 밀리는 버그가 생길 수 있어
 * 반드시 연/월/일을 직접 분해해 로컬 Date 생성자로 만든다.
 */
export function parseLocalDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // new Date(2024, 1, 30)처럼 실제로 없는 날짜는 다음 달로 넘어가버리므로,
  // 되돌아온 값이 입력과 다르면 유효하지 않은 날짜로 처리한다.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** date input에 넣을 "YYYY-MM-DD" 문자열 (로컬 타임존 기준). */
export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 결과 표시용 "YYYY년 M월 D일" 문자열. */
export function formatDisplayDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 생년월일이 기준일보다 미래이면 에러 메시지를 반환한다. */
export function validateBirthNotFuture(birthDate: Date, referenceDate: Date): string | null {
  if (birthDate.getTime() > referenceDate.getTime()) {
    return '생년월일은 기준일보다 이전이어야 해요';
  }
  return null;
}
