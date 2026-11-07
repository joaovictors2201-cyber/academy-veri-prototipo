import { ReactNode, useState } from 'react';
import { applyTheme, Theme } from './themes';
import { Bar, Card, s } from './ui';
import { ThemeToggle } from './ThemeToggle';
import {
  CHECKLISTS, CONQUISTAS, CONQUISTAS_EXT, CONTEUDOS, DESCONTO_POR_MISSAO, ETAPAS, EVENTOS, FONTES, GRAVACOES, INDICACOES_INI, INTRANET, LIVES,
  MARCOS_BRINDES, MATERIAIS, MISSOES, NAV, NIVEL, OFERTAS, PERSONAS, POSTS, PROBLEMAS, PersonaId, ScreenId, SISTEMA, SOBRE, SUPORTE, TREINOS,
} from './mock';

const LOGO = import.meta.env.BASE_URL + 'assets/logo-veri-academy-light.png';
const iniciais = (n: string) => n.split(' ').map(p => p[0]).slice(0, 2).join('');

const Lock = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

const Btn = ({ children, onClick, ghost, small }: { children: ReactNode; onClick?: () => void; ghost?: boolean; small?: boolean }) => (
  <div onClick={onClick} style={s(`display:inline-block;cursor:pointer;padding:${small ? '8px 16px' : '12px 24px'};border-radius:100px;font-size:${small ? 12.5 : 14}px;font-weight:700;${ghost ? 'background:#fff;border:1px solid #D6DBE6;color:#0B2454' : 'background:#0B2454;color:#fff'}`)}>{children}</div>
);
const Tag = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'grey' }) => {
  const m = { blue: '#EEF1F6;color:#0B2454', green: '#DCFCE7;color:#0B6B3F', amber: '#FFF7DE;color:#7A5A00', grey: '#F1F3F8;color:#7A8398' }[tone];
  return <span style={s(`display:inline-block;padding:4px 10px;border-radius:100px;font-size:10.5px;font-weight:800;letter-spacing:.06em;background:${m}`)}>{children}</span>;
};
const Title = ({ t, sub }: { t: string; sub: string }) => (
  <>
    <div style={s('font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px')}>{t}</div>
    <div style={s('font-size:13.5px;color:#7A8398;margin-bottom:22px;max-width:760px;line-height:1.6')}>{sub}</div>
  </>
);
const Grid = ({ n, children }: { n: number; children: ReactNode }) => (
  <div style={s(`display:grid;grid-template-columns:repeat(${n},minmax(0,1fr));gap:14px`)}>{children}</div>
);
const Section = ({ t, children }: { t: string; children: ReactNode }) => (
  <div style={s('margin-bottom:28px')}><div style={s('font-size:16px;font-weight:700;margin-bottom:12px')}>{t}</div>{children}</div>
);

