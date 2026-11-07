// Tema claro/escuro. Os estilos continuam escritos com as cores do tema claro; a função s() (ui.tsx)
// troca cada cor "conhecida" por uma variável CSS (var(--bg-xxxxxx, #xxxxxx)) conforme a propriedade
// (texto, fundo ou borda). Aqui ficam os valores do tema escuro. Cores sem entrada não mudam.
export type Cat = 'fg' | 'bg' | 'bd';

export const DARK: Record<Cat, Record<string, string>> = {
  bg: {
    ffffff: '111a2e', f6f7fb: '0b1120', f3f5fa: '1a2438', f2f6ff: '17264a', e8f0ff: '1a2b55', f1f3f8: '1c2639',
    eef1f6: '1f2a40', e5e8f0: '26324a', e9edf6: '1f2a40', f7f9fc: '152036', f8faff: '14203a', f1fbf5: '10281f',
    dcfce7: '123524', fff7de: '3a3114', fff1f0: '3a1b1b', fff7f6: '351a1a', f7f9ff: '152036', d6dbe6: '3a4560',
    '0b2454': '12295e', '0f172a': '2b3752',
  },
  bd: {
    e9ecf3: '223049', e5e8f0: '2a3650', f0f2f7: '1e2a40', eef1f6: '1e2a40', f5f7fa: '1b263b', d7e4ff: '2c4580',
    cfeedc: '1f5a3d', '9be3bc': '2a7a53', f3c3be: '7a2f2a', f5e2a3: '6b5a1f', c3c9d6: '3a4560', c6d4f5: '2c4580',
  },
  fg: {
    '0f172a': 'e8edf7', '39415a': 'c3cbdd', '2a3144': 'd2d9e8', '5b6478': 'a2adc4', '7a8398': '94a0b8',
    '8a93a6': '8a96ae', '9aa3b5': '7f8aa3', '0b2454': 'e8edf7', '0b6b3f': '6ee7a8',
    '7a5a00': 'f5d679', b42318: 'ff9c92', c3c9d6: '4a5570',
  },
};

const norm = (h: string) => (h.length === 3 ? h.split('').map(c => c + c).join('') : h).toLowerCase();

/** Troca as cores conhecidas de um valor CSS por variáveis do tema. */
export function themeValue(value: string, cat: Cat): string {
  return value.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m, h) => {
    const k = norm(h);
    return DARK[cat][k] ? `var(--${cat}-${k}, #${k})` : m;
  });
}

function buildCss(): string {
  let light = '', dark = '';
  (Object.keys(DARK) as Cat[]).forEach(cat => Object.entries(DARK[cat]).forEach(([k, v]) => {
    light += `--${cat}-${k}:#${k};`; dark += `--${cat}-${k}:#${v};`;
  }));
  return `:root,[data-theme="light"]{${light}color-scheme:light}[data-theme="dark"]{${dark}color-scheme:dark}`;
}

export type Theme = 'light' | 'dark';
const KEY = 'veri.theme';
export function initialTheme(): Theme {
  try { const t = localStorage.getItem(KEY); if (t === 'light' || t === 'dark') return t; } catch { /* sem storage */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* sem storage */ }
}
export function installTheme() {
  const el = document.createElement('style');
  el.id = 'veri-theme'; el.textContent = buildCss();
  document.head.appendChild(el);
  applyTheme(initialTheme());
}
