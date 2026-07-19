// 사이트 기본 정보를 한 곳에 모아두는 참고용 파일.
//
// 주의: 이 값들은 percent/index.html, index.html의 title/description/canonical/OG,
// public/sitemap.xml, public/robots.txt에 "자동으로" 반영되지 않는다.
// 각 정적 HTML 파일은 SEO를 위해 값을 직접 문자열로 작성해두었기 때문이다.
// baseUrl 등을 바꿀 때 반드시 함께 수정해야 하는 파일 목록은 README.md의
// "사이트 주소를 바꿀 때 수정해야 하는 파일" 항목을 참고할 것.
export const siteConfig = {
  name: '계산해보롱',
  nameEn: 'CalcHaeborong',
  slogan: '필요한 계산을 빠르게',
  subCopy: '간단하게 계산해보롱',
  baseUrl: 'https://gyesanhaeborong.vercel.app',
  locale: 'ko-KR',
  country: 'KR',
} as const;
