import { useEffect, useState } from 'react';
import { Central, Screen } from './useCentral';
import { primeiroNome } from './data';
import { s } from './ui';

interface Step { target?: string; screen?: Screen; place: 'right' | 'below' | 'center'; title: string; text: string; hint?: string }

function buildSteps(nome: string): Step[] {
  return [
    { place: 'center', screen: 'inicio', title: `Bem-vindo(a), ${primeiroNome(nome)}`, text: 'Em poucos passos você conhece cada área da Veri Academy para colaboradores. Seu progresso fica salvo.' },
    { target: 'nav', place: 'right', screen: 'inicio', title: 'Seu menu de navegação', text: 'Tudo fica neste menu à esquerda. O item em destaque mostra em que parte você está.' },
    { target: 'nav-inicio', place: 'right', screen: 'inicio', title: 'Início', text: 'Seu ponto de partida: o próximo vídeo, o resumo do seu dia e o caminho sugerido.' },
    { target: 'nav-trilhas', place: 'right', screen: 'trilhas', title: 'Tutoriais', text: 'Vídeos para aprender a usar o sistema e as ferramentas do dia a dia, organizados por trilha.' },
    { target: 'nav-metodologia', place: 'right', screen: 'metodologia', title: 'Metodologia', text: 'Como o seu setor trabalha: vídeos, gravações de apresentações, materiais e checklists.' },
    { target: 'nav-operacao', place: 'right', screen: 'operacao', title: 'Operação', text: 'O checklist da sua rotina de hoje. Marque o que concluiu e ajuste a lista como preferir.' },
    { target: 'nav-resultados', place: 'right', screen: 'resultados', title: 'Resultados', text: 'Seus indicadores em verde ou vermelho. Quando algo estiver vermelho, você vê o que estudar para melhorar.' },
    { target: 'nav-intranet', place: 'right', screen: 'intranet', title: 'Intranet', text: 'Converse com os colegas, veja comunicados, calendário, contatos e documentos do time.' },
    { target: 'nav-notificacoes', place: 'right', screen: 'notificacoes', title: 'Notificações', text: 'Avisos e lembretes da sua trilha aparecem aqui.' },
    { target: 'nav-config', place: 'right', screen: 'config', title: 'Configurações', text: 'Ajuste lembretes e preferências. Este tutorial também pode ser refeito por aqui.' },
    { target: 'search', place: 'below', screen: 'inicio', title: 'Busca', text: 'Digite o nome de um vídeo para ir direto à aula, de qualquer tela.' },
    { target: 'theme', place: 'below', screen: 'inicio', title: 'Tema claro ou escuro', text: 'Escolha a aparência mais confortável para você.' },
    { target: 'progress', place: 'right', screen: 'inicio', title: 'Seu progresso', text: 'Veja quantos vídeos já concluiu. Clique no seu nome logo abaixo para abrir o seu perfil.' },
    { place: 'center', screen: 'inicio', title: 'Tudo pronto', text: 'Agora é só começar. Você pode rever este tutorial em Configurações sempre que precisar.' },
  ];
}

const W = 372;
const PAD = 7;

