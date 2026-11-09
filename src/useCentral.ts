import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Area, CERTIFICADO_ATIVO, Material, Tab, Trilha, User, VideoFull, Workshop } from './data';
import { api, ApiError, getToken, setToken } from './api';
import { applyTheme, Theme } from './themes';
import { getSetor, setSetorStore } from './store';
import { Secao } from './demo';

const DISMISS_KEY = 'veri.tourDismissed';
const dismissed = () => { try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; } };
const setDismissed = () => { try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* sem storage */ } };

export type Screen = 'login' | 'sso' | 'inicio' | 'trilhas' | 'metodologia' | 'operacao' | 'resultados' | 'intranet' | 'player' | 'quiz' | 'perfil' | 'certificado' | 'notificacoes' | 'config';
export interface Mine { texto: string; quando: string; tipo: Tab; origem: string }
// `mine` guarda envios (lista por "videoId|aba") e feedback ("fb|videoId" -> 'up' | 'down').
export type Feedback = 'up' | 'neutral' | 'down';
export type MineMap = Record<string, Mine[] | Feedback>;

interface Progress {
  done: Record<string, boolean>; pos: Record<string, number>; mine: MineMap;
  prefs: Record<string, boolean>; tourDone: boolean; certDate: string | null;
}

const COMPLETE_AT = 90; // % assistido para contar como concluído

