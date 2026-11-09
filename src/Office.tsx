import { useEffect, useState } from 'react';
import { Central } from './useCentral';
import { iniciais, prefsDef } from './data';
import { api } from './api';
import { quandoLabel } from './format';
import { Bar, Card, PageTitle, s } from './ui';

interface Office {
  empresa: string;
  equipe: { nome: string; cargo: string; papel: 'master' | 'sub'; pct: number; cert: boolean }[];
  duvidas: { autor: string; origem: string; texto: string; quando: string }[];
  abandono: { t: string; iniciaram: number; pct: number }[];
}

const empty = (txt: string) => <div style={s('font-size:13px;line-height:1.7;color:#8A93A6;padding:6px 0')}>{txt}</div>;

// Defesa extra de interface: o servidor também recusa /api/office para quem não é master.
export function Master({ c }: { c: Central }) {
  const [data, setData] = useState<Office | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => { api<Office>('/api/office').then(setData).catch(() => setErr(true)); }, []);

  if (c.user?.papel !== 'master') return <PageTitle title="Painel do Escritório" sub="Disponível apenas para o usuário master do escritório." />;
  if (err) return <PageTitle title="Painel do Escritório" sub="Não foi possível carregar os dados agora." />;
  if (!data) return <PageTitle title="Painel do Escritório" sub="Carregando..." />;

  const certs = data.equipe.filter(p => p.cert).length;
  const media = data.equipe.length ? Math.round(data.equipe.reduce((n, p) => n + p.pct, 0) / data.equipe.length) : 0;
  const kpis = [
    { v: String(data.equipe.length), l: 'USUÁRIOS ATIVOS' }, { v: String(certs), l: 'CONCLUÍRAM O PROGRAMA' },
    { v: media + '%', l: 'PROGRESSO MÉDIO' }, { v: String(data.duvidas.length), l: 'DÚVIDAS NA FILA' },
  ];
  return (
    <div style={{ maxWidth: 1180 }}>
      <div style={s('display:flex;align-items:center;gap:12px;margin-bottom:6px')}>
        <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em')}>Painel do Escritório</div>
        <span style={s('padding:5px 11px;border-radius:100px;background:#FFF7DE;color:#7A5A00;font-size:10px;letter-spacing:.1em;font-weight:800')}>USUÁRIO MASTER</span>
      </div>
      <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:22px')}>{data.empresa || 'Escritório'} · {data.equipe.length} {data.equipe.length === 1 ? 'usuário' : 'usuários'} · visível apenas para o usuário master do escritório</div>
      <div style={s('display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:20px')}>
        {kpis.map(k => (
          <Card key={k.l} pad="20px 22px" radius={16}>
            <div style={s('font-size:29px;font-weight:800;color:#0B2454;margin-bottom:4px')}>{k.v}</div>
            <div style={s('font-size:11px;letter-spacing:.12em;font-weight:700;color:#8A93A6')}>{k.l}</div>
          </Card>
        ))}
      </div>
      <Card style="margin-bottom:18px">
        <div style={s('font-size:16px;font-weight:700;margin-bottom:16px')}>Equipe</div>
        <div style={s('display:flex;align-items:center;gap:16px;padding-bottom:10px;border-bottom:1px solid #EEF1F6;font-size:10.5px;letter-spacing:.12em;font-weight:700;color:#9AA3B5')}>
          <span style={{ flex: 1.6 }}>PESSOA</span><span style={{ flex: 1 }}>PAPEL</span><span style={{ flex: 1.4 }}>PROGRESSO</span><span style={{ flex: 0.9, textAlign: 'right' }}>PROGRAMA</span>
        </div>
        {data.equipe.map(p => (
          <div key={p.nome} style={s('display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #F5F7FA')}>
            <span style={s('flex:1.6;display:flex;align-items:center;gap:11px;min-width:0')}>
              <span style={s(`width:32px;height:32px;flex:none;border-radius:50%;background:${p.papel === 'master' ? '#0B2454' : '#0B2454'};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center`)}>{iniciais(p.nome)}</span>
              <span style={{ minWidth: 0 }}><span style={s('display:block;font-size:13.5px;font-weight:600')}>{p.nome}</span><span style={s('display:block;font-size:11.5px;color:#9AA3B5')}>{p.cargo}</span></span>
            </span>
            <span style={s('flex:1;font-size:12.5px;color:#5B6478')}>{p.papel === 'master' ? 'Master' : 'Sub-usuário'}</span>
            <span style={s('flex:1.4;display:flex;align-items:center;gap:11px')}>
              <span style={{ flex: 1 }}><Bar pct={p.pct + '%'} /></span>
              <span style={s('font-size:12px;font-weight:700;color:#0B2454;width:36px;text-align:right')}>{p.pct}%</span>
            </span>
            <span style={s(`flex:.9;text-align:right;font-size:11px;font-weight:700;letter-spacing:.06em;color:${p.cert ? '#0B6B3F' : '#9AA3B5'}`)}>{p.cert ? 'CONCLUÍDO' : 'EM ANDAMENTO'}</span>
          </div>
        ))}
      </Card>
      <div style={s('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px')}>
        <Card>
          <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Dúvidas na fila do escritório</div>
          <div style={s('font-size:12.5px;color:#8A93A6;margin-bottom:16px')}>Dúvidas enviadas pela equipe nos vídeos.</div>
          {data.duvidas.length === 0 && empty('Nenhuma dúvida enviada ainda.')}
          {data.duvidas.map((q, i) => (
            <div key={i} style={s('padding:13px 0;border-top:1px solid #F0F2F7')}>
              <div style={s('font-size:11px;font-weight:700;color:#9AA3B5;margin-bottom:5px')}>{q.origem} · {q.autor} · {quandoLabel(q.quando)}</div>
              <div style={s('font-size:13px;line-height:1.6;color:#39415A;margin-bottom:8px')}>{q.texto}</div>
              <span style={s('font-size:11px;font-weight:700;color:#B42318;background:#FFF1F0;padding:4px 10px;border-radius:100px')}>AGUARDANDO</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={s('font-size:16px;font-weight:700;margin-bottom:4px')}>Onde a equipe abandona</div>
          <div style={s('font-size:12.5px;color:#8A93A6;margin-bottom:18px')}>Dos que começaram cada vídeo, quantos ainda não concluíram.</div>
          {data.abandono.length === 0 && empty('Sem dados de reprodução ainda.')}
          {data.abandono.map(a => (
            <div key={a.t} style={{ marginBottom: 14 }}>
              <div style={s('display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px')}><span style={s('font-weight:600;color:#39415A')}>{a.t}</span><span style={{ color: '#8A93A6' }}>{a.pct}% · {a.iniciaram} {a.iniciaram === 1 ? 'pessoa' : 'pessoas'}</span></div>
              <Bar pct={a.pct + '%'} fill={a.pct >= 60 ? '#EF6A5A' : a.pct >= 35 ? '#F5A524' : '#12B76A'} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export function Notificacoes() {
  return (
    <div style={{ maxWidth: 760 }}>
      <PageTitle title="Notificações" sub="Retornos do suporte, novos módulos e lembretes da sua trilha." />
      <Card pad="44px 40px" radius={14} style="text-align:center">
        <div style={s('font-size:16px;font-weight:700;margin-bottom:8px')}>Você está em dia</div>
        <div style={s('font-size:13.5px;line-height:1.7;color:#7A8398')}>Não há notificações por enquanto. Respostas do suporte e novidades da sua trilha aparecem aqui.</div>
      </Card>
    </div>
  );
}

export function Config({ c }: { c: Central }) {
  return (
    <div style={{ maxWidth: 700 }}>
      <PageTitle title="Configurações" sub="Sua conta é gerenciada pelo Portal VERI — aqui ficam apenas as preferências da central." />
      <Card pad="8px 26px" style="margin-bottom:18px">
        {prefsDef.map(p => {
          const on = !!c.prefs[p.k];
          return (
            <div key={p.k} onClick={() => c.togglePref(p.k)} style={s('display:flex;align-items:center;gap:18px;padding:18px 0;border-top:1px solid #F0F2F7;cursor:pointer')}>
              <span style={s('flex:1;min-width:0')}>
                <span style={s('display:block;font-size:14px;font-weight:600;margin-bottom:3px')}>{p.t}</span>
                <span style={s('display:block;font-size:12.5px;color:#8A93A6;line-height:1.55')}>{p.d}</span>
              </span>
              <span style={s(`width:44px;height:25px;flex:none;border-radius:100px;background:${on ? '#0B2454' : '#D6DBE6'};padding:3px;display:flex;justify-content:${on ? 'flex-end' : 'flex-start'}`)}>
                <span style={s('width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2)')} />
              </span>
            </div>
          );
        })}
      </Card>
      <div onClick={c.redoTour} style={s('display:inline-block;padding:13px 24px;border-radius:100px;border:1px solid #E5E8F0;background:#fff;color:#39415A;font-size:13.5px;font-weight:600;cursor:pointer')}>Refazer tutorial de primeiro acesso</div>
    </div>
  );
}