export function GuidedTour({ c }: { c: Central }) {
  const u = c.user!;
  const steps = buildSteps(u.nome);
  const i = Math.min(c.tourStep, steps.length - 1);
  const st = steps[i];
  const last = i === steps.length - 1;
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  // abre a página real do passo (navegação de verdade)
  useEffect(() => { if (st.screen && c.screen !== st.screen) c.go(st.screen); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [i]);

  // acompanha a posição do elemento destacado (muda com rolagem, redimensionamento e carregamento)
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth, h = window.innerHeight;
      setVp(p => (p.w === w && p.h === h ? p : { w, h }));
      const el = st.target ? document.querySelector(`[data-tour="${st.target}"]`) : null;
      const r = el ? el.getBoundingClientRect() : null;
      // só atualiza quando algo mudou de fato (evita re-renderizar a cada ciclo)
      setRect(p => (p && r && p.left === r.left && p.top === r.top && p.width === r.width && p.height === r.height) || (!p && !r) ? p : r);
    };
    measure();
    const iv = window.setInterval(measure, 250);
    window.addEventListener('resize', measure); window.addEventListener('scroll', measure, true);
    return () => { clearInterval(iv); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
  }, [st.target, i]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !last) c.setTourStep(i + 1);
      if (e.key === 'ArrowLeft' && i > 0) c.setTourStep(i - 1);
      if (e.key === 'Escape') c.closeTour();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  const spot = rect && st.place !== 'center';
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  let pos: React.CSSProperties;
  if (!spot || !rect) pos = { left: Math.max(16, (vp.w - W) / 2), top: Math.max(16, (vp.h - 400) / 2) }; // sem transform: a animação de entrada usa transform
  else if (st.place === 'right') pos = { left: clamp(rect.right + PAD + 16, 16, vp.w - W - 16), top: clamp(rect.top - 8, 16, vp.h - 380) };
  else pos = { left: clamp(rect.right - W, 16, vp.w - W - 16), top: clamp(rect.bottom + PAD + 16, 16, vp.h - 380) };

  return (
    <>
      <div style={s('position:fixed;inset:0;z-index:90')} />
      {spot && rect
        ? <div style={{ position: 'fixed', zIndex: 91, pointerEvents: 'none', left: rect.left - PAD, top: rect.top - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2, borderRadius: 14, boxShadow: '0 0 0 9999px rgba(5,10,25,.66), 0 0 0 2px #fff', transition: 'all .25s ease' }} />
        : <div style={s('position:fixed;inset:0;z-index:91;pointer-events:none;background:rgba(5,10,25,.66)')} />}
      <div style={{ ...s('position:fixed;z-index:100;background:#fff;border:1px solid #E5E8F0;border-radius:18px;padding:24px 24px 20px;box-shadow:0 24px 70px rgba(5,10,25,.4);animation:veriUp .3s ease both'), width: W, ...pos }} role="dialog" aria-label={st.title}>
        <div style={s('display:flex;gap:4px;margin-bottom:16px')}>
          {steps.map((_, k) => <div key={k} style={s(`height:4px;flex:1;border-radius:100px;background:${k <= i ? '#0B2454' : '#E5E8F0'}`)} />)}
        </div>
        <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:10px')}>
          <span style={s('font-size:11px;letter-spacing:.16em;font-weight:700;color:#0B2454')}>PASSO {i + 1} DE {steps.length}</span>
          {!last && <span onClick={c.closeTour} style={s('font-size:12px;color:#7A8398;cursor:pointer;border-bottom:1px solid #C3C9D6')}>Pular tutorial</span>}
        </div>
        <div style={s('font-size:19px;font-weight:700;line-height:1.3;margin-bottom:8px')}>{st.title}</div>
        <div style={s('font-size:13.5px;line-height:1.7;color:#5B6478;margin-bottom:16px')}>{st.text}</div>
        {st.hint && <div style={s('padding:12px 14px;border-radius:12px;background:#F1F3F8;border:1px solid #E5E8F0;font-size:12.5px;line-height:1.6;color:#0B2454;margin-bottom:16px')}>{st.hint}</div>}
        {!last && (
          <div style={s('display:flex;gap:10px;align-items:center')}>
            <div onClick={() => c.setTourStep(i + 1)} style={s('flex:1;text-align:center;padding:12px 18px;border-radius:100px;background:#0B2454;color:#fff;font-size:14px;font-weight:700;cursor:pointer')}>Próximo</div>
            {i > 0 && <div onClick={() => c.setTourStep(i - 1)} style={s('padding:12px 18px;border-radius:100px;border:1px solid #E5E8F0;color:#5B6478;font-size:14px;font-weight:600;cursor:pointer')}>Voltar</div>}
          </div>
        )}
        {last && (
          <>
            <div style={s('display:flex;flex-direction:column;gap:10px')}>
              <div onClick={c.finishTour} style={s('text-align:center;padding:13px 18px;border-radius:100px;background:#0B2454;color:#fff;font-size:14px;font-weight:700;cursor:pointer')}>Entrar na central</div>
              <div onClick={c.neverShowTour} style={s('text-align:center;padding:12px 18px;border-radius:100px;border:1px solid #E5E8F0;color:#5B6478;font-size:13.5px;font-weight:600;cursor:pointer')}>Não mostrar novamente</div>
              <div onClick={() => c.setTourStep(i - 1)} style={s('text-align:center;font-size:12.5px;color:#7A8398;cursor:pointer')}>Voltar</div>
            </div>
            <div style={s('font-size:11.5px;line-height:1.55;color:#9AA3B5;margin-top:12px;text-align:center')}>Se você só entrar, o tutorial aparece de novo no próximo acesso.</div>
          </>
        )}
      </div>
    </>
  );
}
