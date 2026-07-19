// 다크모드 토글 — React가 필요 없는 아주 단순한 상호작용이라 순수 TypeScript로 작성한다.
// data-theme 값은 localStorage에 저장해 다음 방문 때도 유지한다.
const STORAGE_KEY = 'calchaeborong-theme';

function isDarkActive(): boolean {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateLabel(button: HTMLElement): void {
  const dark = isDarkActive();
  // aria-label을 따로 두지 않고, 화면에 보이는 텍스트를 그대로 접근성 이름으로 사용한다.
  button.textContent = dark ? '라이트 모드' : '다크 모드';
  button.setAttribute('aria-pressed', String(dark));
}

export function initThemeToggle(buttonId: string): void {
  const button = document.getElementById(buttonId);
  if (!button) return;

  updateLabel(button);

  button.addEventListener('click', () => {
    const next = isDarkActive() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 프라이빗 브라우징 등으로 localStorage를 쓸 수 없어도 화면 전환 자체는 계속 동작해야 한다.
    }
    updateLabel(button);
  });
}