export default function Proto() {
  const [persona, setPersona] = useState<PersonaId>('lead');
  const [screen, setScreen] = useState<ScreenId>('inicio');
  const [theme, setTheme] = useState<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  const [toast, setToast] = useState('');
  const [dia, setDia] = useState(3);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [indicacoes, setIndicacoes] = useState(INDICACOES_INI);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [sorteios, setSorteios] = useState<Record<string, boolean>>({});
  const [upgrade, setUpgrade] = useState(false);
  const [missoes, setMissoes] = useState<Record<string, boolean>>({});
  const [premio, setPremio] = useState('');
  const [posts, setPosts] = useState(POSTS);
  const [abertos, setAbertos] = useState<Record<number, boolean>>({});
  const [problemaSel, setProblemaSel] = useState('cnd');

  const nivel = NIVEL[persona];
  const p = PERSONAS.find(x => x.id === persona)!;
  const nav = NAV[persona];
  const say = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2400); };
  const locked = (plano: number) => nivel < plano;
  const desconto = Object.values(missoes).filter(Boolean).length * DESCONTO_POR_MISSAO;
  /** Missão do teste grátis: só vale para o lead e uma vez por missão. Abre o pop-up de prêmio. */
  const missao = (id: string) => {
    if (persona !== 'lead' || missoes[id]) return false;
    setMissoes(m => ({ ...m, [id]: true }));
    setPremio(`Você ganhou mais ${DESCONTO_POR_MISSAO}% de desconto na implantação da Veri. Total: ${desconto + DESCONTO_POR_MISSAO}%.`);
    return true;
  };
  const abrir = (plano: number, nome: string, missaoId = 'm1') => {
    if (locked(plano)) { setUpgrade(true); return; }
    if (!missao(missaoId)) say(`Abrindo: ${nome}`);
  };
  const trocar = (id: PersonaId) => { setPersona(id); setScreen('inicio'); };
  const toggleTheme = () => setTheme(t => { const n: Theme = t === 'dark' ? 'light' : 'dark'; applyTheme(n); return n; });
  const planoNome = (pl: number) => (pl === 1 ? 'Veri Academy' : 'Cliente Veri');

  // ---------- peças reutilizáveis ----------
  const Capa = ({ cor, children, h = 104 }: { cor: string; children?: ReactNode; h?: number }) => (
    <div style={{ ...s('position:relative;display:flex;align-items:center;justify-content:center'), height: h, background: `linear-gradient(135deg,${cor},#0B2454)` }}>{children}</div>
  );
  const Cartao = ({ t, sub, plano, cor = '#0B2454', onClick, parceiro, tag }: { t: string; sub: string; plano: number; cor?: string; onClick?: () => void; parceiro?: boolean; tag?: string }) => {
    const bloq = locked(plano);
    return (
      <div onClick={onClick || (() => abrir(plano, t))} style={{ ...s('background:#fff;border:1px solid #E9ECF3;border-radius:13px;overflow:hidden;cursor:pointer') }}>
        <Capa cor={cor}>
          <span style={{ ...s('width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.9);color:#0B2454;display:flex;align-items:center;justify-content:center;font-size:12px'), opacity: bloq ? 0.9 : 1 }}>{bloq ? <Lock size={17} /> : '▶'}</span>
        </Capa>
        <div style={s('padding:12px 14px 14px')}>
          {(parceiro || tag) && <div style={s('margin-bottom:8px;display:flex;gap:6px;flex-wrap:wrap')}>{parceiro && <Tag tone="blue">PARCEIRO</Tag>}{tag && <Tag tone="green">{tag.toUpperCase()}</Tag>}</div>}
          <div style={s('font-size:13px;font-weight:600;line-height:1.35;margin-bottom:8px;min-height:35px')}>{t}</div>
          <div style={s('display:flex;align-items:center;justify-content:space-between;gap:8px')}>
            <span style={s('font-size:11.5px;color:#9AA3B5')}>{sub}</span>
            {bloq && <Tag tone="amber">{planoNome(plano)}</Tag>}
          </div>
        </div>
      </div>
    );
  };

  // ---------- telas ----------
  const Inicio = () => (
    <div style={s('max-width:1180px')}>
      <div style={s('border-radius:22px;padding:34px 38px;background:linear-gradient(120deg,#0B2454,#12295E);color:#fff;margin-bottom:22px')}>
        <div style={s('font-size:10.5px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.7);margin-bottom:12px')}>{p.papel.toUpperCase()}</div>
        <div style={s('font-size:28px;font-weight:800;line-height:1.25;margin-bottom:10px;max-width:640px')}>
          {persona === 'lead' && 'Bem-vinda, Mariana. Você tem acesso ao conteúdo gratuito por 7 dias.'}
          {persona === 'academy' && 'Continue de onde parou, Rafael. Hoje tem live às 19h.'}
          {persona === 'veri' && 'Camila, aprenda a usar o sistema e indique escritórios que combinam com você.'}
          {persona === 'colab' && 'João, estes são seus treinamentos e materiais da semana.'}
        </div>
        <div style={s('font-size:14px;line-height:1.65;color:rgba(255,255,255,.75);max-width:600px;margin-bottom:20px')}>{p.resumo}</div>
        <div style={s('display:flex;gap:10px;flex-wrap:wrap')}>
          <div onClick={() => setScreen(persona === 'colab' ? 'treinamentos' : 'conteudo')} style={s('cursor:pointer;padding:12px 24px;border-radius:100px;background:#fff;color:#0B2454;font-size:14px;font-weight:700')}>{persona === 'colab' ? 'Ver treinamentos' : 'Continuar assistindo'}</div>
          {persona === 'lead' && <div onClick={() => setScreen('gamificacao')} style={s('cursor:pointer;padding:12px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.5);color:#fff;font-size:14px;font-weight:700')}>Ganhar desconto</div>}
          {persona === 'lead' && <div onClick={() => setScreen('sobre')} style={s('cursor:pointer;padding:12px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.5);color:#fff;font-size:14px;font-weight:700')}>Conhecer a Veri</div>}
          {persona === 'veri' && <div onClick={() => setScreen('indicacao')} style={s('cursor:pointer;padding:12px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.5);color:#fff;font-size:14px;font-weight:700')}>Indicar agora</div>}
        </div>
      </div>

      {persona === 'lead' && (
        <Card style="margin-bottom:22px">
          <div style={s('display:flex;align-items:center;gap:18px;margin-bottom:12px')}>
            <div style={s('font-size:15px;font-weight:700')}>Seu teste grátis: dia {dia} de 7</div>
            <Tag tone={dia >= 6 ? 'amber' : 'blue'}>{7 - dia === 0 ? 'Último dia' : `${7 - dia} dias restantes`}</Tag>
            <div style={{ flex: 1 }} />
            <label style={s('font-size:12px;color:#7A8398;display:flex;align-items:center;gap:8px')}>Simular dia do teste
              <input type="range" min={1} max={7} value={dia} onChange={e => setDia(+e.target.value)} />
            </label>
          </div>
          <Bar pct={`${(dia / 7) * 100}%`} h={8} />
          <div style={s('font-size:13px;color:#7A8398;margin-top:12px;line-height:1.6')}>
            {dia < 6 ? 'Explore os conteúdos abertos. Os marcados com cadeado fazem parte do plano Veri Academy.' : 'Seu teste está acabando. Assine o Veri Academy para manter o acesso ao catálogo e às lives.'}
          </div>
        </Card>
      )}
      {persona === 'academy' && (
        <Card style="margin-bottom:22px;display:flex;align-items:center;gap:18px">
          <div style={{ flex: 1 }}>
            <div style={s('font-size:15px;font-weight:700;margin-bottom:4px')}>Quer ver o sistema Veri por dentro?</div>
            <div style={s('font-size:13px;color:#7A8398;line-height:1.6')}>Clientes Veri recebem tutoriais do sistema, programa de indicação, brindes e suporte mais rápido.</div>
          </div>
          <Btn onClick={() => setUpgrade(true)}>Conhecer o Veri</Btn>
        </Card>
      )}
      {persona === 'veri' && (
        <Grid n={3}>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>PONTOS</div><div style={s('font-size:30px;font-weight:800')}>1.280</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>Nível Prata · faltam 220 para Ouro</div></Card>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>INDICAÇÕES</div><div style={s('font-size:30px;font-weight:800')}>{indicacoes.length}</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>{indicacoes.filter(i => i.status >= 3).length} contrataram</div></Card>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>SUPORTE</div><div style={s('font-size:18px;font-weight:800;margin-top:6px')}>Atendimento prioritário</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>Fila própria para clientes Veri</div></Card>
        </Grid>
      )}
      {persona === 'colab' && (
        <Grid n={3}>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>TREINAMENTOS</div><div style={s('font-size:30px;font-weight:800')}>{TREINOS.filter(t => t.feito).length} de {TREINOS.length}</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>concluídos</div></Card>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>CHECKLISTS</div><div style={s('font-size:30px;font-weight:800')}>{CHECKLISTS.length}</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>rotinas comerciais disponíveis</div></Card>
          <Card><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:8px')}>PRÓXIMA LIVE</div><div style={s('font-size:18px;font-weight:800;margin-top:6px')}>Vendas e negociação</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:4px')}>Terça · 19h</div></Card>
        </Grid>
      )}
      {(persona === 'lead' || persona === 'academy') && (
        <Section t="Para você começar"><Grid n={3}>{CONTEUDOS.slice(0, 3).map(c => <Cartao key={c.id} t={c.t} sub={`${c.tipo} · ${c.min} min`} plano={c.plano} cor={c.cor} parceiro={c.parceiro} tag={c.tag} />)}</Grid></Section>
      )}
    </div>
  );

  const Conteudo = () => (
    <div style={s('max-width:1180px')}>
      <Title t="Conteúdos" sub={persona === 'lead' ? 'No teste grátis você acessa os conteúdos abertos. Os demais ficam marcados com o plano necessário.' : 'Catálogo completo de acordo com o seu plano.'} />
      <Grid n={3}>{CONTEUDOS.map(c => <Cartao key={c.id} t={c.t} sub={`${c.tipo} · ${c.min} min`} plano={c.plano} cor={c.cor} parceiro={c.parceiro} tag={c.tag} />)}</Grid>
    </div>
  );

  const Sistema = () => (
    <div style={s('max-width:1180px')}>
      <Title t="Tutoriais do sistema Veri" sub="Aprenda a usar cada área do sistema. Disponível para clientes Veri e colaboradores." />
      {nivel < 2 ? (
        <Card style="text-align:center" pad="44px"><div style={s('font-size:18px;font-weight:700;margin-bottom:8px')}>Exclusivo para clientes Veri</div><Btn onClick={() => setUpgrade(true)}>Conhecer o Veri</Btn></Card>
      ) : <Grid n={3}>{SISTEMA.map(v => <Cartao key={v.t} t={v.t} sub={`${v.min} min`} plano={2} cor="#1F3C7A" />)}</Grid>}
    </div>
  );

  const Lives = () => (
    <div style={s('max-width:980px')}>
      <Title t="Lives semanais" sub="Uma live por dia útil, cada uma com um tema. As gravações ficam disponíveis para clientes." />
      {LIVES.map(l => (
        <Card key={l.dia} style="margin-bottom:10px;display:flex;align-items:center;gap:18px" pad="16px 22px">
          <div style={s('width:48px;height:48px;border-radius:14px;background:#EEF1F6;color:#0B2454;font-weight:800;display:flex;align-items:center;justify-content:center')}>{l.dia}</div>
          <div style={{ flex: 1 }}><div style={s('font-size:14.5px;font-weight:700')}>{l.tema}</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:2px')}>{l.quando}</div></div>
          <Btn small ghost onClick={() => { if (!missao('m3')) say('Lembrete criado para a live'); }}>Quero ser lembrado</Btn>
        </Card>
      ))}
      <div style={s('font-size:12.5px;color:#7A8398;margin-top:12px')}>{nivel === 0 ? 'No teste grátis você assiste ao vivo. Gravações fazem parte do Veri Academy.' : 'Você também acessa as gravações na aba Conteúdos.'}</div>
    </div>
  );

  const Materiais = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Materiais" sub="Ebooks, planilhas, modelos e materiais ricos para usar no dia a dia." />
      {MATERIAIS.map(m => (
        <Card key={m.t} style="margin-bottom:10px;display:flex;align-items:center;gap:16px" pad="14px 20px">
          <div style={{ flex: 1 }}><div style={s('font-size:14px;font-weight:600')}>{m.t}</div><div style={s('font-size:12px;color:#9AA3B5;margin-top:2px')}>{m.tipo}</div></div>
          {locked(m.plano) ? <Tag tone="amber">{planoNome(m.plano)}</Tag> : <Tag tone="green">Liberado</Tag>}
          <Btn small ghost onClick={() => abrir(m.plano, m.t)}>{locked(m.plano) ? 'Desbloquear' : 'Baixar'}</Btn>
        </Card>
      ))}
    </div>
  );

  const Comunidade = () => {
    const [novo, setNovo] = useState('');
    const [rascunho, setRascunho] = useState<Record<number, string>>({});
    const input = 'width:100%;padding:11px 14px;border-radius:100px;border:1px solid #E5E8F0;background:#fff;font-size:13.5px;outline:none;color:#0F172A';
    return (
      <div style={s('max-width:820px')}>
        <Title t="Comunidade" sub="Postagens curtas, como em uma rede profissional, para trocar experiências com outros escritórios e comentar. Moderada pelo time Veri." />
        {nivel === 0 && <Card style="margin-bottom:14px;background:#FFF7DE" pad="14px 20px"><div style={s('font-size:13px;color:#7A5A00')}>No teste grátis você pode ler e curtir. Para publicar e comentar, assine o Academy.</div></Card>}
        <Card style="margin-bottom:14px" pad="16px 20px">
          <div style={s('display:flex;gap:12px;align-items:center')}>
            <span style={s('width:36px;height:36px;flex:none;border-radius:50%;background:#0B2454;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(p.nome)}</span>
            <input value={novo} onChange={e => setNovo(e.target.value)} placeholder="Comece uma postagem..." style={s(input)} />
            <Btn small onClick={() => {
              if (nivel === 0) { setUpgrade(true); return; }
              if (!novo.trim()) return;
              setPosts(l => [{ autor: p.nome, cargo: p.papel, tempo: 'agora', txt: novo.trim(), likes: 0, coments: [] }, ...l]); say('Postagem publicada');
            }}>Publicar</Btn>
          </div>
        </Card>
        {posts.map((po, i) => (
          <Card key={`${i}-${po.txt}`} style="margin-bottom:12px">
            <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:12px')}>
              <span style={s('width:38px;height:38px;border-radius:50%;background:#0B2454;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(po.autor)}</span>
              <div style={{ flex: 1 }}><div style={s('font-size:13.5px;font-weight:700')}>{po.autor}</div><div style={s('font-size:11.5px;color:#9AA3B5')}>{po.cargo} · {po.tempo}</div></div>
            </div>
            <div style={s('font-size:14px;line-height:1.65;margin-bottom:12px')}>{po.txt}</div>
            <div style={s('font-size:12px;color:#9AA3B5;padding-bottom:10px;border-bottom:1px solid #F0F2F7')}>{po.likes + (likes[i] ? 1 : 0)} curtidas · {po.coments.length} comentários</div>
            <div style={s('display:flex;gap:22px;font-size:13px;color:#5B6478;font-weight:600;padding-top:10px')}>
              <span style={{ cursor: 'pointer', fontWeight: likes[i] ? 800 : 600 }} onClick={() => { setLikes(l => ({ ...l, [i]: !l[i] })); if (!likes[i]) missao('m5'); }}>{likes[i] ? '♥ Curtiu' : '♡ Curtir'}</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setAbertos(a => ({ ...a, [i]: !a[i] }))}>Comentar</span>
            </div>
            {abertos[i] && (
              <div style={s('margin-top:12px')}>
                {po.coments.map((c, k) => (
                  <div key={k} style={s('display:flex;gap:10px;margin-bottom:10px')}>
                    <span style={s('width:28px;height:28px;flex:none;border-radius:50%;background:#EEF1F6;color:#0B2454;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center')}>{iniciais(c.autor)}</span>
                    <div style={s('padding:9px 13px;border-radius:12px;background:#F3F5FA;font-size:13px;line-height:1.5')}><b>{c.autor}</b><br />{c.txt}</div>
                  </div>
                ))}
                <div style={s('display:flex;gap:8px;margin-top:6px')}>
                  <input value={rascunho[i] || ''} onChange={e => setRascunho(r => ({ ...r, [i]: e.target.value }))} placeholder="Escreva um comentário..." style={s(input)} />
                  <Btn small ghost onClick={() => {
                    if (nivel === 0) { setUpgrade(true); return; }
                    const t = (rascunho[i] || '').trim(); if (!t) return;
                    setPosts(l => l.map((x, n) => (n === i ? { ...x, coments: [...x.coments, { autor: p.nome, txt: t }] } : x))); setAbertos(a => ({ ...a, [i]: true }));
                  }}>Enviar</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const Ofertas = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Ofertas e sorteios" sub="Condições especiais, ingressos, brindes e sorteios para a comunidade." />
      {OFERTAS.map(o => (
        <Card key={o.t} style="margin-bottom:10px;display:flex;align-items:center;gap:16px" pad="16px 22px">
          <Tag tone={o.tipo === 'Sorteio' ? 'blue' : o.tipo === 'Brinde' ? 'green' : 'amber'}>{o.tipo.toUpperCase()}</Tag>
          <div style={{ flex: 1 }}><div style={s('font-size:14px;font-weight:700')}>{o.t}</div><div style={s('font-size:12px;color:#9AA3B5;margin-top:2px')}>{o.fim}</div></div>
          {locked(o.plano) ? <Btn small ghost onClick={() => setUpgrade(true)}>Disponível no {planoNome(o.plano)}</Btn>
            : <Btn small onClick={() => { setSorteios(x => ({ ...x, [o.t]: true })); if (!(o.tipo === 'Sorteio' && missao('m4'))) say(o.tipo === 'Sorteio' ? 'Você está participando' : 'Oferta aproveitada (exemplo)'); }}>{sorteios[o.t] ? 'Participando' : o.tipo === 'Sorteio' ? 'Participar' : 'Aproveitar'}</Btn>}
        </Card>
      ))}
    </div>
  );

  const Planos = () => {
    const col = (nome: string, preco: string, itens: string[], atual: boolean, destaque?: boolean) => (
      <div style={{ ...s(`border-radius:18px;padding:26px;background:#fff;border:${destaque ? '2px solid #0B2454' : '1px solid #E9ECF3'}`) }}>
        {atual && <Tag tone="green">SEU PLANO</Tag>}
        <div style={s('font-size:19px;font-weight:800;margin:10px 0 4px')}>{nome}</div>
        <div style={s('font-size:13px;color:#7A8398;margin-bottom:16px')}>{preco}</div>
        {itens.map(i => <div key={i} style={s('font-size:13.5px;line-height:1.5;padding:6px 0;border-top:1px solid #F0F2F7')}>✓ {i}</div>)}
      </div>
    );
    return (
      <div style={s('max-width:1100px')}>
        <Title t="Planos" sub="Valores ainda não definidos. Esta tela mostra apenas o que cada nível inclui." />
        <Grid n={3}>
          {col('Teste grátis', '7 dias', ['Conteúdos abertos', 'Lives ao vivo', 'Leitura da comunidade', 'Ofertas e sorteios'], persona === 'lead')}
          {col('Veri Academy', 'Valor a definir', ['Catálogo completo', 'Gravações das lives', 'Comunidade completa', 'Conquistas e níveis', 'Materiais premium'], persona === 'academy', true)}
          {col('Cliente Veri', 'Valor a definir', ['Tudo do Academy', 'Tutoriais do sistema', 'Programa de indicação', 'Brindes e conteúdo exclusivo', 'Suporte prioritário'], persona === 'veri')}
        </Grid>
        {persona === 'lead' && <Card style="margin-top:20px;background:#DCFCE7" pad="14px 20px"><div style={s('font-size:14px;font-weight:700;color:#0B6B3F')}>Seu desconto na implantação da Veri: {desconto}%</div><div style={s('font-size:12.5px;color:#0B6B3F;margin-top:2px')}>Complete missões em Missões e desconto para aumentar.</div></Card>}
        {nivel < 2 && <div style={s('margin-top:20px')}><Btn onClick={() => say(nivel === 0 ? 'Fluxo de assinatura (cobrança via Asaas) entra na versão real' : 'Fale com o time Veri (exemplo)')}>{nivel === 0 ? 'Assinar o Academy' : 'Quero conhecer o Veri'}</Btn></div>}
      </div>
    );
  };

  const Gamificacao = () => {
    const lista = (arr: typeof CONQUISTAS) => arr.map(c => (
      <Card key={c.t} style="margin-bottom:10px;display:flex;align-items:center;gap:14px" pad="14px 20px">
        <span style={s(`width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;${c.ok ? 'background:#DCFCE7;color:#0B6B3F' : 'background:#F1F3F8;color:#9AA3B5'}`)}>{c.ok ? '✓' : '·'}</span>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{c.t}</div><Tag tone={c.ok ? 'green' : 'grey'}>{c.pts} PTS</Tag>
      </Card>
    ));
    if (persona === 'lead') return (
      <div style={s('max-width:900px')}>
        <Title t="Missões e desconto" sub={`Cada missão concluída libera ${DESCONTO_POR_MISSAO}% de desconto na implantação da Veri (regra de exemplo, até ${MISSOES.length * DESCONTO_POR_MISSAO}%). Vale só para quem assina depois do teste.`} />
        <Card style="margin-bottom:22px"><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>DESCONTO ACUMULADO</div><div style={s('font-size:34px;font-weight:800;margin-bottom:10px')}>{desconto}%</div><Bar pct={`${(desconto / (MISSOES.length * DESCONTO_POR_MISSAO)) * 100}%`} h={8} /></Card>
        {MISSOES.map(m => (
          <Card key={m.id} style="margin-bottom:10px;display:flex;align-items:center;gap:14px" pad="14px 20px">
            <span style={s(`width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;${missoes[m.id] ? 'background:#DCFCE7;color:#0B6B3F' : 'background:#F1F3F8;color:#9AA3B5'}`)}>{missoes[m.id] ? '✓' : '·'}</span>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{m.t}</div><Tag tone={missoes[m.id] ? 'green' : 'grey'}>+{DESCONTO_POR_MISSAO}%</Tag>
          </Card>
        ))}
        <div style={s('margin-top:14px;display:flex;gap:10px')}><Btn small onClick={() => setScreen('planos')}>Usar meu desconto</Btn><Btn small ghost onClick={() => { setMissoes({}); say('Missões zeradas para a demonstração'); }}>Zerar missões (demo)</Btn></div>
      </div>
    );
    const mult = nivel >= 1 ? 2 : 1;
    const total = mult * CONQUISTAS.filter(c => c.ok).reduce((a, c) => a + c.pts, 0) + (persona === 'veri' ? CONQUISTAS_EXT.filter(c => c.ok).reduce((a, c) => a + c.pts, 0) : 0);
    return (
      <div style={s('max-width:900px')}>
        <Title t="Conquistas" sub={persona === 'veri' ? 'Pontos por estudar dentro da plataforma e por engajar fora dela, como indicar e avaliar.' : 'Pontos por estudar, participar das lives e da comunidade. No Academy os pontos valem em dobro (exemplo).'} />
        <Card style="margin-bottom:22px"><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>TOTAL DE PONTOS</div><div style={s('font-size:34px;font-weight:800;margin-bottom:10px')}>{total}</div><Bar pct={`${Math.min(100, total / 15)}%`} h={8} /></Card>
        <Section t="Dentro da plataforma">{lista(CONQUISTAS)}</Section>
        {persona === 'veri' && <Section t="Engajamento externo">{lista(CONQUISTAS_EXT)}</Section>}
      </div>
    );
  };

  const Indicacao = () => {
    const [nome, setNome] = useState(''); const [emp, setEmp] = useState(''); const [ok, setOk] = useState(false);
    const campo = 'width:100%;padding:12px 14px;border-radius:10px;border:1px solid #E5E8F0;background:#fff;font-size:13.5px;outline:none;margin-bottom:10px;color:#0F172A';
    return (
      <div style={s('max-width:1100px')}>
        <Title t="Indique e ganhe" sub="Indique escritórios que combinam com a Veri. A recompensa é liberada quando o indicado contrata e paga a primeira fatura." />
        <Card style="margin-bottom:18px;display:flex;align-items:center;gap:18px">
          <div style={{ flex: 1 }}>
            <div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>SEU LINK E CÓDIGO</div>
            <div style={s('font-size:15px;font-weight:700')}>academy.veri.com.br/i/CAMILA-D</div>
            <div style={s('font-size:12.5px;color:#7A8398;margin-top:2px')}>Código: CAMILA-D (exemplo)</div>
          </div>
          <Btn small onClick={() => say('Link copiado (exemplo)')}>Copiar link</Btn>
        </Card>
        <Grid n={2}>
          <Card>
            <div style={s('font-size:15px;font-weight:700;margin-bottom:12px')}>Indicar agora</div>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do contato" style={s(campo)} />
            <input value={emp} onChange={e => setEmp(e.target.value)} placeholder="Escritório" style={s(campo)} />
            <input placeholder="E-mail ou telefone" style={s(campo)} />
            <label style={s('display:flex;gap:8px;font-size:12px;color:#7A8398;line-height:1.5;margin-bottom:14px')}><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />Confirmo que a pessoa autorizou receber contato da Veri.</label>
            <Btn onClick={() => {
              if (!emp.trim() || !ok) { say('Preencha o escritório e confirme a autorização'); return; }
              setIndicacoes(l => [{ nome: emp.trim(), status: 0 }, ...l]); setNome(''); setEmp(''); setOk(false); say('Indicação enviada');
            }}>Enviar indicação</Btn>
          </Card>
          <Card>
            <div style={s('font-size:15px;font-weight:700;margin-bottom:12px')}>Regras</div>
            {['Recompensa após a primeira fatura paga do indicado', 'Não vale para contatos que já estão em atendimento na Veri', 'A indicação vale por 90 dias (exemplo)', 'O indicado pode pedir para sair a qualquer momento', 'Valor da recompensa: a definir'].map(r => <div key={r} style={s('font-size:13px;line-height:1.5;padding:7px 0;border-top:1px solid #F0F2F7')}>{r}</div>)}
          </Card>
        </Grid>
        <Section t="Como funciona">
          <Grid n={4}>{[['1. Indique', 'Envie o contato pelo link, código ou formulário.'], ['2. Contato', 'O time Veri fala com o indicado e apresenta o sistema.'], ['3. Contratação', 'O indicado testa e contrata um plano.'], ['4. Recompensa', 'Após a primeira fatura paga, você recebe a recompensa.']].map(([t, d]) => (
            <Card key={t} pad="16px 18px"><div style={s('font-size:14px;font-weight:700;margin-bottom:6px')}>{t}</div><div style={s('font-size:12.5px;color:#7A8398;line-height:1.55')}>{d}</div></Card>
          ))}</Grid>
        </Section>
        <Section t="Minhas indicações">
          {indicacoes.map((i, k) => (
            <Card key={k} style="margin-bottom:10px" pad="16px 22px">
              <div style={s('font-size:14px;font-weight:700;margin-bottom:12px')}>{i.nome}</div>
              <div style={s('display:flex;gap:6px')}>
                {ETAPAS.map((e, n) => (
                  <div key={e} style={{ flex: 1 }}>
                    <div style={s(`height:6px;border-radius:100px;margin-bottom:6px;background:${n <= i.status ? '#0B2454' : '#E5E8F0'}`)} />
                    <div style={s(`font-size:11px;color:${n <= i.status ? '#0F172A' : '#9AA3B5'};font-weight:${n === i.status ? 800 : 500}`)}>{e}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Section>
      </div>
    );
  };

  const Beneficios = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Benefícios de cliente Veri" sub="O que você recebe por usar o sistema Veri." />
      <Grid n={2}>
        {[['Suporte prioritário', 'Fila própria e resposta mais rápida.'], ['Brindes', 'Kit Veri por marcos de uso e de indicação.'], ['Conteúdo exclusivo', 'Masterclasses e materiais só para clientes.'], ['Comunidade de clientes', 'Espaço para trocar com quem usa o sistema.']].map(([t, d]) => (
          <Card key={t}><div style={s('font-size:15px;font-weight:700;margin-bottom:6px')}>{t}</div><div style={s('font-size:13px;color:#7A8398;line-height:1.6')}>{d}</div></Card>
        ))}
      </Grid>
      <Section t="Brindes por indicação (marcos de exemplo)">
        <Grid n={3}>{MARCOS_BRINDES.map(m => {
          const feitas = indicacoes.filter(i => i.status >= 3).length; const ok = feitas >= m.n;
          return <Card key={m.t}><div style={s('display:flex;align-items:center;gap:8px;margin-bottom:6px')}><div style={s('font-size:15px;font-weight:700')}>{m.t}</div><Tag tone={ok ? 'green' : 'grey'}>{ok ? 'CONQUISTADO' : `${feitas}/${m.n}`}</Tag></div><div style={s('font-size:12.5px;color:#7A8398')}>Ao chegar a {m.n} {m.n === 1 ? 'indicação que contratou' : 'indicações que contrataram'}.</div></Card>;
        })}</Grid>
      </Section>
      <Section t="Sugestões para o seu escritório">
        <Card style="display:flex;align-items:center;gap:16px"><div style={{ flex: 1 }}><div style={s('font-size:14px;font-weight:700')}>Você usa pouco o módulo de relatórios</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:2px')}>Exemplo de oportunidade de upsell mapeada pelo uso do sistema.</div></div><Btn small ghost onClick={() => say('Aviso enviado ao time de contas (exemplo)')}>Falar com o time</Btn></Card>
      </Section>
    </div>
  );

  const Treinamentos = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Treinamentos" sub="Trilhas internas por área. Seu progresso fica registrado." />
      {TREINOS.map(t => (
        <Card key={t.t} style="margin-bottom:10px;display:flex;align-items:center;gap:16px" pad="16px 22px">
          <span style={s(`width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;${t.feito ? 'background:#DCFCE7;color:#0B6B3F' : 'background:#F1F3F8;color:#9AA3B5'}`)}>{t.feito ? '✓' : '·'}</span>
          <div style={{ flex: 1 }}><div style={s('font-size:14px;font-weight:700')}>{t.t}</div><div style={s('font-size:12px;color:#9AA3B5;margin-top:2px')}>{t.area} · {t.min} min</div></div>
          <Btn small ghost onClick={() => say('Abrindo treinamento')}>{t.feito ? 'Rever' : 'Começar'}</Btn>
        </Card>
      ))}
    </div>
  );

  const Checklists = () => (
    <div style={s('max-width:1100px')}>
      <Title t="Checklists comerciais" sub="Passo a passo para cada momento da venda. Marque durante a conversa." />
      <Grid n={2}>
        {CHECKLISTS.map(c => {
          const feitos = c.itens.filter((_, i) => checks[`${c.t}-${i}`]).length;
          return (
            <Card key={c.t}>
              <div style={s('display:flex;align-items:center;margin-bottom:10px')}><div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>{c.t}</div><Tag tone={feitos === c.itens.length ? 'green' : 'grey'}>{feitos}/{c.itens.length}</Tag></div>
              {c.itens.map((it, i) => (
                <label key={it} style={s('display:flex;gap:10px;align-items:center;font-size:13.5px;padding:7px 0;border-top:1px solid #F0F2F7;cursor:pointer')}>
                  <input type="checkbox" checked={!!checks[`${c.t}-${i}`]} onChange={e => setChecks(k => ({ ...k, [`${c.t}-${i}`]: e.target.checked }))} />{it}
                </label>
              ))}
            </Card>
          );
        })}
      </Grid>
    </div>
  );

  const Gravacoes = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Gravações" sub="Reuniões, treinamentos e lives internas." />
      <Grid n={3}>{GRAVACOES.map(g => <Cartao key={g.t} t={g.t} sub={`${g.min} min`} plano={0} cor="#1F3C7A" />)}</Grid>
    </div>
  );

  const Intranet = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Intranet" sub="Informações da empresa em um só lugar." />
      <Grid n={2}>{INTRANET.map(i => <Card key={i.t}><div style={s('font-size:15px;font-weight:700;margin-bottom:4px')}>{i.t}</div><div style={s('font-size:13px;color:#7A8398')}>{i.d}</div></Card>)}</Grid>
    </div>
  );

  const Metricas = () => {
    const [ch, setCh] = useState(Math.round(SUPORTE.chamados / SUPORTE.mesesPeriodo)); const [tma, setTma] = useState(SUPORTE.tmaMin); const [custo, setCusto] = useState(35); const [ev, setEv] = useState(25);
    const [rec, setRec] = useState(3); const [cl, setCl] = useState(1200); const [custoPlat, setCustoPlat] = useState(900);
    const economia = Math.round(ch * (ev / 100) * (tma / 60) * custo);
    const receita = rec * cl;
    const saldo = economia + receita - custoPlat;
    const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');
    const num = (v: number, set: (n: number) => void, rot: string) => (
      <label style={s('display:block;font-size:12px;color:#7A8398;margin-bottom:10px')}>{rot}
        <input type="number" value={v} onChange={e => set(+e.target.value || 0)} style={s('display:block;width:100%;margin-top:4px;padding:10px 12px;border-radius:10px;border:1px solid #E5E8F0;background:#fff;color:#0F172A;font-size:14px;outline:none')} />
      </label>
    );
    return (
      <div style={s('max-width:1180px')}>
        <Title t="Métricas de sucesso" sub="O suporte usa a base real de 2026. O percentual de chamados evitados, o custo por hora, a indicação e o custo da plataforma ainda são hipóteses para você ajustar." />
        <Section t="Base real do suporte 2026 (janeiro até 06/11)">
          <Grid n={4}>
            {[['Chamados (chat e WhatsApp)', SUPORTE.chamados.toLocaleString('pt-BR')], ['Tempo médio de atendimento', SUPORTE.tma], ['Média de espera', SUPORTE.espera], ['Avaliações positivas', `${SUPORTE.positivas}% de ${SUPORTE.avaliacoes.toLocaleString('pt-BR')}`], ['Tickets fechados', SUPORTE.tickets.toLocaleString('pt-BR')], ['Acessos consultivos', SUPORTE.acessosConsultivos.toLocaleString('pt-BR')], ['Principais casos no chat', SUPORTE.casosChat.join(', ')], ['Principais casos nos tickets', SUPORTE.casosTicket.join(', ')]].map(([k, v]) => (
              <Card key={k} pad="14px 18px"><div style={s('font-size:11px;font-weight:700;letter-spacing:.08em;color:#7A8398;margin-bottom:6px')}>{k.toUpperCase()}</div><div style={s('font-size:16px;font-weight:800;line-height:1.35')}>{v}</div></Card>
            ))}
          </Grid>
          <div style={s('font-size:12.5px;color:#7A8398;margin-top:10px;line-height:1.6')}>Chamados por mês = total dividido por cerca de 10,2 meses. Usabilidade, CNDs e rotinas automáticas são os temas que mais combinam com tutoriais. Falta o volume por tema para medir o potencial real.</div>
        </Section>
        <Card style="margin-bottom:18px;background:#FFF7DE" pad="12px 20px"><div style={s('font-size:13px;color:#7A5A00')}>Campos de chamados e tempo médio vêm da base real. Os demais são hipóteses de exemplo.</div></Card>
        <Grid n={2}>
          <Card>
            <div style={s('font-size:15px;font-weight:700;margin-bottom:12px')}>Economia de suporte</div>
            {num(ch, setCh, 'Chamados por mês (base)')}{num(tma, setTma, 'Tempo médio por chamado (min)')}{num(custo, setCusto, 'Custo por hora do atendimento (R$)')}{num(ev, setEv, 'Chamados evitados pelos tutoriais (%)')}
            <div style={s('font-size:12px;color:#7A8398;line-height:1.6')}>economia = chamados × % evitados × tempo (h) × custo/hora</div>
            <div style={s('font-size:28px;font-weight:800;margin-top:8px')}>{brl(economia)}<span style={s('font-size:13px;font-weight:600;color:#7A8398')}> por mês</span></div>
          </Card>
          <Card>
            <div style={s('font-size:15px;font-weight:700;margin-bottom:12px')}>Indicação e custo da plataforma</div>
            {num(rec, setRec, 'Clientes novos por indicação (mês)')}{num(cl, setCl, 'Receita mensal por cliente novo (R$)')}{num(custoPlat, setCustoPlat, 'Custo mensal da plataforma (R$)')}
            <div style={s('font-size:12px;color:#7A8398;line-height:1.6')}>receita nova = clientes por indicação × receita por cliente</div>
            <div style={s('font-size:28px;font-weight:800;margin-top:8px')}>{brl(receita)}<span style={s('font-size:13px;font-weight:600;color:#7A8398')}> por mês</span></div>
          </Card>
        </Grid>
        <Card style="margin:18px 0"><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>RESULTADO DO MÊS (EXEMPLO)</div>
          <div style={s('font-size:14px;color:#7A8398;margin-bottom:6px')}>economia de suporte + receita nova − custo da plataforma</div>
          <div style={s('font-size:34px;font-weight:800')}>{brl(saldo)}</div>
        </Card>
        <Section t="De onde vêm os números">
          <Grid n={2}>{FONTES.map(f => <Card key={f.f} pad="14px 18px"><div style={s('font-size:14px;font-weight:700')}>{f.f}</div><div style={s('font-size:12.5px;color:#7A8398;margin-top:2px')}>{f.d}</div></Card>)}</Grid>
        </Section>
      </div>
    );
  };

  const Sobre = () => (
    <div style={s('max-width:1100px')}>
      <div style={s('border-radius:22px;padding:34px 38px;background:linear-gradient(120deg,#0B2454,#12295E);color:#fff;margin-bottom:22px')}>
        <div style={s('font-size:10.5px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.7);margin-bottom:12px')}>QUEM SOMOS</div>
        <div style={s('font-size:28px;font-weight:800;line-height:1.25;margin-bottom:10px;max-width:660px')}>A Veri organiza as rotinas do escritório e reduz o retrabalho da equipe.</div>
        <div style={s('font-size:14px;line-height:1.65;color:rgba(255,255,255,.75);max-width:620px')}>Veja o que o sistema faz, quais dores ele resolve e como outros escritórios usam. Tudo isso com a Veri Academy ao lado para a sua equipe aprender.</div>
      </div>
      <Grid n={2}>
        <Card><div style={s('font-size:15px;font-weight:700;margin-bottom:10px')}>O que a Veri faz</div>{SOBRE.servicos.map(x => <div key={x} style={s('font-size:13.5px;line-height:1.5;padding:7px 0;border-top:1px solid #F0F2F7')}>✓ {x}</div>)}</Card>
        <Card><div style={s('font-size:15px;font-weight:700;margin-bottom:10px')}>Dores que resolvemos</div>{SOBRE.dores.map(x => <div key={x} style={s('font-size:13.5px;line-height:1.5;padding:7px 0;border-top:1px solid #F0F2F7')}>{x}</div>)}
          <div style={s('margin-top:12px')}><Btn small onClick={() => setScreen('problemas')}>Ver como resolvemos cada uma</Btn></div></Card>
      </Grid>
      <Section t="Depoimentos">
        <Grid n={3}>{[1, 2, 3].map(n => <Card key={n}><div style={s('font-size:13px;color:#9AA3B5;line-height:1.6')}>Espaço reservado para o depoimento real de um cliente {n}, com nome, escritório e foto.</div></Card>)}</Grid>
      </Section>
      <Section t="Lives e eventos">
        <Card style="display:flex;align-items:center;gap:16px"><div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.6 }}>Uma live por dia útil e eventos com sorteio de ingressos.</div><Btn small ghost onClick={() => setScreen('lives')}>Ver lives</Btn><Btn small ghost onClick={() => setScreen('eventos')}>Ver eventos</Btn></Card>
      </Section>
    </div>
  );

  const Problemas = () => {
    const pr = PROBLEMAS.find(x => x.id === problemaSel) || PROBLEMAS[0];
    return (
      <div style={s('max-width:1100px')}>
        <Title t="Problemas que resolvemos" sub="Escolha um problema do dia a dia e veja como a Veri resolve, em vídeo. A ordem segue o que mais aparece no suporte." />
        <div style={s('display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px')}>
          {PROBLEMAS.map(x => (
            <div key={x.id} onClick={() => setProblemaSel(x.id)} style={s(`cursor:pointer;padding:10px 18px;border-radius:100px;font-size:13px;${x.id === pr.id ? 'background:#0B2454;color:#fff;font-weight:700' : 'background:#fff;border:1px solid #E5E8F0;color:#5B6478;font-weight:600'}`)}>{x.t}</div>
          ))}
        </div>
        <Card>
          <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:14px')}><div style={s('font-size:20px;font-weight:800')}>{pr.t}</div>{pr.destaque && <Tag tone="green">MAIOR VOLUME NO SUPORTE</Tag>}</div>
          <Grid n={2}>
            <div><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>O PROBLEMA</div><div style={s('font-size:14px;line-height:1.7')}>{pr.dor}</div></div>
            <div><div style={s('font-size:11px;font-weight:700;letter-spacing:.12em;color:#7A8398;margin-bottom:6px')}>COMO A VERI RESOLVE</div><div style={s('font-size:14px;line-height:1.7')}>{pr.solucao}</div></div>
          </Grid>
          <div style={s('margin-top:18px;border-radius:14px;overflow:hidden')}>
            <Capa cor="#1F3C7A" h={190}><span onClick={() => { if (!missao('m2')) say(`Abrindo vídeo: ${pr.video}`); }} style={s('cursor:pointer;width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,.92);color:#0B2454;display:flex;align-items:center;justify-content:center;font-size:18px')}>▶</span></Capa>
            <div style={s('padding:12px 4px 0;font-size:13px;color:#7A8398')}>Vídeo: {pr.video}</div>
          </div>
          {nivel === 0 && <div style={s('margin-top:16px')}><Btn small ghost onClick={() => setScreen('planos')}>Ver planos</Btn></div>}
        </Card>
      </div>
    );
  };

  const Eventos = () => (
    <div style={s('max-width:1000px')}>
      <Title t="Eventos" sub="Próximos eventos da Veri e sorteio de ingressos. Datas e locais serão confirmados." />
      {EVENTOS.map(ev => (
        <Card key={ev.t} style="margin-bottom:12px">
          <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:6px')}><div style={s('font-size:16px;font-weight:700')}>{ev.t}</div><Tag tone="grey">{ev.quando.toUpperCase()}</Tag></div>
          <div style={s('font-size:13.5px;line-height:1.65;color:#5B6478;margin-bottom:14px')}>{ev.d}</div>
          <div style={s('display:flex;align-items:center;gap:12px')}>
            <Tag tone="blue">{ev.sorteio.toUpperCase()}</Tag>
            <Btn small onClick={() => { setSorteios(x => ({ ...x, [ev.t]: true })); if (!missao('m4')) say('Você está participando do sorteio'); }}>{sorteios[ev.t] ? 'Participando' : 'Participar do sorteio'}</Btn>
          </div>
        </Card>
      ))}
    </div>
  );

  const telas: Record<ScreenId, () => JSX.Element> = {
    inicio: Inicio, conteudo: Conteudo, lives: Lives, materiais: Materiais, comunidade: Comunidade, ofertas: Ofertas, planos: Planos,
    sistema: Sistema, gamificacao: Gamificacao, indicacao: Indicacao, beneficios: Beneficios,
    treinamentos: Treinamentos, checklists: Checklists, gravacoes: Gravacoes, intranet: Intranet, metricas: Metricas,
    sobre: Sobre, problemas: Problemas, eventos: Eventos,
  };
  const atual = nav.some(n => n.id === screen) ? screen : 'inicio';
  const Tela = telas[atual];

  return (
    <div style={s('display:flex;min-height:100vh;min-width:1080px')}>
      <div style={s('width:226px;flex:none;background:#0B2454;padding:22px 16px 18px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow:auto')}>
        <img src={LOGO} alt="VERI Academy" style={s('height:22px;width:auto;align-self:flex-start;aspect-ratio:564/88;object-fit:contain;margin:4px 0 24px 6px')} />
        {nav.map(n => {
          const on = atual === n.id;
          return (
            <div key={n.id} onClick={() => setScreen(n.id)} style={s(`cursor:pointer;margin-bottom:4px;padding:11px 14px;border-radius:12px;font-size:13.5px;${on ? 'background:#fff;color:#0B2454;font-weight:700' : 'color:rgba(255,255,255,.92);font-weight:500'}`)}>{n.label}</div>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={s('display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;background:#fff;margin-top:14px')}>
          <span style={s('width:30px;height:30px;flex:none;border-radius:50%;background:#0B2454;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(p.nome)}</span>
          <span style={{ minWidth: 0 }}>
            <span style={s('display:block;font-size:12.5px;font-weight:700;color:#0F172A;line-height:1.35')}>{p.nome}</span>
            <span style={s('display:block;font-size:11px;color:#7A8398;line-height:1.35')}>{p.papel}</span>
          </span>
        </div>
      </div>

      <div style={s('flex:1;min-width:0;display:flex;flex-direction:column')}>
        <div style={s('display:flex;align-items:center;gap:16px;padding:12px 30px;background:#fff;border-bottom:1px solid #E9ECF3;position:sticky;top:0;z-index:20')}>
          <Tag tone="amber">PROTÓTIPO · DADOS DE EXEMPLO</Tag>
          {persona === 'lead' && <Tag tone="green">DESCONTO NA IMPLANTAÇÃO: {desconto}%</Tag>}
          <div style={{ flex: 1 }} />
          <span style={s('font-size:12px;color:#7A8398')}>Ver como:</span>
          <div style={s('display:flex;gap:4px;padding:4px;border-radius:100px;background:#F3F5FA;border:1px solid #E5E8F0')}>
            {PERSONAS.map(x => (
              <div key={x.id} onClick={() => trocar(x.id)} style={s(`cursor:pointer;padding:8px 15px;border-radius:100px;font-size:12.5px;white-space:nowrap;${persona === x.id ? 'background:#0B2454;color:#fff;font-weight:700' : 'color:#5B6478;font-weight:600'}`)}>{x.label}</div>
            ))}
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <div style={s('flex:1;padding:26px 30px 90px')}><Tela key={persona + atual} /></div>
      </div>

      {upgrade && (
        <div onClick={() => setUpgrade(false)} style={s('position:fixed;inset:0;z-index:60;background:rgba(8,16,40,.55);display:flex;align-items:center;justify-content:center')}>
          <div onClick={e => e.stopPropagation()} style={s('width:460px;padding:34px;border-radius:20px;background:#fff')}>
            <div style={s('font-size:20px;font-weight:800;margin-bottom:8px')}>{nivel === 0 ? 'Conteúdo do Veri Academy' : 'Conteúdo para clientes Veri'}</div>
            <div style={s('font-size:14px;line-height:1.65;color:#7A8398;margin-bottom:22px')}>{nivel === 0 ? 'Assine o Veri Academy para liberar o catálogo completo, as gravações e a comunidade.' : 'Este conteúdo faz parte do Cliente Veri: tutoriais do sistema, indicação, brindes e suporte prioritário.'}</div>
            <div style={s('display:flex;gap:10px')}><Btn onClick={() => { setUpgrade(false); setScreen('planos'); }}>Ver planos</Btn><Btn ghost onClick={() => setUpgrade(false)}>Agora não</Btn></div>
          </div>
        </div>
      )}
      {premio && (
        <div onClick={() => setPremio('')} style={s('position:fixed;inset:0;z-index:65;background:rgba(8,16,40,.5);display:flex;align-items:center;justify-content:center')}>
          <div onClick={e => e.stopPropagation()} style={s('width:420px;padding:32px;border-radius:20px;background:#fff;text-align:center')}>
            <div style={s('width:56px;height:56px;margin:0 auto 14px;border-radius:50%;background:#DCFCE7;color:#0B6B3F;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center')}>%</div>
            <div style={s('font-size:19px;font-weight:800;margin-bottom:8px')}>Missão cumprida</div>
            <div style={s('font-size:14px;line-height:1.65;color:#7A8398;margin-bottom:20px')}>{premio}</div>
            <div style={s('display:flex;gap:10px;justify-content:center')}><Btn small onClick={() => { setPremio(''); setScreen('gamificacao'); }}>Ver missões</Btn><Btn small ghost onClick={() => setPremio('')}>Continuar</Btn></div>
          </div>
        </div>
      )}
      {toast && (
        <div style={s('position:fixed;left:0;right:0;bottom:28px;z-index:70;display:flex;justify-content:center;pointer-events:none')}>
          <div style={s('padding:14px 24px;border-radius:100px;background:#0F172A;color:#fff;font-size:13.5px;font-weight:600;box-shadow:0 14px 40px rgba(8,16,40,.35)')}>{toast}</div>
        </div>
      )}
    </div>
  );
}
