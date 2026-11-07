import { CSSProperties, ReactNode } from 'react';
import { Cat, themeValue } from './themes';

/** Cor (do tema claro) já convertida para variável do tema — para usos fora de s(), como atributos SVG. */
export const tv = (hex: string, cat: Cat) => themeValue(hex, cat);

const cache = new Map<string, CSSProperties>();
/** Converte uma string CSS ("a-b:1px;c:d") em objeto de estilo do React (com cache). */
export function s(css: string): CSSProperties {
  let o = cache.get(css);
  if (!o) {
    o = {};
    for (const decl of css.split(';')) {
      const i = decl.indexOf(':');
      if (i < 0) continue;
      const prop = decl.slice(0, i).trim();
      const k = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      let val = decl.slice(i + 1).trim();
      if (prop === 'color' || prop === 'fill' || prop === 'stroke') val = themeValue(val, 'fg');
      else if (prop === 'background' || prop === 'background-color') val = themeValue(val, 'bg');
      else if (prop.startsWith('border')) val = themeValue(val, 'bd');
      (o as Record<string, string>)[k] = val;
    }
    cache.set(css, o);
  }
  return o;
}

export const Bar = ({ pct, track = '#EEF1F6', fill = '#0B2454', h = 6 }: { pct: string; track?: string; fill?: string; h?: number }) => (
  <div style={s(`height:${h}px;border-radius:100px;background:${track};overflow:hidden`)}>
    <div style={{ height: '100%', borderRadius: 100, background: fill, width: pct }} />
  </div>
);

export const Card = ({ children, style = '', pad = '24px 26px', radius = 18 }: { children: ReactNode; style?: string; pad?: string; radius?: number }) => (
  <div style={s(`background:#fff;border:1px solid #E9ECF3;border-radius:${radius}px;padding:${pad};${style}`)}>{children}</div>
);

export const Pill = ({ on, label, onClick, big }: { on: boolean; label: string; onClick: () => void; big?: boolean }) => (
  <div onClick={onClick} style={{ cursor: 'pointer' }}>
    {on
      ? <div style={s(`padding:${big ? '9px 17px' : '8px 15px'};border-radius:100px;background:#0B2454;color:#fff;font-size:${big ? 13 : 12.5}px;font-weight:700`)}>{label}</div>
      : <div style={s(`padding:${big ? '9px 17px' : '8px 15px'};border-radius:100px;background:#fff;border:1px solid #E5E8F0;color:#5B6478;font-size:${big ? 13 : 12.5}px;font-weight:600`)}>{label}</div>}
  </div>
);

export const Eyebrow = ({ children, color = 'rgba(255,255,255,.72)', mb = 10 }: { children: ReactNode; color?: string; mb?: number }) => (
  <div style={s(`font-size:10px;letter-spacing:.18em;font-weight:700;color:${color};margin-bottom:${mb}px`)}>{children}</div>
);

export const PageTitle = ({ title, sub, mb = 22 }: { title: string; sub: string; mb?: number }) => (
  <>
    <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>{title}</div>
    <div style={s(`font-size:13.5px;color:#7A8398;margin-bottom:${mb}px`)}>{sub}</div>
  </>
);

export const palette = {
  doneBg: '#DCFCE7', doneFg: '#0B6B3F', blueBg: '#EEF1F6', blue: '#0B2454', greyBg: '#F1F3F8', greyFg: '#7A8398', green: '#12B76A',
};

export const statusStyle = (full: boolean, started: boolean) => ({
  bg: full ? palette.doneBg : started ? palette.blueBg : palette.greyBg,
  fg: full ? palette.doneFg : started ? palette.blue : palette.greyFg,
});
