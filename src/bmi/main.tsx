import { createRoot } from 'react-dom/client';
import { Bmi } from './Bmi';
import { initThemeToggle } from '../theme';

// 정적 HTML(H1/소개/공식/구간표/FAQ)은 그대로 두고,
// React는 상호작용이 필요한 계산기 영역(#calculator-root)에만 mount한다.
const calculatorRoot = document.getElementById('calculator-root');
if (calculatorRoot) {
  createRoot(calculatorRoot).render(<Bmi />);
}

initThemeToggle('theme-toggle');
