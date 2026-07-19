# 계산해보롱 (CalcHaeborong)

회원가입과 로그인 없이 누구나 바로 쓸 수 있는 무료 계산기 사이트입니다.
이 저장소는 **첫 번째 계산기(퍼센트 계산기) 하나를 완성해서 실제로 검색에 노출시키는 것**을 목표로 하는 MVP입니다.

- 서버 없음, DB 없음, API 없음 — 모든 계산은 브라우저에서만 처리됩니다.
- 페이지는 딱 2개입니다: `/`(홈), `/percent/`(퍼센트 계산기).
- React Router 같은 라우팅 라이브러리를 쓰지 않고, Vite의 멀티 페이지(Multi-Page) 빌드 기능만 사용합니다.

---

## 1. 시작하기 전에 (Node.js 설치)

이 프로젝트는 Node.js가 필요합니다.

1. [nodejs.org](https://nodejs.org)에서 **LTS 버전**을 설치합니다. (또는 Windows는 `winget install OpenJS.NodeJS.LTS`)
2. 설치 후 터미널에서 아래 명령으로 정상 설치를 확인합니다.

```bash
node -v
npm -v
```

버전이 출력되면 준비가 끝났습니다.

## 2. 프로젝트 설치 및 실행

```bash
# 1) 의존성 설치 (최초 1회, 또는 package.json이 바뀔 때마다)
npm install

# 2) 개발 서버 실행 (코드를 수정하면 브라우저가 자동으로 새로고침됩니다)
npm run dev
```

`npm run dev` 실행 후 터미널에 나오는 주소(보통 `http://localhost:5173`)로 접속하면 홈 화면이 보이고,
`http://localhost:5173/percent/`로 접속하면 퍼센트 계산기가 보입니다.

## 3. 그 밖의 명령어

| 명령어 | 설명 |
|---|---|
| `npm run build` | 배포용 정적 파일을 `dist/` 폴더에 생성합니다. |
| `npm run preview` | 방금 만든 `dist/` 결과물을 로컬에서 미리 봅니다. |
| `npm run typecheck` | TypeScript 타입 오류가 있는지만 검사합니다 (파일을 만들지 않음). |
| `npm test` | `logic.test.ts`의 계산 로직 테스트를 실행합니다. |
| `npm run verify-build` | **`npm run build` 이후에** 실행. `dist/index.html`, `dist/percent/index.html`에 SEO 태그(title/description/canonical/OG/JSON-LD)와 핵심 콘텐츠가 실제로 들어있는지 검사하고, 빠진 게 있으면 에러로 종료합니다. |

## 4. 폴더 구조

```
계산해보롱/
├── index.html              # 홈 화면 (정적 HTML, SEO 태그 직접 작성)
├── percent/
│   └── index.html          # 퍼센트 계산기 페이지 (정적 콘텐츠 + SEO 태그 직접 작성)
│
├── src/
│   ├── siteConfig.ts        # 사이트 이름/슬로건/baseUrl (참고용 — 아래 5번 항목 필독)
│   ├── theme.ts              # 다크모드 토글 로직 (React 아님, 순수 TS)
│   ├── styles/
│   │   ├── tokens.css        # 색상/폰트/여백을 CSS 변수로 정의 (라이트/다크)
│   │   └── globals.css       # 레이아웃과 컴포넌트 스타일
│   ├── components/
│   │   ├── NumberField.tsx   # 숫자 입력창
│   │   ├── ResultCard.tsx    # 결과 표시 카드
│   │   ├── TabBar.tsx        # 탭 버튼 묶음
│   │   └── PlaceholderBox.tsx # 보롱이 캐릭터 자리 표시 (점선 박스 + 텍스트만)
│   ├── home/
│   │   └── main.ts           # 홈 화면 진입점 (다크모드 토글만 연결, React 없음)
│   └── percent/
│       ├── main.tsx          # 퍼센트 계산기 진입점 (React를 #calculator-root에만 mount)
│       ├── Percent.tsx        # 계산기 화면 (탭 7개 + 입력 + 결과)
│       ├── logic.ts           # 순수 계산 함수 7개 (브라우저 API 사용 안 함)
│       └── logic.test.ts      # logic.ts에 대한 Vitest 테스트
│
├── public/
│   ├── favicon.svg
│   ├── robots.txt            # 직접 작성 (자동 생성 아님)
│   └── sitemap.xml           # 직접 작성 (페이지가 2개뿐이라 자동 생성 스크립트를 만들지 않음)
│
├── scripts/
│   └── verify-build.mjs      # 빌드 후 SEO 태그/콘텐츠 검증 스크립트
│
├── vite.config.ts            # Vite 멀티 페이지 설정 (index.html + percent/index.html)
├── tsconfig.json
└── package.json
```

## 5. 사이트 주소(baseUrl)를 바꿀 때 반드시 수정해야 하는 파일

**중요: `src/siteConfig.ts`의 `baseUrl` 하나만 고친다고 사이트 전체에 자동으로 반영되지 않습니다.**
이 프로젝트는 SEO 태그를 정적 HTML에 직접 적어두는 방식이라, `siteConfig.ts`는 "현재 값이 무엇인지 기록해두는 참고 파일"일 뿐입니다.

실제 도메인이 정해지면(예: Vercel이 자동으로 준 주소를 실제 도메인으로 바꿀 때) 아래 파일들을 **사람이 직접, 전부** 고쳐야 합니다.

- [ ] `src/siteConfig.ts` — `baseUrl` 값
- [ ] `index.html` — `<link rel="canonical">`, `<meta property="og:url">`
- [ ] `percent/index.html` — `<link rel="canonical">`, `<meta property="og:url">`, `FAQPage`/`BreadcrumbList` JSON-LD 안의 URL
- [ ] `public/sitemap.xml` — `<loc>` 두 곳
- [ ] `public/robots.txt` — `Sitemap:` 줄
- [ ] `scripts/verify-build.mjs` — 맨 위 `BASE_URL` 상수

이 목록에 없는 곳에 URL이 하드코딩되어 있지 않은지 `그 도메인 문자열`로 전체 검색(`grep`)해서 한 번 더 확인하는 것을 권장합니다.

## 6. 정적 콘텐츠와 React의 관계

`percent/index.html`은 다음 순서로 구성되어 있습니다.

1. `<h1>`, 소개 문단, 지원 기능 요약, 계산 공식 7개(`<details>`), FAQ(`<details>`) — **전부 정적 HTML**. 자바스크립트가 꺼져 있어도 그대로 보입니다.
2. `<div id="calculator-root"></div>` — 이 자리에만 React가 mount됩니다. React는 탭 전환, 입력, 실시간 결과 계산처럼 상호작용이 필요한 부분만 담당합니다.

즉, 자바스크립트가 켜지면 `calculator-root` 안에 계산기 UI가 나타나고, 그 위아래의 정적 설명·공식·FAQ는 그대로 유지됩니다. 페이지 전체를 React가 덮어쓰지 않습니다.

## 7. 앞으로 계산기를 추가하는 방법 (예시 — 아직 구현 안 됨)

이번 MVP는 계산기 자동 등록이나 공용 레지스트리 구조를 만들지 않았습니다. 계산기가 1개뿐이라 그런 구조가 오히려 과도한 복잡함이 되기 때문입니다.
나중에 BMI 계산기를 추가한다면, `src/percent/` 폴더와 동일한 패턴으로 아래처럼 만들면 됩니다.

```
bmi/
└── index.html          # BMI 계산기 정적 HTML (제목/설명/공식/FAQ 직접 작성 + SEO 태그)

src/bmi/
├── main.tsx             # React를 #calculator-root에 mount
├── Bmi.tsx               # 화면 컴포넌트
├── logic.ts              # 순수 계산 함수
└── logic.test.ts
```

그리고 `vite.config.ts`의 `rollupOptions.input`에 `bmi: resolve(__dirname, 'bmi/index.html')` 한 줄을 추가하고, `public/sitemap.xml`에 URL 한 줄, 홈 화면의 "앞으로 추가될 계산기" 칩을 실제 링크로 바꿔주면 됩니다.

계산기가 5개, 10개로 늘어나서 이 작업이 반복되어 번거로워지면, 그때 레지스트리 자동화 구조를 다시 설계합니다(v2).

## 8. 배포 절차 (GitHub → Vercel → Google Search Console)

**주의: 아래 단계는 사용자 계정과 외부 서비스를 다루는 작업이라, AI가 대신 실행하지 않습니다. 사람이 직접 진행합니다.**

1. **GitHub**
   - GitHub에서 새 저장소를 만듭니다 (예: `calc-haeborong`).
   - 로컬에서 `git init`, `git add`, `git commit`, `git remote add origin ...`, `git push`로 업로드합니다.
2. **Vercel**
   - [vercel.com](https://vercel.com)에서 방금 만든 GitHub 저장소를 Import 합니다.
   - Framework Preset은 Vite로 자동 인식됩니다. Build Command는 `npm run build`, Output Directory는 `dist`입니다.
   - 배포가 끝나면 `https://프로젝트이름.vercel.app` 형태의 주소가 생깁니다.
   - 이 주소가 `src/siteConfig.ts`의 `baseUrl`과 다르다면, 위 5번 목록의 모든 파일을 실제 주소로 업데이트한 뒤 다시 배포합니다.
3. **Google Search Console**
   - [search.google.com/search-console](https://search.google.com/search-console)에 실제 배포 주소를 속성으로 등록합니다.
   - 소유권 확인(HTML 태그 또는 DNS 방식)을 진행합니다.
   - "Sitemaps" 메뉴에서 `sitemap.xml`을 제출합니다 (예: `https://프로젝트이름.vercel.app/sitemap.xml`).
   - 등록 후 실제 색인·검색 노출까지는 며칠~몇 주가 걸릴 수 있습니다.

## 9. 디자인 원칙 요약

- 무채색 베이스 + 포인트 컬러 1개(코랄), 네온/그라데이션/글래스모피즘/과한 그림자/화려한 애니메이션 없음
- 모바일 퍼스트, 큰 입력창(56px), 큰 결과 숫자
- 보롱이(장모치와와) 캐릭터는 아직 제작 전이라 실제 이미지 대신 점선 박스 + "Borong Mascot Area" 텍스트로만 자리를 확보
- 다크모드는 `data-theme` 속성 + CSS 변수 방식 (라이브러리 없음)

## 10. 향후 계획 (이번 MVP에는 포함하지 않음)

- PWA(웹 앱 매니페스트, 오프라인 캐싱, 홈 화면 설치)
- Capacitor를 이용한 Android/iOS 앱 전환
- 계산기 자동 등록/레지스트리 구조, 계산기 10개 이상으로 확장
- 실제 AdSense/Google Analytics 코드 삽입 (현재는 광고 자리만 확보된 상태)
