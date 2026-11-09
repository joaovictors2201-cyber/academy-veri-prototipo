import { useState } from 'react';
import { Central } from './useCentral';
import { Card, s } from './ui';
import { iniciais } from './data';
import { AGENDA, COMUNICADOS, CONTATOS, DEMO_POSTS, DOCS, Post } from './demo';

const ABAS = ['Conversa', 'Comunicados', 'Calendário', 'Contatos', 'Documentos'] as const;
type Aba = typeof ABAS[number];

function Conversa({ c }: { c: Central }) {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [novo, setNovo] = useState('');
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [abertos, setAbertos] = useState<Record<number, boolean>>({});
  const [rasc, setRasc] = useState<Record<number, string>>({});
  const nome = c.user?.nome || 'Você';
  const input = 'width:100%;padding:11px 14px;border-radius:100px;border:1px solid #E5E8F0;background:#fff;font-size:13.5px;outline:none;color:#0F172A';
  const btn = 'cursor:pointer;padding:10px 20px;border-radius:100px;background:#0B2454;color:#fff;font-size:13px;font-weight:700;white-space:nowrap';
  return (
    <div style={{ maxWidth: 820 }}>
      <Card pad="16px 20px" style="margin-bottom:14px">
        <div style={s('display:flex;gap:12px;align-items:center')}>
          <span style={s('width:36px;height:36px;flex:none;border-radius:50%;background:#0B2454;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(nome)}</span>
          <input value={novo} onChange={e => setNovo(e.target.value)} placeholder="Compartilhe algo com o time..." style={s(input)} />
          <div style={s(btn)} onClick={() => { if (!novo.trim()) return; setPosts(l => [{ autor: nome, cargo: 'Comercial', tempo: 'agora', txt: novo.trim(), likes: 0, coments: [] }, ...l]); setNovo(''); c.showToast('Postagem publicada'); }}>Publicar</div>
        </div>
      </Card>
      {posts.map((po, i) => (
        <Card key={`${i}-${po.txt}`} style="margin-bottom:12px">
          <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:12px')}>
            <span style={s('width:38px;height:38px;border-radius:50%;background:#0B2454;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(po.autor)}</span>
            <div><div style={s('font-size:13.5px;font-weight:700')}>{po.autor}</div><div style={s('font-size:11.5px;color:#9AA3B5')}>{po.cargo} · {po.tempo}</div></div>
          </div>
          <div style={s('font-size:14px;line-height:1.65;margin-bottom:12px')}>{po.txt}</div>
          <div style={s('font-size:12px;color:#9AA3B5;padding-bottom:10px;border-bottom:1px solid #F0F2F7')}>{po.likes + (likes[i] ? 1 : 0)} curtidas · {po.coments.length} comentários</div>
          <div style={s('display:flex;gap:22px;font-size:13px;color:#5B6478;font-weight:600;padding-top:10px')}>
            <span style={{ cursor: 'pointer', fontWeight: likes[i] ? 800 : 600 }} onClick={() => setLikes(l => ({ ...l, [i]: !l[i] }))}>{likes[i] ? '♥ Curtiu' : '♡ Curtir'}</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setAbertos(a => ({ ...a, [i]: !a[i] }))}>Comentar</span>
          </div>
          {abertos[i] && (
            <div style={s('margin-top:12px')}>
              {po.coments.map((cm, k) => (
                <div key={k} style={s('display:flex;gap:10px;margin-bottom:10px')}>
                  <span style={s('width:28px;height:28px;flex:none;border-radius:50%;background:#EEF1F6;color:#0B2454;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center')}>{iniciais(cm.autor)}</span>
                  <div style={s('padding:9px 13px;border-radius:12px;background:#F3F5FA;font-size:13px;line-height:1.5')}><b>{cm.autor}</b><br />{cm.txt}</div>
                </div>
              ))}
              <div style={s('display:flex;gap:8px;margin-top:6px')}>
                <input value={rasc[i] || ''} onChange={e => setRasc(r => ({ ...r, [i]: e.target.value }))} placeholder="Escreva um comentário..." style={s(input)} />
                <div style={s(btn)} onClick={() => { const t = (rasc[i] || '').trim(); if (!t) return; setPosts(l => l.map((x, n) => (n === i ? { ...x, coments: [...x.coments, { autor: nome, txt: t }] } : x))); setRasc(r => ({ ...r, [i]: '' })); }}>Enviar</div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

/** Intranet do time: conversa entre colaboradores, comunicados, calendário, contatos e documentos. Substitui os Workshops. */
export function Intranet({ c }: { c: Central }) {
  const [aba, setAba] = useState<Aba>('Conversa');
  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>Intranet</div>
      <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:20px')}>O espaço do time: converse com os colegas, acompanhe os comunicados e encontre quem resolve cada assunto.</div>
      <div style={s('display:flex;flex-wrap:wrap;gap:9px;margin-bottom:22px')}>
        {ABAS.map(a => (
          <div key={a} onClick={() => setAba(a)} style={s(`cursor:pointer;padding:10px 18px;border-radius:100px;font-size:13px;font-weight:${aba === a ? 700 : 600};background:${aba === a ? '#0B2454' : '#fff'};color:${aba === a ? '#fff' : '#5B6478'};border:1px solid ${aba === a ? '#0B2454' : '#E5E8F0'}`)}>{a}</div>
        ))}
      </div>
      {aba === 'Conversa' && <Conversa c={c} />}
      {aba === 'Comunicados' && COMUNICADOS.map(x => (
        <Card key={x.t} style="margin-bottom:10px" pad="16px 22px"><div style={s('display:flex;align-items:center;gap:10px;margin-bottom:4px')}><div style={s('font-size:14.5px;font-weight:700')}>{x.t}</div><span style={s('font-size:10.5px;font-weight:800;color:#7A8398;background:#F1F3F8;padding:3px 9px;border-radius:100px')}>{x.q.toUpperCase()}</span></div><div style={s('font-size:13px;color:#7A8398;line-height:1.6')}>{x.d}</div></Card>
      ))}
      {aba === 'Calendário' && AGENDA.map(x => (
        <Card key={x.t} style="margin-bottom:10px;display:flex;align-items:center;gap:16px" pad="14px 22px"><div style={s('width:46px;height:46px;border-radius:13px;background:#EEF1F6;color:#0B2454;font-weight:800;display:flex;align-items:center;justify-content:center')}>{x.d}</div><div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{x.t}</div><div style={s('font-size:13px;font-weight:700;color:#0B2454')}>{x.h}</div></Card>
      ))}
      {aba === 'Contatos' && <div style={s('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px')}>{CONTATOS.map(x => <Card key={x.nome} pad="16px 20px"><div style={s('font-size:14.5px;font-weight:700')}>{x.nome}</div><div style={s('font-size:11px;letter-spacing:.1em;font-weight:700;color:#8A93A6;margin:3px 0 6px')}>{x.area.toUpperCase()}</div><div style={s('font-size:13px;color:#7A8398')}>{x.d}</div></Card>)}</div>}
      {aba === 'Documentos' && DOCS.map(x => (
        <Card key={x} style="margin-bottom:10px;display:flex;align-items:center" pad="14px 22px"><div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{x}</div><span onClick={() => c.showToast('Documento de exemplo')} style={s('cursor:pointer;font-size:12.5px;font-weight:700;color:#0B2454')}>Abrir</span></Card>
      ))}
    </div>
  );
}
