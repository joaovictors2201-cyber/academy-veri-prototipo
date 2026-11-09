import { ReactNode } from 'react';
import { Central, Screen } from './useCentral';
import { s } from './ui';

const LOGO_L = import.meta.env.BASE_URL + 'assets/logo-veri-academy-light.png';

export function Sso({ c: _c }: { c: Central }) {
  const c = _c;
  const check = (txt: string) => (
    <div style={s('display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,.8)')}>
      <span style={s('width:18px;height:18px;border-radius:50%;background:#1FBE7A;color:#04250F;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center')}>✓</span>{txt}
    </div>
  );
  return (
    <div style={s('min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(1100px 620px at 50% -10%,#0B2454 0%,#0B2454 55%,#0B2454 100%)')}>
      <div style={s('width:520px;padding:52px 48px;border-radius:24px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);text-align:center;animation:veriUp .5s ease both')}>
        <img src={LOGO_L} alt="VERI Academy" style={s('height:34px;margin-bottom:38px')} />
        <div style={s('width:54px;height:54px;margin:0 auto 26px;border-radius:50%;border:3px solid rgba(255,255,255,.18);border-top-color:#fff;animation:veriSpin .9s linear infinite')} />
        <div style={s('font-size:11px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.72);margin-bottom:12px')}>ACESSO SEGURO · SSO</div>
        <div style={s('font-size:23px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:10px')}>Entrando via Portal VERI</div>
        <div style={s('font-size:14px;line-height:1.65;color:rgba(255,255,255,.62);max-width:360px;margin:0 auto 30px')}>Validando seu acesso e recuperando seu histórico individual de trilhas. Você não precisa criar uma nova senha.</div>
        <div style={s('display:flex;flex-direction:column;gap:9px;text-align:left;max-width:330px;margin:0 auto 32px')}>
          {check('Identidade do usuário confirmada')}
          {c.user ? check('Escritório vinculado: ' + (c.user.empresa || c.user.email)) : check('Verificando seu e-mail na lista de acessos')}
          <div style={s('display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,.55)')}>
            <span style={s('width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;animation:veriSpin .9s linear infinite')} />Carregando progresso das trilhas
          </div>
        </div>
      </div>
    </div>
  );
}

const icon = (d: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
export const navDef: { id: Screen; label: string; icon: ReactNode; badge?: number }[] = [
  { id: 'inicio', label: 'Início', icon: icon(<path d="M3 9.6 12 3l9 6.6V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />) },
  { id: 'trilhas', label: 'Tutoriais', icon: icon(<><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M15.5 11.2 21 8.4v7.2l-5.5-2.8z" /></>) },
  { id: 'metodologia', label: 'Metodologia', icon: icon(<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z" /><path d="M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5" /></>) },
  { id: 'operacao', label: 'Operação', icon: icon(<><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="m8 9 1.6 1.6L12.5 7.5M8 15l1.6 1.6 2.9-3.1M14.5 9.5H17M14.5 15.5H17" /></>) },
  { id: 'resultados', label: 'Resultados', icon: icon(<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>) },
  { id: 'intranet', label: 'Intranet', icon: icon(<><circle cx="9" cy="8.5" r="3.2" /><path d="M3 20c.4-3.4 2.8-5.4 6-5.4s5.6 2 6 5.4" /><circle cx="17.5" cy="9.5" r="2.4" /><path d="M16.5 14.8c2.6-.2 4.4 1.3 4.8 4.2" /></>) },
  { id: 'notificacoes', label: 'Notificações', icon: icon(<><path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 1.8 5.8 1.8 5.8H4.2S6 14 6 9.5" /><path d="M10.2 19.3a2 2 0 0 0 3.6 0" /></>) },
  { id: 'config', label: 'Configurações', icon: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.1 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a1.9 1.9 0 1 1-3.8 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1h-.2a1.9 1.9 0 1 1 0-3.8h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.2a1.9 1.9 0 1 1 3.8 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a1.9 1.9 0 1 1 0 3.8h-.1a1.6 1.6 0 0 0-1.5 1z" /></>) },
];

