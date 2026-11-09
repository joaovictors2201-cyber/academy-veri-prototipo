import { Central } from './useCentral';
import { loadMetas, loadOperacao, vermelhos } from './store';
import { INDICADORES } from './demo';
import { capaYoutube, CERTIFICADO_ATIVO, fmtDuracao, iniciais, papelLabel, Video } from './data';
import { quandoLabel } from './format';
import { Bar, Card, Eyebrow, Pill, s, statusStyle, palette, tv } from './ui';

/** Estatísticas de cada trilha a partir do progresso. */
export function useRows(c: Central) {
  return c.trilhas.map((t, i) => {
    const feito = t.videos.filter(v => c.done[v.id]).length;
    const pct = Math.round((feito / t.videos.length) * 100);
    const full = feito === t.videos.length;
    const nx = t.videos.find(v => !c.done[v.id]) || t.videos[0];
    return { t, n: '0' + (i + 1), pct, pctStr: pct + '%', feito, full, started: pct > 0, nx, label: `${feito} de ${t.videos.length} concluídos`, ...statusStyle(full, pct > 0) };
  });
}

const vpct = (c: Central, v: Video) => (c.done[v.id] ? 100 : c.pos[v.id] || 0);

function useCaminho(c: Central) {
  return c.allVideos.slice(0, 6).map((v, i) => {
    const isNext = v.id === c.nextV?.id, d = !!c.done[v.id];
    return {
      v, n: i + 1, sub: `${v.trilha.nome} · ${v.min} min`,
      numBg: d ? palette.green : isNext ? '#0B2454' : '#EEF1F6', numFg: d || isNext ? '#fff' : '#9AA3B5',
      st: d ? 'CONCLUÍDO' : isNext ? 'PRÓXIMO' : 'A ASSISTIR',
      stBg: d ? palette.doneBg : isNext ? palette.blueBg : palette.greyBg, stFg: d ? palette.doneFg : isNext ? palette.blue : palette.greyFg,
    };
  });
}

function CaminhoList({ c, size }: { c: Central; size: 'lg' | 'sm' }) {
  const lg = size === 'lg';
  return (
    <>
      {useCaminho(c).map(x => (
        <div key={x.v.id} onClick={() => c.openVideo(x.v.id)} style={s(`display:flex;align-items:center;gap:15px;padding:${lg ? 14 : 13}px 0;border-top:1px solid #F0F2F7;cursor:pointer`)}>
          <span style={s(`width:${lg ? 34 : 32}px;height:${lg ? 34 : 32}px;flex:none;border-radius:10px;background:${x.numBg};color:${x.numFg};font-size:${lg ? 13 : 12.5}px;font-weight:800;display:flex;align-items:center;justify-content:center`)}>{x.n}</span>
          <span style={s('flex:1;min-width:0')}>
            <span style={s(`display:block;font-size:${lg ? 14 : 13.5}px;font-weight:600;margin-bottom:${lg ? 3 : 2}px`)}>{x.v.t}</span>
            <span style={s('display:block;font-size:12px;color:#8A93A6')}>{x.sub}</span>
          </span>
          <span style={s(`font-size:11px;font-weight:700;letter-spacing:.08em;color:${x.stFg};background:${x.stBg};padding:5px 11px;border-radius:100px;white-space:nowrap`)}>{x.st}</span>
        </div>
      ))}
    </>
  );
}

const certTexts = (c: Central) => ({
  title: c.certReady ? 'Certificado disponível' : 'Certificado bloqueado',
  sub: c.certReady ? `Emitido em seu nome, com ${c.user?.empresa || 'o escritório'} como informação secundária.` : `Conclua ${c.trilhas.length > 1 ? 'as ' + c.trilhas.length + ' trilhas' : 'o programa'} para liberar a emissão do certificado.`,
  cta: c.certReady ? 'Ver certificado' : 'Ver requisitos',
});

