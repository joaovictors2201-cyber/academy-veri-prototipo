import { useState } from 'react';
import { Central } from './useCentral';
import { Card, s } from './ui';
import { INDICADORES, Indicador, PESSOAS, Secao } from './demo';
import { fmtValor, loadMetas, media, metaDe, noAlvo, saveMetas, vermelhos } from './store';

const VERDE = '#12B76A';
const VERMELHO = '#EF6A5A';
const SECAO_LABEL: Record<Secao, string> = { videos: 'Vídeos', gravacoes: 'Gravações', materiais: 'Materiais', checklists: 'Checklists' };

type Visao = 'vendedor' | 'lider';

function Aviso() {
  return (
    <Card style="margin-bottom:18px;background:#FFF7DE" pad="12px 20px">
      <div style={s('font-size:13px;color:#7A5A00;line-height:1.6')}>Dados de exemplo, inventados para mostrar o funcionamento. Na versão real, os números vêm do HubSpot e as metas são as cadastradas pelo líder.</div>
    </Card>
  );
}

function Selo({ ok }: { ok: boolean }) {
  return <span style={{ ...s('display:inline-block;width:10px;height:10px;border-radius:50%'), background: ok ? VERDE : VERMELHO }} />;
}

function Vendedor({ c, metas }: { c: Central; metas: Record<string, number> }) {
  const eu = PESSOAS[0];
  const linhas = INDICADORES.map((ind, i) => {
    const valor = eu.valores[i], meta = metaDe(ind.id, metas), ok = noAlvo(ind.melhor, valor, meta);
    const desvio = ind.melhor === 'maior' ? (meta - valor) / meta : (valor - meta) / meta; // positivo = pior
    return { ind, i, valor, meta, ok, desvio, med: media(i) };
  });
  const fora = linhas.filter(l => !l.ok);
  const piores = [...fora].sort((a, b) => b.desvio - a.desvio).slice(0, 3);
  const grupos = Array.from(new Set(INDICADORES.map(i => i.grupo)));
  const abrir = (secao: Secao) => { c.setMetSecao(secao); c.go('metodologia'); };
  return (
    <>
      <div style={s('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:22px')}>
        <Card pad="20px 22px" radius={16}><div style={s('font-size:29px;font-weight:800;color:#12B76A')}>{linhas.length - fora.length}</div><div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6')}>INDICADORES NO ALVO</div></Card>
        <Card pad="20px 22px" radius={16}><div style={s('font-size:29px;font-weight:800;color:#EF6A5A')}>{fora.length}</div><div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6')}>FORA DA META</div></Card>
        <Card pad="20px 22px" radius={16}><div style={s('font-size:29px;font-weight:800;color:#0B2454')}>{linhas.length}</div><div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6')}>INDICADORES ACOMPANHADOS</div></Card>
      </div>

      {piores.length > 0 && (
        <Card style="margin-bottom:26px">
          <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>O que olhar primeiro</div>
          <div style={s('font-size:13px;color:#7A8398;margin-bottom:14px')}>Os indicadores mais distantes da meta, comparados com a média do time.</div>
          {piores.map(l => (
            <div key={l.ind.id} style={s('padding:12px 0;border-top:1px solid #F0F2F7;font-size:14px;line-height:1.6')}>
              <b>{l.ind.nome}</b>: você está em {fmtValor(l.valor, l.ind.un)}, a meta é {fmtValor(l.meta, l.ind.un)} e a média do time é {fmtValor(l.med, l.ind.un)}.
              <div style={s('margin-top:8px;display:flex;gap:8px;flex-wrap:wrap')}>
                {l.ind.sug.map(sg => (
                  <span key={sg.t} onClick={() => abrir(sg.secao)} style={s('cursor:pointer;font-size:12px;font-weight:700;color:#0B2454;background:#EEF1F6;padding:6px 12px;border-radius:100px')}>{sg.tipo}: {sg.t}</span>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      {grupos.map(g => (
        <div key={g} style={{ marginBottom: 26 }}>
          <div style={s('font-size:16px;font-weight:700;margin-bottom:12px')}>{g}</div>
          <div style={s('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px')}>
            {linhas.filter(l => l.ind.grupo === g).map(l => (
              <div key={l.ind.id} style={{ ...s('background:#fff;border:1px solid #E9ECF3;border-radius:14px;padding:16px 18px'), borderLeft: `5px solid ${l.ok ? VERDE : VERMELHO}` }}>
                <div style={s('display:flex;align-items:center;gap:8px;margin-bottom:8px')}><Selo ok={l.ok} /><div style={s('font-size:13px;font-weight:700;line-height:1.3')}>{l.ind.nome}</div></div>
                <div style={s('font-size:26px;font-weight:800;letter-spacing:-.02em;margin-bottom:2px')}>{fmtValor(l.valor, l.ind.un)}</div>
                {l.ind.sub && <div style={s('font-size:11.5px;color:#9AA3B5;margin-bottom:6px')}>{l.ind.sub}</div>}
                <div style={s('font-size:12px;color:#7A8398;line-height:1.6')}>Meta: {l.ind.melhor === 'menor' ? 'até ' : ''}{fmtValor(l.meta, l.ind.un)}<br />Média do time: {fmtValor(l.med, l.ind.un)}</div>
                {!l.ok && (
                  <div style={s('margin-top:10px;padding-top:10px;border-top:1px solid #F0F2F7')}>
                    <div style={s('font-size:10.5px;letter-spacing:.1em;font-weight:800;color:#B42318;margin-bottom:6px')}>PARA MELHORAR</div>
                    {l.ind.sug.map(sg => (
                      <div key={sg.t} onClick={() => abrir(sg.secao)} style={s('cursor:pointer;font-size:12.5px;font-weight:600;color:#0B2454;padding:3px 0')}>→ {SECAO_LABEL[sg.secao]}: {sg.t}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Lider({ c, metas, setMetas }: { c: Central; metas: Record<string, number>; setMetas: (m: Record<string, number>) => void }) {
  const time = PESSOAS;
  const gargalos = INDICADORES.map((ind, i) => ({ ind, n: time.filter(p => !noAlvo(ind.melhor, p.valores[i], metaDe(ind.id, metas))).length })).sort((a, b) => b.n - a.n).slice(0, 3);
  const col = `minmax(190px,1.6fr) 96px 96px repeat(${time.length},minmax(84px,1fr))`;
  const alterar = (ind: Indicador, v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    const m = { ...metas }; if (Number.isFinite(n)) m[ind.id] = n; else delete m[ind.id];
    setMetas(m); saveMetas(m);
  };
  return (
    <>
      <div style={s('display:grid;grid-template-columns:repeat(' + time.length + ',minmax(0,1fr));gap:12px;margin-bottom:22px')}>
        {time.map(p => {
          const v = vermelhos(p.id, metas);
          return (
            <Card key={p.id} pad="16px 18px" radius={14}>
              <div style={s('font-size:13px;font-weight:700;margin-bottom:6px')}>{p.nome}</div>
              <div style={{ ...s('font-size:26px;font-weight:800'), color: v > 8 ? VERMELHO : v > 4 ? '#F5A524' : VERDE }}>{v}</div>
              <div style={s('font-size:11px;color:#8A93A6')}>fora da meta</div>
            </Card>
          );
        })}
      </div>
      <Card style="margin-bottom:22px">
        <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Gargalos do time</div>
        <div style={s('font-size:13px;color:#7A8398;margin-bottom:12px')}>Indicadores em que mais pessoas estão fora da meta. Boa pauta para treinamento.</div>
        {gargalos.map(g => (
          <div key={g.ind.id} style={s('padding:10px 0;border-top:1px solid #F0F2F7;font-size:14px')}><b>{g.ind.nome}</b>: {g.n} de {time.length} pessoas fora da meta.</div>
        ))}
      </Card>
      <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Equipe por indicador</div>
      <div style={s('font-size:13px;color:#7A8398;margin-bottom:12px')}>Altere a meta de cada indicador na coluna Meta. Ela vale para o líder e para os vendedores.</div>
      <Card pad="6px 18px" radius={16}>
        <div style={{ ...s('display:grid;gap:8px;align-items:center;padding:12px 0;border-bottom:1px solid #EEF1F6;font-size:10.5px;letter-spacing:.1em;font-weight:700;color:#9AA3B5'), gridTemplateColumns: col }}>
          <span>INDICADOR</span><span>META</span><span>MÉDIA</span>{time.map(p => <span key={p.id}>{p.nome.toUpperCase()}</span>)}
        </div>
        {INDICADORES.map((ind, i) => (
          <div key={ind.id} style={{ ...s('display:grid;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid #F5F7FA;font-size:12.5px'), gridTemplateColumns: col }}>
            <span style={s('font-weight:600;line-height:1.3')}>{ind.nome}</span>
            <input defaultValue={String(metaDe(ind.id, metas)).replace('.', ',')} onBlur={e => alterar(ind, e.target.value)} aria-label={'Meta de ' + ind.nome} style={s('width:80px;padding:6px 8px;border-radius:8px;border:1px solid #E5E8F0;background:#fff;font-size:12.5px;color:#0F172A;outline:none')} />
            <span style={s('color:#7A8398')}>{fmtValor(media(i), ind.un)}</span>
            {time.map(p => {
              const ok = noAlvo(ind.melhor, p.valores[i], metaDe(ind.id, metas));
              return <span key={p.id} style={s(`display:inline-block;padding:5px 10px;border-radius:8px;font-weight:700;text-align:center;${ok ? 'background:#DCFCE7;color:#0B6B3F' : 'background:#FFF1F0;color:#B42318'}`)}>{fmtValor(p.valores[i], ind.un)}</span>;
            })}
          </div>
        ))}
      </Card>
      <div style={s('margin-top:14px;font-size:12.5px;color:#7A8398;line-height:1.6')}>Quando um vendedor fica vermelho, ele vê na tela de Resultados os vídeos, gravações, materiais e checklists sugeridos para aquele indicador.</div>
      <div onClick={() => { setMetas({}); saveMetas({}); c.showToast('Metas voltaram ao padrão'); }} style={s('margin-top:12px;display:inline-block;cursor:pointer;font-size:12.5px;font-weight:700;color:#0B2454')}>Restaurar metas padrão</div>
    </>
  );
}

/** Resultados do setor Comercial: cada indicador fica verde ou vermelho contra a meta. Visão do vendedor e do líder. */
export function Resultados({ c }: { c: Central }) {
  const [visao, setVisao] = useState<Visao>('vendedor');
  const [metas, setMetas] = useState<Record<string, number>>(() => loadMetas());
  const aba = (id: Visao, label: string) => (
    <div onClick={() => setVisao(id)} style={s(`cursor:pointer;padding:9px 18px;border-radius:100px;font-size:13px;white-space:nowrap;${visao === id ? 'background:#0B2454;color:#fff;font-weight:700' : 'color:#5B6478;font-weight:600'}`)}>{label}</div>
  );
  return (
    <div style={{ maxWidth: 1180 }}>
      <div style={s('display:flex;align-items:flex-start;gap:20px;margin-bottom:6px')}>
        <div style={{ flex: 1 }}>
          <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>Resultados</div>
          <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:20px')}>{visao === 'vendedor' ? 'Seus indicadores do mês. Verde está no alvo, vermelho precisa de atenção.' : 'Como o time está contra as metas, por pessoa e por indicador.'}</div>
        </div>
        <div style={s('display:flex;gap:4px;padding:4px;border-radius:100px;background:#F3F5FA;border:1px solid #E5E8F0')}>{aba('vendedor', 'Visão do vendedor')}{aba('lider', 'Visão do líder')}</div>
      </div>
      <Aviso />
      {visao === 'vendedor' ? <Vendedor c={c} metas={metas} /> : <Lider c={c} metas={metas} setMetas={setMetas} />}
    </div>
  );
}
