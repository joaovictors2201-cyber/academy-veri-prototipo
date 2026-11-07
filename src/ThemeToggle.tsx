import { Theme } from './themes';

const SOL = [[12, 4.2, 12, 2.6], [12, 19.8, 12, 21.4], [4.2, 12, 2.6, 12], [19.8, 12, 21.4, 12], [6.5, 6.5, 5.4, 5.4], [17.5, 17.5, 18.6, 18.6], [6.5, 17.5, 5.4, 18.6], [17.5, 6.5, 18.6, 5.4]];

const Sun = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3.6" />
    {SOL.map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}
  </svg>
);
const Moon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8z" />
  </svg>
);

/** Alternador claro/escuro (sol à esquerda, lua à direita), no estilo da referência. */
export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === 'dark';
  const box = dark ? { bg: '#050817', bd: '#141A33', seg: '#2E3A5F', on: '#FFFFFF', off: '#8E9BB5' } : { bg: '#F7FAFF', bd: '#E3E9F4', seg: '#E1E6EE', on: '#0B1020', off: '#8FA3BD' };
  return (
    <button
      type="button" role="switch" aria-checked={dark} aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'} onClick={onToggle} data-tour="theme"
      style={{ position: 'relative', width: 96, height: 46, flex: 'none', padding: 0, borderRadius: 23, border: `1px solid ${box.bd}`, background: box.bg, cursor: 'pointer', transition: 'background .25s, border-color .25s', display: 'block' }}
    >
      <span style={{ position: 'absolute', top: 4, left: dark ? 50 : 4, width: 40, height: 36, borderRadius: 18, background: box.seg, transition: 'left .25s ease, background .25s' }} />
      <span style={{ position: 'absolute', top: 4, left: 4, width: 40, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sun color={dark ? box.off : box.on} /></span>
      <span style={{ position: 'absolute', top: 4, left: 50, width: 40, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Moon color={dark ? box.on : box.off} /></span>
    </button>
  );
}