export function useCentral() {
  const [screen, setScreen] = useState<Screen>(getToken() ? 'sso' : 'login');
  const [user, setUser] = useState<User | null>(null);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaSel, setAreaSel] = useState<string>('');
  const [setor, setSetorState] = useState<string>(() => getSetor());
  const [metSecao, setMetSecao] = useState<Secao>('videos');
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginStep, setLoginStep] = useState<'email' | 'code'>('email');
  const [loginEmail, setLoginEmail] = useState('');

  const [tourStep, setTourStep] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));
  const [tourDone, setTourDone] = useState(false);
  const [variant, setVariant] = useState<'a' | 'b' | 'c'>('a');
  const [filtro, setFiltro] = useState('Todos');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [tab, setTabState] = useState<Tab>('coment');
  const [pos, setPos] = useState<Record<string, number>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [mine, setMine] = useState<MineMap>({});
  const [draft, setDraft] = useState('');
  const [quizTrilha, setQuizTrilha] = useState<string | null>(null);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [toast, setToastMsg] = useState<string | null>(null);
  const [showLinkedin, setShowLinkedin] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ p1: true, p2: true, p3: false, p4: true });
  const [certDate, setCertDate] = useState<string | null>(null);

  const toastT = useRef<number>();
  const saveT = useRef<number>();
  const lastSnap = useRef<string | null>(null);
  const doneRef = useRef(done); doneRef.current = done;
  const prefsRef = useRef(prefs); prefsRef.current = prefs;
  const trilhasRef = useRef(trilhas); trilhasRef.current = trilhas;

  const allVideos: VideoFull[] = useMemo(() => trilhas.flatMap(t => t.videos.map(v => ({ ...v, trilha: t }))), [trilhas]);
  // vídeos das áreas (não entram em progresso geral nem certificado)
  const areaVideos = useMemo(() => areas.flatMap(a => a.trilhas.flatMap(t => t.videos.map(v => ({ ...v, trilha: t } as VideoFull)))), [areas]);
  const findVideo = useCallback((id: string) => allVideos.find(v => v.id === id) || areaVideos.find(v => v.id === id), [allVideos, areaVideos]);
  const searchVideos = useMemo(() => [...allVideos, ...areas.filter(a => a.liberada).flatMap(a => a.trilhas.flatMap(t => t.videos.map(v => ({ ...v, trilha: t } as VideoFull))))], [allVideos, areas]);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastT.current);
    setToastMsg(msg);
    toastT.current = window.setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const resetLocal = () => {
    setUser(null); setTrilhas([]); setWorkshops([]); setMateriais([]); setAreas([]); setLoaded(false); setDone({}); setPos({}); setMine({});
    setCertDate(null); setTourDone(false); setVideoId(null); lastSnap.current = null;
  };

  const logout = useCallback(() => {
    if (getToken()) api('/api/logout', { method: 'POST', body: {} }).catch(() => { /* sessão já inválida */ });
    setToken(''); resetLocal(); setLoginStep('email'); setScreen('login');
  }, []);

  // Carrega sessão + catálogo. Mantém o "SSO" visível por um instante para a transição.
  const loadSession = useCallback(async () => {
    try {
      const [sess, cat] = await Promise.all([
        api<{ user: User; progress: Progress }>('/api/session'),
        api<{ trilhas: Trilha[]; areas: Area[]; workshops: Workshop[]; materiais: Material[] }>('/api/catalog'),
        new Promise(r => setTimeout(r, 1200)),
      ]);
      const p = sess.progress;
      setUser(sess.user); setTrilhas(cat.trilhas); setWorkshops(cat.workshops); setMateriais(cat.materiais || []); setAreas(cat.areas || []);
      setAreaSel((cat.areas || []).find(a => a.liberada)?.id || (cat.areas || [])[0]?.id || '');
      setDone(p.done || {}); setPos(p.pos || {}); setMine(p.mine || {});
      setPrefs(prev => ({ ...prev, ...(p.prefs || {}) })); setTourDone(!!p.tourDone); setCertDate(p.certDate || null);
      lastSnap.current = JSON.stringify({ done: p.done || {}, pos: p.pos || {}, mine: p.mine || {}, prefs: { ...prefsRef.current, ...(p.prefs || {}) }, tourDone: !!p.tourDone, certDate: p.certDate || null });
      setLoaded(true);
      setScreen('inicio');
      setTourStep(0); setTourOpen(!p.tourDone && !dismissed());
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setToken(''); resetLocal(); setScreen('login');
        setLoginError('Seu acesso não está mais liberado. Confirme com o administrador se o seu e-mail está na lista.');
      } else {
        setScreen('login'); setLoginError('Não foi possível conectar ao servidor. Tente novamente.');
      }
    }
  }, []);

  useEffect(() => {
    if (getToken()) loadSession();
    return () => { clearTimeout(toastT.current); clearTimeout(saveT.current); };
  }, [loadSession]);

  const loginFail = (e: unknown, codigo = false) => setLoginError(
    e instanceof ApiError && e.status === 429 ? 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
      : e instanceof ApiError && e.status === 403 ? (codigo ? 'Código inválido ou expirado. Confira o e-mail ou peça um novo código.' : 'Este e-mail não está na lista de acessos liberados. Fale com o administrador da sua conta.')
        : e instanceof ApiError && e.status === 502 ? 'Não foi possível enviar o e-mail com o código agora. Tente novamente em instantes.'
          : 'Não foi possível conectar ao servidor. Tente novamente.');

  // Etapa 1: e-mail. Em modo código o servidor envia um código; em modo teste devolve a sessão direto.
  const login = async (email: string) => {
    setLoginBusy(true); setLoginError('');
    try {
      const r = await api<{ token?: string; needsCode?: boolean }>('/api/login', { method: 'POST', body: { email } });
      if (r.token) { setToken(r.token); setScreen('sso'); await loadSession(); }
      else { setLoginEmail(email); setLoginStep('code'); }
    } catch (e) { loginFail(e); } finally { setLoginBusy(false); }
  };
  // Etapa 2: código recebido por e-mail.
  const verifyCode = async (code: string) => {
    setLoginBusy(true); setLoginError('');
    try {
      const r = await api<{ token: string }>('/api/verify', { method: 'POST', body: { email: loginEmail, code } });
      setToken(r.token); setScreen('sso'); setLoginStep('email'); await loadSession();
    } catch (e) { loginFail(e, true); } finally { setLoginBusy(false); }
  };
  const backToEmail = () => { setLoginStep('email'); setLoginError(''); };

  // Certificado: registra a data da emissão na primeira vez que o programa é concluído.
  const doneCount = allVideos.filter(v => done[v.id]).length;
  const total = allVideos.length;
  const certReady = total > 0 && doneCount === total;
  useEffect(() => { if (loaded && certReady && !certDate) setCertDate(new Date().toISOString()); }, [loaded, certReady, certDate]);

  // Persistência: salva a cada mudança (debounce curto) e ao fechar/ocultar a aba.
  const snapshot = () => ({ done, pos, mine, prefs, tourDone, certDate });
  const snapRef = useRef(snapshot); snapRef.current = snapshot;
  const flush = useCallback((keepalive = false) => {
    if (!getToken()) return;
    const body = snapRef.current();
    const snap = JSON.stringify(body);
    if (snap === lastSnap.current) return;
    lastSnap.current = snap;
    api('/api/progress', { method: 'POST', body, keepalive }).catch(e => { lastSnap.current = null; if (e instanceof ApiError && e.status === 401) logout(); });
  }, [logout]);

  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveT.current);
    saveT.current = window.setTimeout(() => flush(), 600);
  }, [loaded, done, pos, mine, prefs, tourDone, certDate, flush]);

  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') flush(true); };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('pagehide', () => flush(true));
    return () => document.removeEventListener('visibilitychange', hide);
  }, [flush]);

  // ---------- métricas de uso (tempo de tela, vídeos, feedback) ----------
  const trk = useRef({ buf: [] as Record<string, unknown>[], screenSecs: {} as Record<string, number>, watch: {} as Record<string, number>, lastAct: Date.now(), playingUntil: 0 });
  const screenRef = useRef(screen); screenRef.current = screen;
  const loadedRef = useRef(loaded); loadedRef.current = loaded;
  const track = useCallback((e: Record<string, unknown>) => { trk.current.buf.push(e); }, []);
  const trackWatch = useCallback((id: string, dt: number) => {
    const t = trk.current; t.watch[id] = (t.watch[id] || 0) + dt; t.playingUntil = Date.now() + 3000;
  }, []);
  const flushTrack = useCallback((keepalive = false) => {
    if (!getToken()) return;
    const t = trk.current; const events: Record<string, unknown>[] = t.buf.splice(0);
    for (const k of Object.keys(t.screenSecs)) { if (t.screenSecs[k] > 0) events.push({ ev: 'tela', screen: k, secs: t.screenSecs[k] }); delete t.screenSecs[k]; }
    for (const k of Object.keys(t.watch)) { const w = Math.floor(t.watch[k]); if (w > 0) { events.push({ ev: 'watch', id: k, secs: w }); t.watch[k] -= w; } }
    if (events.length) api('/api/track', { method: 'POST', body: { events }, keepalive }).catch(() => { /* métrica perdida não bloqueia o uso */ });
  }, []);
  useEffect(() => {
    const act = () => { trk.current.lastAct = Date.now(); };
    const evs = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    evs.forEach(e => window.addEventListener(e, act, { passive: true }));
    const tick = window.setInterval(() => {
      const t = trk.current;
      if (!loadedRef.current || document.visibilityState !== 'visible') return;
      // conta tempo de tela só com a aba visível e a pessoa ativa (mouse/teclado nos últimos 2 min ou vídeo rodando)
      if (Date.now() - t.lastAct < 120000 || t.playingUntil > Date.now()) t.screenSecs[screenRef.current] = (t.screenSecs[screenRef.current] || 0) + 1;
    }, 1000);
    const send = window.setInterval(() => flushTrack(), 30000);
    const hide = () => { if (document.visibilityState === 'hidden') flushTrack(true); };
    document.addEventListener('visibilitychange', hide);
    const unload = () => flushTrack(true);
    window.addEventListener('pagehide', unload);
    return () => { evs.forEach(e => window.removeEventListener(e, act)); clearInterval(tick); clearInterval(send); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', unload); };
  }, [flushTrack]);

  const top = () => window.scrollTo(0, 0);
  const go = (s: Screen) => { setScreen(s); top(); };
  const openVideo = (id: string) => { track({ ev: 'video_open', id }); setScreen('player'); setVideoId(id); setDraft(''); setTabState('coment'); top(); };
  const openWorkshop = (_id: string) => { /* workshops não existem no menu do colaborador */ };
  const openQuiz = (trilhaId: string) => { setScreen('quiz'); setQuizTrilha(trilhaId); setQuizPick(null); top(); };

  const nextAfter = (id: string): VideoFull | undefined => {
    const list = allVideos; const i = list.findIndex(v => v.id === id);
    return list.slice(i + 1).find(v => !doneRef.current[v.id]) || list.find(v => !doneRef.current[v.id]);
  };

  const afterComplete = (id: string) => {
    if (id.startsWith('ws:')) { showToast('Workshop assistido · progresso salvo'); return; }
    const v = allVideos.find(x => x.id === id) || areaVideos.find(x => x.id === id); if (!v) return;
    if (v.trilha.area) { // vídeo de área: segue só dentro da trilha da área
      const nx = v.trilha.videos.find(x => !doneRef.current[x.id]);
      if (prefsRef.current.p4 && nx) { showToast('Aula concluída · abrindo o próximo vídeo'); window.setTimeout(() => openVideo(nx.id), 1500); }
      else showToast(nx ? 'Aula concluída · progresso salvo em seu perfil' : 'Trilha da área concluída');
      return;
    }
    const all = allVideos.every(x => doneRef.current[x.id]);
    const trilhaCompleta = v.trilha.videos.every(x => doneRef.current[x.id]);
    if (all) { showToast('Programa concluído · parabéns!'); if (CERTIFICADO_ATIVO) window.setTimeout(() => go('certificado'), 1200); return; }
    if (trilhaCompleta && v.trilha.quiz) { window.setTimeout(() => openQuiz(v.trilha.id), 600); return; }
    const nx = nextAfter(id);
    if (prefsRef.current.p4 && nx) { showToast('Aula concluída · abrindo o próximo vídeo'); window.setTimeout(() => openVideo(nx.id), 1500); return; }
    showToast('Aula concluída · progresso salvo em seu perfil');
  };

  // Chamado pelo player conforme o vídeo é de fato assistido (pct = % máximo atingido sem pular).
  const reportProgress = (id: string, pct: number) => {
    const p = Math.min(100, Math.max(0, Math.floor(pct)));
    setPos(prev => ((prev[id] || 0) >= p ? prev : { ...prev, [id]: p }));
    if (p >= COMPLETE_AT && !doneRef.current[id]) {
      doneRef.current = { ...doneRef.current, [id]: true };
      setDone(doneRef.current);
      track({ ev: 'video_complete', id });
      afterComplete(id);
    }
  };

  const send = () => {
    const txt = draft.trim();
    const v = videoId && findVideo(videoId);
    if (!txt || !v) return;
    const key = v.id + '|' + tab;
    setMine(m => ({ ...m, [key]: ((m[key] as Mine[]) || []).concat([{ texto: txt, quando: new Date().toISOString(), tipo: tab, origem: v.t }]) }));
    setDraft('');
    showToast(tab === 'duvidas' ? 'Dúvida enviada ao suporte do escritório' : 'Enviado · obrigado pelo retorno');
  };

  const feedback = (v: Feedback) => {
    if (!videoId) return;
    setMine(m => ({ ...m, ['fb|' + videoId]: v }));
    track({ ev: 'feedback', id: videoId, v });
    showToast(v === 'up' ? 'Obrigado pelo retorno' : 'Registrado · usamos o seu retorno para melhorar este vídeo');
  };

  const pctGeral = total ? Math.round((doneCount / total) * 100) : 0;
  const nextV = allVideos.find(v => !done[v.id]) || allVideos[allVideos.length - 1] || null;
  const trilhasDone = trilhas.filter(t => t.videos.length > 0 && t.videos.every(v => done[v.id])).length;
  const totalMin = allVideos.reduce((n, v) => n + v.min, 0);
  const minhas = Object.keys(mine).filter(k => !k.startsWith('fb|')).flatMap(k => mine[k] as Mine[]);
  const codigo = useMemo(() => {
    let h = 0; const s = user?.email || '';
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return `VERI-AC-${(certDate ? new Date(certDate) : new Date()).getFullYear()}-${h.toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}`;
  }, [user, certDate]);

  return {
    screen, go, setScreen, user, login, verifyCode, backToEmail, loginStep, loginEmail, loginError, loginBusy, logout,
    setor, setSetor: (s: string) => { setSetorStore(s); setSetorState(s); }, metSecao, setMetSecao,
    trilhas, areas, areaSel, setAreaSel, areaVideos, searchVideos, workshops, materiais, allVideos, findVideo, loaded,
    tourStep, setTourStep, tourDone, variant, setVariant, filtro, setFiltro,
    videoId, openVideo, openQuiz, workshopId, openWorkshop, tab, setTab: (t: Tab) => { setTabState(t); setDraft(''); },
    pos, done, mine, minhas, draft, setDraft, send, feedback, reportProgress, trackWatch,
    quizTrilha, quizPick, setQuizPick, toast, showToast, showLinkedin, setShowLinkedin,
    prefs, togglePref: (k: string) => setPrefs(p => ({ ...p, [k]: !p[k] })),
    doneCount, total, totalMin, pctGeral, nextV, certReady, certDate, codigo, trilhasDone,
    tourOpen,
    // fecha só desta vez: o tutorial volta no próximo acesso
    closeTour: () => { setDismissed(); setTourOpen(false); go('inicio'); showToast('Você pode rever o tutorial em Configurações'); },
    finishTour: () => { setDismissed(); setTourOpen(false); go('inicio'); showToast('Tudo pronto · sua jornada está esperando'); },
    // fecha e grava na conta: não aparece mais nos próximos acessos
    neverShowTour: () => { setTourDone(true); setDismissed(); setTourOpen(false); go('inicio'); showToast('Tutorial desativado · você pode refazê-lo em Configurações'); },
    redoTour: () => { setScreen('inicio'); setTourStep(0); setTourOpen(true); },
    theme, toggleTheme: () => setThemeState(t => { const n: Theme = t === 'dark' ? 'light' : 'dark'; applyTheme(n); return n; }),
  };
}
export type Central = ReturnType<typeof useCentral>;
