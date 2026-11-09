import { Central, Mine } from './useCentral';
import { capaYoutube, CERTIFICADO_ATIVO, fmtDuracao, iniciais, Tab } from './data';
import { Bar, Card, s } from './ui';
import type { Feedback } from './useCentral';
import { VideoPlayer } from './VideoPlayer';
import { quandoLabel } from './format';

const label = (t: string, mb = 4) => <div style={s(`font-size:10px;letter-spacing:.14em;font-weight:700;color:#9AA3B5;margin-bottom:${mb}px`)}>{t}</div>;

const tabs: { k: Tab; label: string }[] = [{ k: 'coment', label: 'Comentários' }, { k: 'duvidas', label: 'Dúvidas' }, { k: 'sug', label: 'Sugestões' }];
const placeholders: Record<Tab, string> = { coment: 'Escreva um comentário sobre esta aula...', duvidas: 'Qual é a sua dúvida? Ela vai direto para o suporte do escritório.', sug: 'O que faltou nesta aula?' };

export function Player({ c }: { c: Central }) {
  if (!c.videoId) return null;
  const v = c.findVideo(c.videoId);
  if (!v) return null;
  const t = v.trilha, u = c.user!;
  const idx = t.videos.findIndex(x => x.id === v.id);
  const d = !!c.done[v.id];
  const pct = d ? 100 : c.pos[v.id] || 0;
  const tFeito = t.videos.filter(x => c.done[x.id]).length;
  const nx = t.videos.find(x => !c.done[x.id] && x.id !== v.id);
  const fb = c.mine['fb|' + v.id];

  const mine = ((c.mine[v.id + '|' + c.tab] as Mine[]) || []).map(m => ({ ...m }));
  const fbBtn = (kind: Feedback, text: string, ok: [string, string, string]) => {
    const on = fb === kind;
    return <div onClick={() => c.feedback(kind)} style={s(`display:flex;align-items:center;gap:9px;padding:11px 20px;border-radius:100px;border:1px solid ${on ? ok[1] : '#E5E8F0'};background:${on ? ok[0] : '#fff'};color:${on ? ok[2] : '#5B6478'};font-size:13px;font-weight:700;cursor:pointer`)}>{text}</div>;
  };

  return (
    <div style={{ maxWidth: 1180 }}>
      <div style={s('display:flex;align-items:center;gap:14px;margin-bottom:20px')}>
        <div style={s('font-size:25px;font-weight:800;letter-spacing:-.01em')}>{v.t}</div>
        <span style={s('padding:5px 11px;border-radius:100px;background:#EEF1F6;color:#0B2454;font-size:10px;letter-spacing:.1em;font-weight:800')}>MÓDULO {idx + 1}</span>
        <div style={{ flex: 1 }} />
        <div style={s('font-size:12.5px;color:#8A93A6')}>Sua trilha: <span style={s('color:#0B2454;font-weight:700')}>{Math.round((tFeito / t.videos.length) * 100)}% concluída</span></div>
      </div>
      <div style={s('display:grid;grid-template-columns:minmax(0,1fr) 288px;gap:18px;align-items:start')}>
        <div>
          <VideoPlayer c={c} v={v} />
          <div style={{ height: 20 }} />
          <Card pad="22px 24px" radius={14}><div style={s('font-size:14px;line-height:1.75;color:#39415A')}>{v.d || 'Sem descrição.'}</div></Card>

          <Card pad="22px 24px" radius={14} style="margin-top:16px">
            <div style={s('font-size:15px;font-weight:700;margin-bottom:4px')}>Esta aula foi útil para a sua rotina?</div>
            <div style={s('font-size:12.5px;color:#8A93A6;margin-bottom:16px')}>Feedback rápido — usado para revisar os vídeos com nota baixa.</div>
            <div style={s('display:flex;gap:10px')}>
              {fbBtn('up', 'Sim, ajudou', ['#DCFCE7', '#9BE3BC', '#0B6B3F'])}
              {fbBtn('neutral', 'Mais ou menos', ['#FFF7DE', '#F5E2A3', '#7A5A00'])}
              {fbBtn('down', 'Não ajudou', ['#FFF1F0', '#F3C3BE', '#B42318'])}
            </div>
          </Card>

          <div style={{ marginTop: 26 }}>
            <div style={s('font-size:18px;font-weight:700;margin-bottom:14px')}>Interações</div>
            <div style={s('display:flex;gap:9px;margin-bottom:14px')}>
              {tabs.map(tb => (
                <div key={tb.k} onClick={() => c.setTab(tb.k)} style={{ cursor: 'pointer' }}>
                  {c.tab === tb.k
                    ? <div style={s('padding:8px 16px;border-radius:100px;background:#EEF1F6;color:#0B2454;font-size:12.5px;font-weight:700')}>{tb.label}</div>
                    : <div style={s('padding:8px 16px;border-radius:100px;background:#fff;border:1px solid #E5E8F0;color:#5B6478;font-size:12.5px;font-weight:600')}>{tb.label}</div>}
                </div>
              ))}
            </div>
            <Card pad="18px 20px" radius={14} style="margin-bottom:14px">
              <textarea value={c.draft} onChange={e => c.setDraft(e.target.value)} placeholder={placeholders[c.tab]} style={s('width:100%;min-height:62px;border:none;outline:none;font-size:13.5px;line-height:1.6;color:#0F172A')} />
              <div style={s('display:flex;align-items:center;gap:10px;margin-top:8px')}>
                <span style={s('width:28px;height:28px;border-radius:50%;background:#0B2454;color:#fff;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(u.nome)}</span>
                <span style={s('font-size:13px;font-weight:600')}>{u.nome}</span>
                <span style={{ flex: 1 }} />
                <span style={s('font-size:11.5px;color:#9AA3B5')}>{c.tab === 'duvidas' ? 'Vai para a fila do suporte' + (u.empresa ? ' · ' + u.empresa : '') : 'Visível para o escritório'}</span>
                <span onClick={c.send} style={s('padding:9px 20px;border-radius:9px;background:#0B2454;color:#fff;font-size:13px;font-weight:700;cursor:pointer')}>Enviar</span>
              </div>
            </Card>
            {mine.map((m, i) => (
              <Interacao key={'m' + i} autor={u.nome} cargo={u.cargo || (u.papel === 'master' ? 'Usuário master' : 'Sub-usuário')} ini={iniciais(u.nome)} avBg="#0B2454" quando={quandoLabel(m.quando)} texto={m.texto}
                status={m.tipo === 'duvidas' ? 'Encaminhada ao suporte · aguardando resposta' : 'Registrado para o escritório'} />
            ))}
            {mine.length === 0 && <div style={s('font-size:13px;line-height:1.7;color:#8A93A6;padding:6px 2px')}>Ainda não há {c.tab === 'duvidas' ? 'dúvidas' : c.tab === 'sug' ? 'sugestões' : 'comentários'} nesta aula.</div>}
          </div>
        </div>

        <div style={s('position:sticky;top:96px;display:flex;flex-direction:column;gap:16px')}>
          <Card pad="20px 22px" radius={14}>
            <div style={s('font-size:14.5px;font-weight:700;margin-bottom:16px')}>Detalhes da aula</div>
            {label('DURAÇÃO TOTAL')}<div style={s('font-size:13.5px;font-weight:600;margin-bottom:14px')}>{v.min} minutos</div>
            {label('TRILHA')}<div style={s('font-size:13.5px;font-weight:600;margin-bottom:14px')}>{t.nome}</div>
            {v.menu && <>{label('MENU DO SISTEMA')}<div style={s('font-size:13.5px;font-weight:600;margin-bottom:14px')}>{v.menu}</div></>}
            {label('INSTRUTOR')}<div style={s('font-size:13.5px;font-weight:600;margin-bottom:18px')}>Suporte VERI</div>
            <div style={s('height:1px;background:#EEF1F6;margin-bottom:16px')} />
            {label('SEU PROGRESSO NESTA AULA', 7)}
            <div style={{ marginBottom: 8 }}><Bar pct={pct + '%'} /></div>
            <div style={s('font-size:12.5px;color:#7A8398;line-height:1.55')}>{d ? 'Concluído. Você pode reassistir quando quiser.' : pct > 0 ? 'Em andamento. Conclui ao assistir 90% sem pular partes.' : 'Ainda não iniciado.'}</div>
          </Card>
          <div onClick={() => (nx ? c.openVideo(nx.id) : t.quiz ? c.openQuiz(t.id) : c.go('trilhas'))} style={s('padding:15px 20px;border-radius:14px;background:#0B2454;color:#fff;cursor:pointer')}>
            <div style={s('font-size:10px;letter-spacing:.14em;font-weight:700;color:rgba(255,255,255,.72);margin-bottom:6px')}>PRÓXIMO PASSO</div>
            <div style={s('font-size:14px;font-weight:700;line-height:1.4')}>{nx ? nx.t : t.quiz ? 'Checkpoint da trilha ' + t.nome : 'Voltar às trilhas'}</div>
          </div>
          <Card pad="20px 22px" radius={14}>
            <div style={s('font-size:14.5px;font-weight:700;margin-bottom:13px')}>Continue na trilha</div>
            {t.videos.filter(x => x.id !== v.id).map(x => (
              <div key={x.id} onClick={() => c.openVideo(x.id)} style={s('display:flex;gap:11px;align-items:center;padding:9px 0;border-top:1px solid #F0F2F7;cursor:pointer')}>
                <span style={{ ...s('width:52px;height:34px;flex:none;border-radius:7px;background:linear-gradient(135deg,#0B2454,#0B2454);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.85);font-size:9px'), ...capaYoutube(x) }}>▶</span>
                <span style={s('flex:1;min-width:0')}>
                  <span style={s('display:block;font-size:12.5px;font-weight:600;line-height:1.35')}>{x.t}</span>
                  <span style={s('display:block;font-size:11px;color:#9AA3B5;margin-top:2px')}>{x.min} min</span>
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InteracaoProps { autor: string; cargo: string; ini: string; avBg: string; quando: string; texto: string; grupo?: string; status?: string; resp?: string; respAutor?: string }
function Interacao(p: InteracaoProps) {
  return (
    <Card pad="18px 20px" radius={14} style="margin-bottom:11px">
      <div style={s('display:flex;align-items:center;gap:11px;margin-bottom:9px')}>
        <span style={s(`width:32px;height:32px;border-radius:50%;background:${p.avBg};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center`)}>{p.ini}</span>
        <span style={s('font-size:13.5px;font-weight:700')}>{p.autor}</span>
        <span style={s('font-size:12px;color:#9AA3B5')}>· {p.cargo}</span>
        <span style={{ flex: 1 }} />
        <span style={s('font-size:11.5px;color:#9AA3B5')}>{p.quando}</span>
      </div>
      <div style={s('font-size:13.5px;line-height:1.65;color:#39415A')}>{p.texto}</div>
      {p.grupo && <div style={s('display:inline-flex;align-items:center;gap:8px;margin-top:11px;padding:6px 12px;border-radius:100px;background:#FFF7DE;border:1px solid #F5E2A3;font-size:11.5px;font-weight:700;color:#7A5A00')}>{p.grupo}</div>}
      {p.status && <div style={s('display:inline-flex;align-items:center;gap:8px;margin-top:11px;padding:6px 12px;border-radius:100px;background:#F1F3F8;border:1px solid #E5E8F0;font-size:11.5px;font-weight:700;color:#0B2454')}>{p.status}</div>}
      {p.resp && (
        <div style={s('margin-top:13px;padding:14px 16px;border-radius:11px;background:#F7F9FC;border-left:3px solid #0B2454')}>
          <div style={s('font-size:11px;letter-spacing:.1em;font-weight:800;color:#0B2454;margin-bottom:6px')}>{p.respAutor}</div>
          <div style={s('font-size:13px;line-height:1.65;color:#39415A')}>{p.resp}</div>
        </div>
      )}
    </Card>
  );
}

export function Quiz({ c }: { c: Central }) {
  const t = c.trilhas.find(x => x.id === c.quizTrilha);
  const q = t?.quiz;
  if (!t || !q) return null;
  const picked = c.quizPick;
  const correct = picked === q.a;
  const resolved = picked !== null;
  const continuar = () => {
    if (c.certReady && CERTIFICADO_ATIVO) { c.go('certificado'); return; }
    const nx = c.allVideos.find(v => !c.done[v.id]);
    if (nx) c.openVideo(nx.id); else c.go('trilhas');
  };
  return (
    <div style={s('max-width:720px;margin:20px auto')}>
      <Card pad="38px 40px" radius={20}>
        <div style={s('font-size:11px;letter-spacing:.16em;font-weight:800;color:#0B2454;margin-bottom:12px')}>CHECKPOINT · {t.nome}</div>
        <div style={s('font-size:23px;font-weight:700;line-height:1.35;margin-bottom:10px')}>{q.q}</div>
        <div style={s('font-size:13px;line-height:1.65;color:#8A93A6;margin-bottom:26px')}>Uma pergunta rápida para liberar o próximo módulo. Não é uma prova.</div>
        <div style={s('display:flex;flex-direction:column;gap:10px;margin-bottom:26px')}>
          {q.ops.map((o, i) => {
            const sel = picked === i, ok = resolved && i === q.a;
            const border = ok ? '#9BE3BC' : sel ? '#F3C3BE' : '#E9ECF3';
            const dot = ok ? '#12B76A' : sel ? '#EF6A5A' : '#C3C9D6';
            return (
              <div key={i} onClick={() => { if (!resolved) c.setQuizPick(i); }} style={s(`display:flex;align-items:center;gap:13px;padding:16px 18px;border-radius:12px;border:1.5px solid ${border};background:${ok ? '#F1FBF5' : sel ? '#FFF7F6' : '#fff'};cursor:pointer`)}>
                <span style={s(`width:24px;height:24px;flex:none;border-radius:50%;border:1.5px solid ${dot};background:${ok || sel ? dot : 'transparent'};color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center`)}>{ok ? '✓' : sel ? '✕' : ''}</span>
                <span style={s('font-size:14px;font-weight:500;color:#2A3144;line-height:1.5')}>{o}</span>
              </div>
            );
          })}
        </div>
        {resolved && (
          <div style={s(`padding:16px 18px;border-radius:12px;background:${correct ? '#F1FBF5' : '#FFF7DE'};border:1px solid ${correct ? '#CFEEDC' : '#F5E2A3'};font-size:13.5px;line-height:1.65;color:${correct ? '#0B6B3F' : '#7A5A00'};margin-bottom:22px`)}>
            {(correct ? 'Correto. ' : 'Quase. ') + q.exp}
          </div>
        )}
        <div style={s('display:flex;gap:11px;align-items:center')}>
          <div onClick={continuar} style={s('padding:14px 26px;border-radius:100px;background:#0B2454;color:#fff;font-size:14px;font-weight:700;cursor:pointer')}>
            {!resolved ? 'Responder depois' : c.certReady ? (CERTIFICADO_ATIVO ? 'Ver certificado' : 'Voltar às trilhas') : 'Continuar programa'}
          </div>
          <div onClick={() => c.go('trilhas')} style={s('padding:14px 22px;border-radius:100px;border:1px solid #E5E8F0;color:#5B6478;font-size:14px;font-weight:600;cursor:pointer')}>Voltar ao catálogo</div>
        </div>
      </Card>
    </div>
  );
}


export function Certificado({ c }: { c: Central }) {
  const faltam = c.total - c.doneCount;
  const linkedinText = `Concluí o programa Domine o Veri na VERI Academy — ${c.trilhas.length} trilhas e ${c.total} módulos sobre a rotina contábil dentro do Portal VERI. Certificado nº ${c.codigo}.`;
  const u = c.user!;
  const dataEmissao = new Date(c.certDate || Date.now()).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const cargaH = fmtDuracao(c.totalMin);
  const btn = (txt: string, fn: () => void, css: string) => <div onClick={fn} style={s(`padding:14px 20px;border-radius:12px;font-size:14px;text-align:center;cursor:pointer;${css}`)}>{txt}</div>;
  return (
    <div style={{ maxWidth: 1080 }}>
      {!c.certReady && (
        <Card pad="44px 46px" radius={20} style="text-align:center;max-width:620px;margin:20px auto">
          <div style={s('width:62px;height:62px;margin:0 auto 22px;border-radius:50%;background:#F1F3F8;color:#0B2454;font-size:23px;display:flex;align-items:center;justify-content:center')}>★</div>
          <div style={s('font-size:23px;font-weight:700;margin-bottom:10px')}>{c.total === 0 ? 'Seu certificado será liberado quando os vídeos forem publicados' : `Seu certificado está a ${faltam} ${faltam === 1 ? 'vídeo' : 'vídeos'} de distância`}</div>
          <div style={s('font-size:14px;line-height:1.7;color:#7A8398;margin-bottom:26px')}>{`O certificado é emitido apenas ao concluir o programa completo${c.total ? ` — as ${c.trilhas.length} trilhas e os ${c.total} vídeos` : ''}. Ele sai em seu nome, com ${u.empresa || 'o escritório'} como informação secundária.`}</div>
          <div style={{ marginBottom: 10 }}><Bar pct={c.pctGeral + '%'} h={8} /></div>
          <div style={s('font-size:12.5px;color:#8A93A6;margin-bottom:26px')}>{c.doneCount} de {c.total} vídeos concluídos</div>
          {c.nextV && (
            <div onClick={() => c.openVideo(c.nextV!.id)} style={s('display:inline-block;padding:13px 26px;border-radius:100px;background:#0B2454;color:#fff;font-size:14px;font-weight:700;cursor:pointer')}>
              {c.doneCount === 0 ? 'Começar agora' : 'Continuar de onde parei'}
            </div>
          )}
        </Card>
      )}
      {c.certReady && (
        <div style={s('display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start')}>
          <Card pad="18px" radius={18}>
            <div id="cert-print" data-theme="light" style={s('border:1px solid #E5E8F0;border-radius:12px;padding:52px 56px;background:linear-gradient(160deg,#FFFFFF 0%,#F7F9FF 100%);position:relative;overflow:hidden')}>
              <div style={s('position:absolute;right:-90px;bottom:-120px;width:340px;height:340px;border-radius:50%;background:rgba(11,36,84,.05)')} />
              <div style={{ position: 'relative' }}>
                <img src={import.meta.env.BASE_URL + 'assets/logo-veri-academy-dark.png'} alt="VERI Academy" style={s('height:30px;margin-bottom:38px')} />
                <div style={s('font-size:11px;letter-spacing:.24em;font-weight:700;color:#8A93A6;margin-bottom:16px')}>CERTIFICADO DE CONCLUSÃO</div>
                <div style={s('font-size:15px;color:#5B6478;margin-bottom:8px')}>Certificamos que</div>
                <div style={s('font-size:40px;font-weight:800;letter-spacing:-.02em;color:#0B2454;margin-bottom:14px')}>{u.nome}</div>
                <div style={s('font-size:15.5px;line-height:1.8;color:#39415A;max-width:560px;margin-bottom:38px')}>concluiu o programa completo <strong>Domine o Veri</strong> da VERI Academy, composto por {c.trilhas.length} trilhas e {c.total} módulos em vídeo, com carga horária total de {cargaH}{u.empresa && <>, atuando pelo escritório <strong>{u.empresa}</strong></>}.</div>
                <div style={s('display:flex;gap:56px;align-items:flex-end')}>
                  <div>{lbl('DATA DE EMISSÃO')}<div style={s('font-size:14px;font-weight:600;color:#0B2454')}>{dataEmissao}</div></div>
                  <div>{lbl('CÓDIGO DE VERIFICAÇÃO')}<div style={s('font-size:14px;font-weight:600;color:#0B2454;font-variant-numeric:tabular-nums')}>{c.codigo}</div></div>
                  <div style={{ flex: 1 }} />
                  <div style={{ textAlign: 'right' }}>
                    <div style={s('font-size:14px;font-weight:600;color:#0B2454;border-bottom:1px solid #C3C9D6;padding-bottom:6px;margin-bottom:6px')}>Equipe VERI Academy</div>
                    <div style={s('font-size:11px;color:#9AA3B5')}>Central de Aprendizagem VERI Academy</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div style={s('display:flex;flex-direction:column;gap:14px;position:sticky;top:96px')}>
            {btn('Baixar em PDF', () => { c.showToast('Na janela de impressão, escolha "Salvar como PDF"'); window.setTimeout(() => window.print(), 400); }, 'background:#0B2454;color:#fff;font-weight:700')}
            {btn('Compartilhar no LinkedIn', () => c.setShowLinkedin(true), 'background:#0A66C2;color:#fff;font-weight:700')}
            {btn('Copiar código de verificação', () => { navigator.clipboard?.writeText(c.codigo).then(() => c.showToast('Código copiado: ' + c.codigo), () => c.showToast('Código: ' + c.codigo)); }, 'background:#fff;border:1px solid #E5E8F0;color:#39415A;font-weight:600')}
            <Card pad="20px 22px" radius={14}>
              <div style={s('font-size:14px;font-weight:700;margin-bottom:12px')}>Sobre este certificado</div>
              <div style={s('font-size:12.5px;line-height:1.75;color:#7A8398')}>Emitido em nome da pessoa, não do escritório — para valer como credencial profissional. O código de verificação identifica este certificado e permanece com você mesmo se mudar de escritório.</div>
            </Card>
          </div>
        </div>
      )}
      {c.showLinkedin && (
        <div onClick={() => c.setShowLinkedin(false)} style={s('position:fixed;inset:0;background:rgba(9,16,32,.55);display:flex;align-items:center;justify-content:center;z-index:60')}>
          <div onClick={e => e.stopPropagation()} style={s('width:520px;background:#fff;border-radius:18px;padding:28px 30px;animation:veriUp .25s ease both')}>
            <div style={s('font-size:17px;font-weight:700;margin-bottom:16px')}>Pré-visualização do post</div>
            <div style={s('border:1px solid #E5E8F0;border-radius:14px;overflow:hidden')}>
              <div style={s('display:flex;gap:11px;align-items:center;padding:14px 16px')}>
                <span style={s('width:40px;height:40px;border-radius:50%;background:#0B2454;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center')}>{iniciais(u.nome)}</span>
                <span><span style={s('display:block;font-size:13.5px;font-weight:700')}>{u.nome}</span><span style={s('display:block;font-size:11.5px;color:#8A93A6')}>{[u.cargo, u.empresa].filter(Boolean).join(' · ')}</span></span>
              </div>
              <div style={s('padding:0 16px 14px;font-size:13.5px;line-height:1.7;color:#39415A')}>{linkedinText}</div>
              <div style={s('height:150px;background:linear-gradient(150deg,#0B2454,#0B2454);display:flex;align-items:center;justify-content:center')}><img src={import.meta.env.BASE_URL + 'assets/logo-veri-academy-light.png'} alt="VERI Academy" style={s('height:26px')} /></div>
            </div>
            <div style={s('display:flex;gap:10px;margin-top:18px')}>
              <div onClick={() => { c.setShowLinkedin(false); window.open('https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(linkedinText), '_blank', 'noopener'); }} style={s('flex:1;text-align:center;padding:13px;border-radius:100px;background:#0A66C2;color:#fff;font-size:14px;font-weight:700;cursor:pointer')}>Publicar no LinkedIn</div>
              <div onClick={() => c.setShowLinkedin(false)} style={s('padding:13px 22px;border-radius:100px;border:1px solid #E5E8F0;color:#5B6478;font-size:14px;font-weight:600;cursor:pointer')}>Cancelar</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const lbl = (t: string) => <div style={s('font-size:10px;letter-spacing:.16em;font-weight:700;color:#9AA3B5;margin-bottom:5px')}>{t}</div>;
