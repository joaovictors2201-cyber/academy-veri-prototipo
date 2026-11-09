import { useState } from 'react';
import { Central } from './useCentral';
import { Bar, Card, s } from './ui';
import { capaYoutube, Trilha, Video } from './data';
import { DEMO_CHECKLISTS, Secao } from './demo';
import { Materiais } from './Materiais';

const SECOES: { id: Secao; label: string; sub: string }[] = [
  { id: 'videos', label: 'Vídeos', sub: 'Cortes da rotina do vendedor, da abertura ao fechamento.' },
  { id: 'gravacoes', label: 'Gravações', sub: 'Apresentações reais do time, por tipo de objeção.' },
  { id: 'materiais', label: 'Materiais', sub: 'Ebooks, scripts, planilhas e apresentações.' },
  { id: 'checklists', label: 'Checklists', sub: 'Passo a passo para usar durante a conversa.' },
];

function Grade({ c, trilhas }: { c: Central; trilhas: Trilha[] }) {
  return (
    <>
      {trilhas.map(t => {
        const feito = t.videos.filter(v => c.done[v.id]).length;
        const p = t.videos.length ? Math.round((feito / t.videos.length) * 100) : 0;
        return (
          <div key={t.id} style={{ marginBottom: 30 }}>
            <div style={s('display:flex;align-items:center;gap:18px;margin-bottom:6px')}>
              <div style={s('font-size:17px;font-weight:700')}>{t.nome}</div>
              <div style={{ flex: 1 }} />
              <div style={s('font-size:12.5px;color:#8A93A6')}>{feito} de {t.videos.length} concluídos</div>
              <div style={{ width: 96 }}><Bar pct={p + '%'} track="#E5E8F0" h={5} /></div>
            </div>
            <div style={s('font-size:13px;color:#7A8398;margin-bottom:14px')}>{t.desc}</div>
            <div style={s('display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px')}>
              {t.videos.map((v: Video) => {
                const d = !!c.done[v.id], pos = d ? 100 : c.pos[v.id] || 0;
                const semMidia = !v.src && !v.youtube;
                return (
                  <div key={v.id} onClick={() => c.openVideo(v.id)} style={{ ...s('background:#fff;border:1px solid #E9ECF3;border-radius:13px;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,.04)'), cursor: 'pointer' }}>
                    <div style={{ ...s('position:relative;height:104px;background:linear-gradient(135deg,#0B2454 0%,#0B2454 100%);display:flex;align-items:center;justify-content:center'), ...capaYoutube(v) }}>
                      {d
                        ? <span style={s('padding:6px 12px;border-radius:100px;background:#DCFCE7;color:#0B6B3F;font-size:10px;letter-spacing:.09em;font-weight:800')}>✓ CONCLUÍDO</span>
                        : <span style={s('width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.9);color:#0B2454;font-size:12px;display:flex;align-items:center;justify-content:center')}>▶</span>}
                      {pos > 0 && pos < 100 && <div style={s('position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.22)')}><div style={{ height: '100%', background: '#fff', width: pos + '%' }} /></div>}
                    </div>
                    <div style={s('padding:12px 13px 13px')}>
                      <div style={s('font-size:13px;font-weight:600;line-height:1.35;margin-bottom:8px;min-height:35px')}>{v.t}</div>
                      <div style={s('display:flex;align-items:center;justify-content:space-between')}>
                        <span style={s('font-size:11.5px;color:#9AA3B5')}>◷ {v.min} min</span>
                        {semMidia && <span style={s('font-size:10px;letter-spacing:.08em;font-weight:800;color:#9AA3B5')}>A GRAVAR</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function Checklists() {
  const [marcas, setMarcas] = useState<Record<string, boolean>>({});
  return (
    <div style={s('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px')}>
      {DEMO_CHECKLISTS.map(ck => {
        const n = ck.itens.filter((_, i) => marcas[ck.id + i]).length;
        return (
          <Card key={ck.id} pad="20px 22px" radius={16}>
            <div style={s('display:flex;align-items:center;margin-bottom:10px')}>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>{ck.t}</div>
              <span style={s(`padding:4px 10px;border-radius:100px;font-size:10.5px;font-weight:800;${n === ck.itens.length ? 'background:#DCFCE7;color:#0B6B3F' : 'background:#F1F3F8;color:#7A8398'}`)}>{n}/{ck.itens.length}</span>
            </div>
            {ck.itens.map((it, i) => (
              <label key={it} style={s('display:flex;gap:10px;align-items:center;font-size:13.5px;padding:8px 0;border-top:1px solid #F0F2F7;cursor:pointer')}>
                <input type="checkbox" checked={!!marcas[ck.id + i]} onChange={e => setMarcas(m => ({ ...m, [ck.id + i]: e.target.checked }))} />{it}
              </label>
            ))}
          </Card>
        );
      })}
    </div>
  );
}

/** Metodologia do setor: junta a antiga "Trilha de área" e os "Materiais", em quatro seções. */
export function Metodologia({ c }: { c: Central }) {
  const area = c.areas.find(a => a.id === 'comercial');
  const secao = c.metSecao;
  const atual = SECOES.find(x => x.id === secao) || SECOES[0];
  const trilhas = area?.trilhas || [];
  return (
    <div style={{ maxWidth: 1180 }}>
      <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>Metodologia</div>
      <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:20px')}>Como o time Comercial trabalha: vídeos, gravações, materiais e checklists em um só lugar.</div>
      <div style={s('display:flex;flex-wrap:wrap;gap:9px;margin-bottom:8px')}>
        {SECOES.map(x => {
          const on = x.id === atual.id;
          return (
            <div key={x.id} onClick={() => c.setMetSecao(x.id)} style={{ cursor: 'pointer' }}>
              <div style={s(`padding:10px 18px;border-radius:100px;font-size:13px;font-weight:${on ? 700 : 600};background:${on ? '#0B2454' : '#fff'};color:${on ? '#fff' : '#5B6478'};border:1px solid ${on ? '#0B2454' : '#E5E8F0'}`)}>{x.label}</div>
            </div>
          );
        })}
      </div>
      <div style={s('font-size:13px;color:#7A8398;margin:12px 0 22px')}>{atual.sub}</div>
      {atual.id === 'videos' && <Grade c={c} trilhas={trilhas.filter(t => t.id !== 'modelos')} />}
      {atual.id === 'gravacoes' && <Grade c={c} trilhas={trilhas.filter(t => t.id === 'modelos')} />}
      {atual.id === 'materiais' && <Materiais c={c} embed />}
      {atual.id === 'checklists' && <Checklists />}
    </div>
  );
}
