import { ReactNode, useState } from 'react';
import { Central, Screen } from './useCentral';
import { iniciais, papelLabel } from './data';
import { s } from './ui';
import { ThemeToggle } from './ThemeToggle';
import { GuidedTour } from './GuidedTour';
import { navDef } from './Shell';

const LOGO_L = import.meta.env.BASE_URL + 'assets/logo-veri-academy-light.png';

const crumbs: Partial<Record<Screen, string>> = { metodologia: 'Metodologia', operacao: 'Operação', resultados: 'Resultados', intranet: 'Intranet', inicio: 'Visão geral', trilhas: 'Tutoriais', quiz: 'Checkpoint', perfil: 'Meu perfil', certificado: 'Certificado', notificacoes: 'Notificações', config: 'Configurações' };

export function Login({ c }: { c: Central }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const codeStep = c.loginStep === 'code';
  const submit = () => {
    if (c.loginBusy) return;
    if (codeStep) { if (code.replace(/\D/g, '').length === 6) c.verifyCode(code); } else if (email.trim()) c.login(email.trim());
  };
  const ready = codeStep ? code.replace(/\D/g, '').length === 6 : !!email.trim();
  return (
    <div style={s('min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(1100px 620px at 50% -10%,#0B2454 0%,#0B2454 55%,#0B2454 100%)')}>
      <div style={s('width:480px;padding:48px 44px;border-radius:24px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);animation:veriUp .5s ease both')}>
        <img src={LOGO_L} alt="VERI Academy" style={s('height:32px;margin-bottom:34px')} />
        <div style={s('font-size:11px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.72);margin-bottom:12px')}>CENTRAL DE APRENDIZAGEM</div>
        <div style={s('font-size:24px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:10px')}>{codeStep ? 'Digite o código' : 'Acesse com o seu e-mail'}</div>
        <div style={s('font-size:14px;line-height:1.65;color:rgba(255,255,255,.62);margin-bottom:26px')}>{codeStep ? `Se ${c.loginEmail} estiver liberado, enviamos um código de 6 dígitos para esse e-mail. Ele vale por 10 minutos.` : 'Demonstração: digite qualquer e-mail para entrar como colaborador do Comercial. Nenhum dado real é usado.'}</div>
        {!codeStep && <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} type="email" autoFocus placeholder="colaborador@veri.com.br" autoComplete="email"
          style={s('width:100%;padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff;font-size:14.5px;outline:none;margin-bottom:14px')} />}
        {codeStep && <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} onKeyDown={e => { if (e.key === 'Enter') submit(); }} inputMode="numeric" autoFocus placeholder="000000" autoComplete="one-time-code" aria-label="Código de 6 dígitos"
          style={{ ...s('width:100%;padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff;font-size:26px;font-weight:700;outline:none;margin-bottom:14px;text-align:center'), letterSpacing: '0.4em' }} />}
        {c.loginError && <div style={s('padding:12px 14px;border-radius:10px;background:rgba(239,106,90,.16);border:1px solid rgba(239,106,90,.4);color:#FFD2CC;font-size:13px;line-height:1.55;margin-bottom:14px')}>{c.loginError}</div>}
        <div onClick={submit} style={{ ...s('text-align:center;padding:14px;border-radius:100px;background:#fff;color:#0B2454;font-size:14.5px;font-weight:700;cursor:pointer'), opacity: c.loginBusy || !ready ? 0.6 : 1 }}>{c.loginBusy ? 'Verificando...' : codeStep ? 'Confirmar código' : 'Entrar'}</div>
        {codeStep && <div onClick={() => { setCode(''); c.backToEmail(); }} style={s('text-align:center;margin-top:14px;font-size:13px;color:rgba(255,255,255,.7);cursor:pointer')}>Usar outro e-mail ou pedir novo código</div>}
      </div>
    </div>
  );
}

