// 빌드 결과(dist)에 SEO에 필요한 태그와 정적 콘텐츠가 실제로 들어있는지 확인하는 스크립트.
// npm run build 이후 `node scripts/verify-build.mjs`로 실행한다.
//
// 주의: 아래 BASE_URL은 percent/index.html, index.html, public/sitemap.xml, public/robots.txt,
// src/siteConfig.ts에 적힌 값과 사람이 직접 맞춰줘야 한다 (자동 동기화 아님).
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = 'https://gyesanhaeborong.vercel.app';
const DIST_DIR = resolve(process.cwd(), 'dist');

let hasError = false;

function fail(file, message) {
  hasError = true;
  console.error(`[verify-build] FAIL (${file}): ${message}`);
}

function ok(file, message) {
  console.log(`[verify-build] OK   (${file}): ${message}`);
}

function readDistFile(relativePath) {
  const fullPath = resolve(DIST_DIR, relativePath);
  if (!existsSync(fullPath)) {
    fail(relativePath, `파일이 존재하지 않습니다 (${fullPath})`);
    return null;
  }
  return readFileSync(fullPath, 'utf-8');
}

function checkCommonSeo(relativePath, html, expectedCanonical) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (titleMatch && titleMatch[1].trim() !== '') {
    ok(relativePath, `title = "${titleMatch[1].trim()}"`);
  } else {
    fail(relativePath, 'title 태그가 없거나 비어 있습니다');
  }

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/);
  if (descMatch && descMatch[1].trim() !== '') {
    ok(relativePath, 'meta description 존재');
  } else {
    fail(relativePath, 'meta description이 없거나 비어 있습니다');
  }

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/);
  if (!canonicalMatch) {
    fail(relativePath, 'canonical 링크가 없습니다');
  } else if (canonicalMatch[1] !== expectedCanonical) {
    fail(relativePath, `canonical이 예상 값과 다릅니다 (실제: ${canonicalMatch[1]}, 예상: ${expectedCanonical})`);
  } else {
    ok(relativePath, `canonical = ${canonicalMatch[1]}`);
  }

  const ogTitle = /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/.test(html);
  const ogDescription = /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/.test(html);
  if (ogTitle && ogDescription) {
    ok(relativePath, 'og:title, og:description 존재');
  } else {
    fail(relativePath, 'og:title 또는 og:description이 없습니다');
  }

  const twitterCard = /<meta\s+name=["']twitter:card["']\s+content=["'][^"']*["']/.test(html);
  if (twitterCard) {
    ok(relativePath, 'twitter:card 존재');
  } else {
    fail(relativePath, 'twitter:card가 없습니다');
  }
}

function checkJsonLd(relativePath, html, requiredTypes) {
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );

  for (const type of requiredTypes) {
    const found = scripts.some((script) => script.includes(`"@type": "${type}"`) || script.includes(`"@type":"${type}"`));
    if (found) {
      ok(relativePath, `JSON-LD "${type}" 존재`);
    } else {
      fail(relativePath, `JSON-LD "${type}"를 찾을 수 없습니다`);
    }
  }
}

function checkVisibleContent(relativePath, html, checks) {
  for (const [label, pattern] of checks) {
    if (pattern.test(html)) {
      ok(relativePath, `${label} 콘텐츠 존재`);
    } else {
      fail(relativePath, `${label} 콘텐츠를 찾을 수 없습니다`);
    }
  }
}

// 1) 홈 화면
const homeHtml = readDistFile('index.html');
if (homeHtml) {
  checkCommonSeo('index.html', homeHtml, `${BASE_URL}/`);
}

// 2) 퍼센트 계산기
const percentHtml = readDistFile('percent/index.html');
if (percentHtml) {
  checkCommonSeo('percent/index.html', percentHtml, `${BASE_URL}/percent/`);
  checkJsonLd('percent/index.html', percentHtml, ['FAQPage', 'BreadcrumbList']);
  checkVisibleContent('percent/index.html', percentHtml, [
    ['H1', /<h1[^>]*>[^<]*퍼센트 계산기[^<]*<\/h1>/],
    ['소개 문단', /class="intro-copy"/],
    ['지원 기능 요약', /class="supported-box"/],
    ['계산 공식과 예시', /class="formula-section"/],
    ['FAQ', /class="faq-section"/],
  ]);
}

// 3) BMI 계산기
const bmiHtml = readDistFile('bmi/index.html');
if (bmiHtml) {
  checkCommonSeo('bmi/index.html', bmiHtml, `${BASE_URL}/bmi/`);
  checkJsonLd('bmi/index.html', bmiHtml, ['FAQPage', 'BreadcrumbList']);
  checkVisibleContent('bmi/index.html', bmiHtml, [
    ['H1', /<h1[^>]*>BMI 계산기<\/h1>/],
    ['BMI 구간표', /class="bmi-range-table"/],
    ['계산 예시', /class="formula-section"/],
    ['FAQ', /class="faq-section"/],
  ]);
}

// 4) 만나이 계산기
const ageHtml = readDistFile('age/index.html');
if (ageHtml) {
  checkCommonSeo('age/index.html', ageHtml, `${BASE_URL}/age/`);
  checkJsonLd('age/index.html', ageHtml, ['FAQPage', 'BreadcrumbList']);
  checkVisibleContent('age/index.html', ageHtml, [
    ['H1', /<h1[^>]*>만나이 계산기<\/h1>/],
    ['한국식 나이 차이 설명', /id="korean-age-heading"/],
    ['윤년 안내', /id="leap-heading"/],
    ['FAQ', /class="faq-section"/],
  ]);
}

// 5) sitemap.xml / robots.txt
const sitemapXml = readDistFile('sitemap.xml');
if (sitemapXml) {
  const expectedUrls = ['/', '/percent/', '/bmi/', '/age/'].map((path) => `${BASE_URL}${path}`);
  for (const url of expectedUrls) {
    if (sitemapXml.includes(`<loc>${url}</loc>`)) {
      ok('sitemap.xml', `${url} 포함`);
    } else {
      fail('sitemap.xml', `${url}이(가) 없습니다`);
    }
  }
}

const robotsTxt = readDistFile('robots.txt');
if (robotsTxt) {
  if (robotsTxt.includes(`${BASE_URL}/sitemap.xml`)) {
    ok('robots.txt', 'Sitemap 주소 존재');
  } else {
    fail('robots.txt', 'Sitemap 주소가 없거나 실제 도메인과 다릅니다');
  }
}

if (hasError) {
  console.error('\n[verify-build] 실패한 항목이 있습니다. 위 로그를 확인하세요.');
  process.exit(1);
}

console.log('\n[verify-build] 모든 검사를 통과했습니다.');