function MinhasInteracoes({ c, variant }: { c: Central; variant: 'inicio' | 'perfil' }) {
  const perfil = variant === 'perfil';
  return (
    <>
      {c.minhas.map((m, i) => {
        const duvida = m.tipo === 'duvidas';
        return (
          <div key={i} style={s(`padding:${perfil ? 13 : 12}px 0;border-top:1px solid #F0F2F7`)}>
            {perfil && <div style={s('font-size:11px;font-weight:700;color:#9AA3B5;margin-bottom:5px')}>{m.origem}</div>}
            <div style={s(`font-size:13px;line-height:${perfil ? 1.6 : 1.55};color:#39415A;margin-bottom:${perfil ? 8 : 7}px`)}>{m.texto}</div>
            <div style={s(`font-size:11${perfil ? '.5' : ''}px;font-weight:700;color:${duvida ? '#0B2454' : '#0B6B3F'}`)}>
              {(m.quando ? quandoLabel(m.quando) + ' · ' : '') + (duvida ? 'Encaminhada ao suporte do escritório · aguardando resposta' : 'Registrado · visível para o suporte')}
            </div>
          </div>
        );
      })}
    </>
  );
}

function SeuDia({ c }: { c: Central }) {
  const op = loadOperacao();
  const feitos = op.filter(i => i.ok).length;
  const fora = vermelhos('eu', loadMetas());
  const cards = [
    { t: 'Operação de hoje', v: `${feitos}/${op.length}`, d: 'itens do checklist concluídos', ir: 'operacao' as const, b: 'Abrir checklist' },
    { t: 'Resultados do mês', v: String(fora), d: `de ${INDICADORES.length} indicadores fora da meta (exemplo)`, ir: 'resultados' as const, b: 'Ver resultados' },
    { t: 'Metodologia', v: c.areas.find(a => a.id === 'comercial')?.trilhas.reduce((n, tr) => n + tr.videos.length, 0).toString() || '0', d: 'vídeos e gravações do Comercial', ir: 'metodologia' as const, b: 'Abrir metodologia' },
  ];
  return (
    <div style={s('margin-bottom:26px')}>
      <div style={s('font-size:16px;font-weight:700;margin-bottom:12px')}>Seu dia</div>
      <div style={s('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px')}>
        {cards.map(k => (
          <Card key={k.t} pad="20px 22px" radius={16}>
            <div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6;margin-bottom:6px')}>{k.t.toUpperCase()}</div>
            <div style={s('font-size:29px;font-weight:800;letter-spacing:-.02em;color:#0B2454')}>{k.v}</div>
            <div style={s('font-size:12.5px;color:#7A8398;margin:2px 0 12px')}>{k.d}</div>
            <span onClick={() => c.go(k.ir)} style={s('cursor:pointer;font-size:12.5px;font-weight:700;color:#0B2454')}>{k.b} →</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Inicio({ c }: { c: Central }) {
  const ct = certTexts(c);
  const kpis = [
    { v: `${c.doneCount}/${c.total}`, l: 'VÍDEOS CONCLUÍDOS' }, { v: `${c.trilhasDone}/${c.trilhas.length}`, l: 'TRILHAS COMPLETAS' },
    { v: c.total ? fmtDuracao(c.totalMin) : '—', l: 'CARGA HORÁRIA TOTAL' }, { v: c.pctGeral + '%', l: 'PROGRAMA COMPLETO' },
  ];
  return (
    <div style={{ maxWidth: 1180 }}>
      {/* Banner da home (2360x620). O título e o texto já estão desenhados na imagem; o botão fica centralizado sobre ela. */}
      <div style={s('position:relative;border-radius:20px;overflow:hidden;line-height:0;background:#0B2454')}>
        <img src={import.meta.env.BASE_URL + 'assets/banner-home.png'} width={2360} height={620} alt="Seja bem-vindo(a) ao VERI Academy: o ambiente educativo e capacitador da Veri, pensado para te guiar, orientar e dar suporte no uso do sistema" style={{ width: '100%', height: 'auto', display: 'block' }} />
        {c.nextV && (
          <div data-tour="hero-cta" onClick={() => c.openVideo(c.nextV!.id)}
            style={{ ...s('position:absolute;left:50%;bottom:6%;transform:translateX(-50%);display:flex;align-items:center;gap:9px;white-space:nowrap;border-radius:100px;background:#fff;color:#0B2454;font-weight:700;cursor:pointer;line-height:1.2;box-shadow:0 6px 18px rgba(5,10,25,.35)'), padding: 'clamp(8px, 1.1vw, 13px) clamp(16px, 2vw, 26px)', fontSize: 'clamp(12px, 1.1vw, 14.5px)' }}>
            {c.doneCount === 0 ? 'Começar agora' : c.certReady ? 'Revisar trilhas' : 'Continuar de onde parei'} <span>→</span>
          </div>
        )}
      </div>
      <div style={s('text-align:center;font-size:13px;color:#7A8398;margin:12px 0 22px')}>
        {c.nextV
          ? (c.certReady ? 'Programa completo' : 'Próximo: ' + c.nextV.t)
          : 'Os primeiros vídeos estão sendo preparados. Em breve eles aparecem aqui.'}
      </div>
      <div style={s('display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:26px')}>
        {kpis.map(k => (
          <Card key={k.l} pad="20px 22px" radius={16}>
            <div style={s('font-size:29px;font-weight:800;letter-spacing:-.02em;color:#0B2454;margin-bottom:4px')}>{k.v}</div>
            <div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6')}>{k.l}</div>
          </Card>
        ))}
      </div>
      <SeuDia c={c} />
      <div style={s('display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:18px')}>
        <Card pad="24px 26px">
          <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Caminho sugerido para você</div>
          <div style={s('font-size:13px;color:#7A8398;margin-bottom:20px')}>Sequência recomendada para o perfil {c.user ? papelLabel(c.user) : ''}{c.user?.empresa ? ' · ' + c.user.empresa : ''}</div>
          {c.total === 0 && <div style={s('font-size:13.5px;line-height:1.7;color:#8A93A6;padding:10px 0')}>Nenhum vídeo disponível ainda.</div>}
          <CaminhoList c={c} size="lg" />
        </Card>
        <div style={s('display:flex;flex-direction:column;gap:18px')}>
          {CERTIFICADO_ATIVO && (
          <div style={s('background:linear-gradient(140deg,#0B2454,#0B2454);border-radius:18px;padding:24px 26px;color:#fff')}>
            <Eyebrow>CERTIFICADO</Eyebrow>
            <div style={s('font-size:18px;font-weight:700;line-height:1.35;margin-bottom:8px')}>{ct.title}</div>
            <div style={s('font-size:13px;line-height:1.65;color:rgba(255,255,255,.72);margin-bottom:18px')}>{ct.sub}</div>
            <div style={s('height:6px;border-radius:100px;background:rgba(255,255,255,.2);overflow:hidden;margin-bottom:16px')}><div style={{ height: '100%', background: '#fff', width: c.pctGeral + '%' }} /></div>
            <div onClick={() => c.go('certificado')} style={s('display:inline-block;padding:11px 20px;border-radius:100px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);font-size:13px;font-weight:700;cursor:pointer')}>{ct.cta}</div>
          </div>
          )}
          <Card pad="22px 24px">
            <div style={s('font-size:15px;font-weight:700;margin-bottom:14px')}>Suas interações</div>
            <MinhasInteracoes c={c} variant="inicio" />
            {c.minhas.length === 0 && <div style={s('font-size:13px;line-height:1.6;color:#8A93A6;padding-top:6px')}>Suas dúvidas e comentários nos vídeos aparecem aqui, com o status do retorno do suporte do escritório.</div>}
          </Card>
        </div>
      </div>
    </div>
  );
}

const durRow = (v: Video) => <span style={s('font-size:11.5px;color:#9AA3B5')}>{v.min} min</span>;

function Prateleiras({ c, rows }: { c: Central; rows: ReturnType<typeof useRows> }) {
  const filtros = ['Todos', ...c.trilhas.map(t => t.nome)];
  return (
    <>
      <div style={s('display:flex;flex-wrap:wrap;gap:9px;margin-bottom:26px')}>
        {filtros.map(f => <Pill key={f} big on={c.filtro === f} label={f} onClick={() => c.setFiltro(f)} />)}
      </div>
      {rows.filter(r => c.filtro === 'Todos' || r.t.nome === c.filtro).map(r => (
        <div key={r.t.id} style={{ marginBottom: 30 }}>
          <div style={s('display:flex;align-items:center;gap:18px;margin-bottom:13px')}>
            <div style={s('font-size:17px;font-weight:700')}>{r.t.nome}</div>
            <div style={{ flex: 1 }} />
            <div style={s('font-size:12.5px;color:#8A93A6')}>{r.label}</div>
            <div style={{ width: 96 }}><Bar pct={r.pctStr} track="#E5E8F0" h={5} /></div>
            <div style={s('font-size:12.5px;font-weight:700;color:#0B2454;width:36px;text-align:right')}>{r.pctStr}</div>
          </div>
          <div style={s('display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px')}>
            {r.t.videos.map(v => {
              const d = !!c.done[v.id], p = vpct(c, v);
              return (
                <div key={v.id} onClick={() => c.openVideo(v.id)} style={s('background:#fff;border:1px solid #E9ECF3;border-radius:13px;overflow:hidden;cursor:pointer;box-shadow:0 1px 2px rgba(15,23,42,.04)')}>
                  <div style={{ ...s('position:relative;height:104px;background:linear-gradient(135deg,#0B2454 0%,#0B2454 100%);display:flex;align-items:center;justify-content:center'), ...capaYoutube(v) }}>
                    {d
                      ? <span style={s('display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;background:#DCFCE7;color:#0B6B3F;font-size:10px;letter-spacing:.09em;font-weight:800')}>✓ CONCLUÍDO</span>
                      : <span style={s('width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.9);color:#0B2454;font-size:12px;display:flex;align-items:center;justify-content:center')}>▶</span>}
                    {p > 0 && p < 100 && <div style={s('position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.22)')}><div style={{ height: '100%', background: '#fff', width: p + '%' }} /></div>}
                  </div>
                  <div style={s('padding:12px 13px 13px')}>
                    <div style={{ ...s('font-size:13px;font-weight:600;line-height:1.35;margin-bottom:8px;min-height:35px'), textWrap: 'pretty' }}>{v.t}</div>
                    <div style={s('display:flex;align-items:center;justify-content:space-between')}><span style={s('font-size:11.5px;color:#9AA3B5')}>◷ {v.min} min</span><span style={{ fontSize: 12, color: d ? palette.green : 'transparent' }}>✓</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function VisaoTrilhas({ c, rows }: { c: Central; rows: ReturnType<typeof useRows> }) {
  return (
    <div style={s('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:8px')}>
      {rows.map(r => (
        <Card key={r.t.id} pad="26px 28px" radius={20} style="display:flex;gap:22px;align-items:flex-start">
          <div style={{ ...s('width:74px;height:74px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center'), background: `conic-gradient(#0B2454 ${r.pct * 3.6}deg, ${tv('#E9EDF6', 'bg')} 0deg)` }}>
            <span style={s('width:58px;height:58px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#0B2454')}>{r.pctStr}</span>
          </div>
          <div style={s('flex:1;min-width:0')}>
            <div style={s('display:flex;align-items:center;gap:9px;margin-bottom:7px')}>
              <span style={s('font-size:17px;font-weight:700')}>{r.t.nome}</span>
              <span style={s(`padding:4px 10px;border-radius:100px;background:${r.bg};color:${r.fg};font-size:10px;letter-spacing:.08em;font-weight:800`)}>{r.full ? 'CONCLUÍDA' : r.started ? 'EM ANDAMENTO' : 'NÃO INICIADA'}</span>
            </div>
            <div style={s('font-size:13px;line-height:1.65;color:#7A8398;margin-bottom:16px')}>{r.t.desc}</div>
            <div style={s('display:flex;flex-direction:column;gap:2px;margin-bottom:18px')}>
              {r.t.videos.map(v => {
                const d = !!c.done[v.id];
                return (
                  <div key={v.id} onClick={() => c.openVideo(v.id)} style={s(`display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:9px;cursor:pointer;background:${c.videoId === v.id ? '#F1F3F8' : 'transparent'}`)}>
                    <span style={s(`width:18px;height:18px;flex:none;border-radius:50%;border:1.5px solid ${d ? palette.green : '#C3C9D6'};background:${d ? palette.green : 'transparent'};color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center`)}>{d ? '✓' : ''}</span>
                    <span style={s('flex:1;min-width:0;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{v.t}</span>
                    {durRow(v)}
                  </div>
                );
              })}
            </div>
            <div onClick={() => c.openVideo(r.nx.id)} style={s('display:inline-block;padding:10px 20px;border-radius:100px;background:#F1F3F8;border:1px solid #E5E8F0;color:#0B2454;font-size:13px;font-weight:700;cursor:pointer')}>
              {r.full ? 'Revisar trilha' : r.started ? 'Continuar trilha' : 'Começar trilha'}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function VisaoCaminho({ c, rows }: { c: Central; rows: ReturnType<typeof useRows> }) {
  return (
    <Card pad="34px 36px" radius={20} style="margin-top:8px">
      <div style={s('font-size:13px;line-height:1.65;color:#7A8398;max-width:620px;margin-bottom:28px')}>O programa completo em ordem, do primeiro ao último vídeo.</div>
      {rows.map(r => (
        <div key={r.t.id} style={{ display: 'flex', gap: 26 }}>
          <div style={s('width:46px;flex:none;display:flex;flex-direction:column;align-items:center')}>
            <span style={s(`width:46px;height:46px;border-radius:14px;background:${r.full ? palette.green : r.started ? '#0B2454' : '#EEF1F6'};color:${r.started ? '#fff' : '#9AA3B5'};font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center`)}>{r.n}</span>
            <span style={s('flex:1;width:2px;background:#E5E8F0;margin:6px 0')} />
          </div>
          <div style={s('flex:1;min-width:0;padding-bottom:30px')}>
            <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:6px')}>
              <span style={s('font-size:18px;font-weight:700')}>{r.t.nome}</span>
              <span style={s('font-size:12.5px;color:#8A93A6')}>{r.label}</span>
            </div>
            <div style={s('font-size:13px;line-height:1.65;color:#7A8398;max-width:560px;margin-bottom:16px')}>{r.t.desc}</div>
            <div style={s('display:flex;flex-wrap:wrap;gap:9px')}>
              {r.t.videos.map(v => {
                const d = !!c.done[v.id];
                return (
                  <div key={v.id} onClick={() => c.openVideo(v.id)} style={s(`display:flex;align-items:center;gap:9px;padding:10px 15px;border-radius:100px;border:1px solid ${d ? '#CFEEDC' : '#E5E8F0'};background:${d ? '#F1FBF5' : '#fff'};cursor:pointer`)}>
                    <span style={s(`width:7px;height:7px;border-radius:50%;background:${d ? palette.green : '#C3C9D6'}`)} />
                    <span style={s('font-size:12.5px;font-weight:600;color:#39415A')}>{v.t}</span>
                    {durRow(v)}
                  </div>
                );
              })}
              {r.t.quiz && (
                <div onClick={() => c.openQuiz(r.t.id)} style={s('display:flex;align-items:center;gap:9px;padding:10px 15px;border-radius:100px;border:1px dashed #C3C9D6;background:#F7F9FC;cursor:pointer')}>
                  <span style={s('font-size:12.5px;font-weight:700;color:#0B2454')}>Checkpoint do módulo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {CERTIFICADO_ATIVO && (
      <div style={{ display: 'flex', gap: 26 }}>
        <div style={s('width:46px;flex:none;display:flex;justify-content:center')}>
          <span style={s('width:46px;height:46px;border-radius:14px;background:#FFCF3D;color:#3A2A00;font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center')}>★</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={s('font-size:18px;font-weight:700;margin-bottom:6px')}>Certificado VERI Academy</div>
          <div style={s('font-size:13px;line-height:1.65;color:#7A8398;max-width:560px')}>Emitido em seu nome, com o escritório como informação secundária e código de verificação público.</div>
        </div>
      </div>
      )}
    </Card>
  );
}

export function Trilhas({ c }: { c: Central }) {
  const rows = useRows(c);
  const vars: { k: 'a' | 'b' | 'c'; label: string }[] = [{ k: 'a', label: 'Prateleiras' }, { k: 'b', label: 'Trilhas' }, { k: 'c', label: 'Caminho' }];
  return (
    <div style={{ maxWidth: 1180 }}>
      <div style={s('display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px')}>
        <div>
          <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>Tutoriais</div>
          <div style={s('font-size:13.5px;color:#7A8398')}>{c.trilhas.length} trilhas · {c.total} vídeos</div>
        </div>
        <div style={s('display:flex;align-items:center;gap:8px')}>
          <span style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#9AA3B5')}>VISUALIZAÇÃO</span>
          {vars.map(v => <Pill key={v.k} on={c.variant === v.k} label={v.label} onClick={() => c.setVariant(v.k)} />)}
        </div>
      </div>
      {c.total === 0 && (
        <Card pad="44px 40px" radius={20} style="text-align:center;margin-top:8px">
          <div style={s('font-size:18px;font-weight:700;margin-bottom:8px')}>Os vídeos ainda não foram publicados</div>
          <div style={s('font-size:13.5px;line-height:1.7;color:#7A8398;max-width:480px;margin:0 auto')}>Assim que as primeiras trilhas forem liberadas, elas aparecem aqui e o seu progresso começa a ser registrado.</div>
        </Card>
      )}
      {c.total > 0 && c.variant === 'a' && <Prateleiras c={c} rows={rows} />}
      {c.total > 0 && c.variant === 'b' && <VisaoTrilhas c={c} rows={rows} />}
      {c.total > 0 && c.variant === 'c' && <VisaoCaminho c={c} rows={rows} />}
    </div>
  );
}

export function Perfil({ c }: { c: Central }) {
  const rows = useRows(c), ct = certTexts(c);
  const vistos = c.allVideos.filter(v => c.done[v.id]);
  const u = c.user!;
  const stat = (v: string | number, l: string) => <div><div style={s('font-size:26px;font-weight:800;color:#0B2454')}>{v}</div><div style={s('font-size:10.5px;letter-spacing:.12em;font-weight:700;color:#9AA3B5')}>{l}</div></div>;
  return (
    <div style={{ maxWidth: 1180 }}>
      <Card pad="28px 32px" radius={20} style="display:flex;gap:22px;align-items:center;margin-bottom:18px">
        <span style={s('width:76px;height:76px;flex:none;border-radius:50%;background:linear-gradient(140deg,#0B2454,#0B2454);color:#fff;font-size:23px;font-weight:800;display:flex;align-items:center;justify-content:center')}>{iniciais(u.nome)}</span>
        <div style={s('flex:1;min-width:0')}>
          <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>{u.nome}</div>
          <div style={s('font-size:13.5px;color:#7A8398')}>{[u.cargo, u.empresa, papelLabel(u)].filter(Boolean).join(' · ')}</div>
        </div>
        <div style={s('display:flex;gap:26px;text-align:right')}>{stat(c.doneCount, 'VÍDEOS VISTOS')}{stat(c.trilhasDone, 'TRILHAS')}{stat(c.pctGeral + '%', 'PROGRAMA')}</div>
      </Card>
      <div style={s('display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:18px')}>
        <div style={s('display:flex;flex-direction:column;gap:18px')}>
          <Card>
            <div style={s('font-size:16px;font-weight:700;margin-bottom:18px')}>Progresso por trilha</div>
            {rows.map(r => (
              <div key={r.t.id} style={s('padding:13px 0;border-top:1px solid #F0F2F7')}>
                <div style={s('display:flex;align-items:center;gap:12px;margin-bottom:8px')}>
                  <span style={s('flex:1;font-size:14px;font-weight:600')}>{r.t.nome}</span>
                  <span style={s('font-size:12.5px;color:#8A93A6')}>{r.label}</span>
                  <span style={s('font-size:12.5px;font-weight:700;color:#0B2454;width:38px;text-align:right')}>{r.pctStr}</span>
                </div>
                <Bar pct={r.pctStr} />
              </div>
            ))}
          </Card>
          <Card>
            <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Caminho sugerido</div>
            <div style={s('font-size:13px;color:#7A8398;margin-bottom:16px')}>Ordem recomendada com base no seu papel e no que você ainda não usou no Portal VERI.</div>
            <CaminhoList c={c} size="sm" />
          </Card>
          <Card>
            <div style={s('font-size:16px;font-weight:700;margin-bottom:16px')}>Vídeos assistidos</div>
            {vistos.length === 0 && <div style={s('font-size:13.5px;line-height:1.7;color:#8A93A6')}>Você ainda não concluiu nenhum vídeo. O histórico fica salvo por usuário — mesmo que seu papel no escritório mude, o que você já concluiu continua aqui.</div>}
            <div style={s('display:flex;flex-wrap:wrap;gap:9px')}>
              {vistos.map(v => (
                <div key={v.id} onClick={() => c.openVideo(v.id)} style={s('display:flex;align-items:center;gap:9px;padding:9px 14px;border-radius:100px;background:#F1FBF5;border:1px solid #CFEEDC;cursor:pointer')}>
                  <span style={s('color:#0B6B3F;font-size:11px;font-weight:800')}>✓</span>
                  <span style={s('font-size:12.5px;font-weight:600;color:#2A3144')}>{v.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={s('display:flex;flex-direction:column;gap:18px')}>
          {CERTIFICADO_ATIVO && (
          <div style={s('border-radius:18px;padding:26px;background:linear-gradient(150deg,#0B2454,#0B2454);color:#fff')}>
            <Eyebrow mb={12}>CERTIFICADO DO PROGRAMA</Eyebrow>
            <div style={s('font-size:19px;font-weight:700;line-height:1.35;margin-bottom:10px')}>{ct.title}</div>
            <div style={s('font-size:13px;line-height:1.7;color:rgba(255,255,255,.72);margin-bottom:20px')}>{ct.sub}</div>
            <div onClick={() => c.go('certificado')} style={s('display:inline-block;padding:12px 22px;border-radius:100px;background:#fff;color:#0B2454;font-size:13.5px;font-weight:700;cursor:pointer')}>{ct.cta}</div>
          </div>
          )}
          <Card>
            <div style={s('font-size:16px;font-weight:700;margin-bottom:6px')}>Minhas dúvidas e comentários</div>
            <div style={s('font-size:12.5px;color:#8A93A6;margin-bottom:14px')}>Tudo que você envia vai para a fila do suporte do escritório, agrupado por vídeo.</div>
            <MinhasInteracoes c={c} variant="perfil" />
            {c.minhas.length === 0 && <div style={s('font-size:13px;line-height:1.7;color:#8A93A6')}>Nenhum envio ainda.</div>}
          </Card>
        </div>
      </div>
    </div>
  );
}