function Search({ c }: { c: Central }) {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const res = term ? c.searchVideos.filter(v => v.t.toLowerCase().includes(term) || v.trilha.nome.toLowerCase().includes(term)).slice(0, 6) : [];
  return (
    <div data-tour="search" style={s('position:relative;width:330px')}>
      <div style={s('display:flex;align-items:center;gap:9px;padding:9px 14px;border-radius:100px;background:#F3F5FA;border:1px solid #E5E8F0;color:#9AA3B5;font-size:13px')}>
        <span>⌕</span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar tutoriais, rotinas ou módulos..." style={s('flex:1;border:none;outline:none;background:transparent;font-size:13px;color:#0F172A;min-width:0')} />
      </div>
      {term && (
        <div style={s('position:absolute;top:46px;left:0;right:0;background:#fff;border:1px solid #E5E8F0;border-radius:14px;box-shadow:0 14px 40px rgba(8,16,40,.14);padding:6px;z-index:30')}>
          {res.length === 0 && <div style={s('padding:12px 14px;font-size:13px;color:#8A93A6')}>Nenhum resultado para "{q}".</div>}
          {res.map(v => (
            <div key={v.id} onClick={() => { setQ(''); c.openVideo(v.id); }} style={s('padding:10px 12px;border-radius:9px;cursor:pointer')}>
              <div style={s('font-size:13px;font-weight:600')}>{v.t}</div>
              <div style={s('font-size:11.5px;color:#9AA3B5;margin-top:2px')}>{v.trilha.nome} · {v.min} min</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppShell({ c, children }: { c: Central; children: ReactNode }) {
  const u = c.user!;
  const curVideo = c.videoId ? c.findVideo(c.videoId) : undefined;
  const activeNav: string = c.screen === 'player' && curVideo?.trilha.area ? 'metodologia' : ({ player: 'trilhas', quiz: 'trilhas', perfil: 'inicio', certificado: 'inicio' } as Record<string, string>)[c.screen] || c.screen;
  const crumb = c.screen === 'player' && c.videoId ? c.findVideo(c.videoId)?.trilha.nome || '' : crumbs[c.screen] || '';
  const items = navDef;
  return (
    <div style={s('display:flex;min-height:100vh;min-width:1080px')}>
      <div style={s('width:214px;flex:none;background:#0B2454;padding:22px 16px 18px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh')}>
        <img src={LOGO_L} alt="VERI Academy" style={s('height:22px;width:auto;align-self:flex-start;aspect-ratio:564/88;object-fit:contain;margin:4px 0 26px 6px')} />
        <div data-tour="nav">
        {items.map(n => {
          const on = activeNav === n.id;
          return (
            <div key={n.id} data-tour={'nav-' + n.id} onClick={() => c.go(n.id)} style={s('position:relative;cursor:pointer;margin-bottom:5px')}>
              {on && <div style={s('position:absolute;inset:0;background:#fff;border-radius:12px;box-shadow:0 3px 12px rgba(6,22,66,.22)')} />}
              <div style={s(`position:relative;display:flex;align-items:center;gap:11px;padding:11px 13px;font-size:13.5px;color:${on ? '#0B2454' : 'rgba(255,255,255,.92)'};font-weight:${on ? 700 : 500}`)}>
                {n.icon}
                <span style={{ flex: 1 }}>{n.label}</span>
              </div>
            </div>
          );
        })}
        </div>
        <div style={{ flex: 1 }} />
        <div data-tour="progress" style={s('margin-bottom:12px;padding:12px 13px;border-radius:12px;background:rgba(255,255,255,.12)')}>
          <div style={s('font-size:10px;letter-spacing:.14em;font-weight:700;color:rgba(255,255,255,.66);margin-bottom:7px')}>PROGRESSO GERAL</div>
          <div style={s('height:5px;border-radius:100px;background:rgba(255,255,255,.22);overflow:hidden;margin-bottom:7px')}><div style={{ height: '100%', borderRadius: 100, background: '#fff', width: c.pctGeral + '%' }} /></div>
          <div style={s('font-size:12px;font-weight:700;color:#fff')}>{c.doneCount} de {c.total} vídeos concluídos</div>
        </div>
        <div onClick={() => c.go('perfil')} style={s('display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;background:#fff;cursor:pointer')}>
          <span style={s('width:30px;height:30px;flex:none;border-radius:50%;background:#0B2454;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(u.nome)}</span>
          <span style={s('flex:1;min-width:0')}>
            <span style={s('display:block;font-size:12.5px;font-weight:700;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.35')}>{u.nome}</span>
            <span style={s('display:block;font-size:11px;color:#7A8398;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.35')}>{u.empresa || papelLabel(u)}</span>
          </span>
        </div>
        <div onClick={c.logout} style={s('margin-top:10px;text-align:center;font-size:12px;font-weight:600;color:rgba(255,255,255,.72);cursor:pointer')}>Sair</div>
      </div>

      <div style={s('flex:1;min-width:0;display:flex;flex-direction:column')}>
        <div style={s('display:flex;align-items:center;gap:20px;padding:17px 30px;background:#fff;border-bottom:1px solid #E9ECF3;position:sticky;top:0;z-index:20')}>
          <div style={s('display:flex;align-items:center;gap:9px;font-size:13px;color:#7A8398;min-width:0')}>
            <span onClick={() => c.go('inicio')} style={{ cursor: 'pointer' }}>Minha jornada</span>
            <span style={s('color:#C3C9D6')}>›</span>
            <span onClick={() => c.setSetor('')} title="Trocar de setor" style={{ cursor: 'pointer' }}>Setor: {c.setor === 'comercial' ? 'Comercial' : c.setor}</span>
            <span style={s('color:#C3C9D6')}>›</span>
            <span style={s('color:#0F172A;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{crumb}</span>
          </div>
          <div style={{ flex: 1 }} />
          <Search c={c} />
          <ThemeToggle theme={c.theme} onToggle={c.toggleTheme} />
        </div>
        <div style={s('flex:1;padding:26px 30px 90px')}>{children}</div>
      </div>

      {c.tourOpen && <GuidedTour c={c} />}
      {c.toast && (
        <div style={s('position:fixed;left:0;right:0;bottom:28px;z-index:70;display:flex;justify-content:center;pointer-events:none')}>
          <div style={s('padding:14px 24px;border-radius:100px;background:#0F172A;color:#fff;font-size:13.5px;font-weight:600;box-shadow:0 14px 40px rgba(8,16,40,.35);animation:veriUp .25s ease both')}>{c.toast}</div>
        </div>
      )}
    </div>
  );
}
