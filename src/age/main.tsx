import { createRoot } from 'react-dom/client';
import { Age } from './Age';
import { initThemeToggle } from '../theme';

const calculatorRoot = document.getElementById('calculator-root');
if (calculatorRoot) {
  createRoot(calculatorRoot).render(<Age />);
}

initThemeToggle('theme-toggle');
