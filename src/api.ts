// Modo demonstração: não existe servidor. As mesmas chamadas da versão real são atendidas aqui, no navegador,
// com dados fictícios (demo.ts). O progresso fica salvo só neste navegador.
import { DEMO_AREAS, DEMO_MATERIAIS, DEMO_TRILHAS, demoUser } from './demo';

const KEY = 'veri.token';
const EMAIL = 'veri.demo.email';
const PROG = 'veri.demo.progress';
const rd = (k: string) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };
const wr = (k: string, v: string) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* sem storage */ } };

export const getToken = () => rd(KEY);
export const setToken = (t: string) => wr(KEY, t);

export class ApiError extends Error { constructor(public status: number) { super('HTTP ' + status); } }

const progressInicial = () => ({
  done: { tut1: true, tut2: true, 'cm-r1': true, 'cm-r2': true }, pos: { tut3: 40, 'cm-r3': 55 }, mine: {},
  prefs: { p1: true, p2: true, p3: false, p4: true }, tourDone: true, certDate: null,
});

export async function api<T>(path: string, init: { method?: string; body?: unknown; keepalive?: boolean } = {}): Promise<T> {
  await new Promise(r => setTimeout(r, 120));
  const body = (init.body || {}) as Record<string, unknown>;
  const out = (x: unknown) => x as T;
  switch (path) {
    case '/api/login': {
      const email = String(body.email || '').trim().toLowerCase();
      if (!email) throw new ApiError(403);
      wr(EMAIL, email); wr(KEY, 'demo');
      return out({ token: 'demo' });
    }
    case '/api/verify': throw new ApiError(403);
    case '/api/logout': wr(KEY, ''); return out({ ok: true });
    case '/api/session': {
      if (!getToken()) throw new ApiError(401);
      let progress = progressInicial();
      try { const s = rd(PROG); if (s) progress = { ...progress, ...JSON.parse(s) }; } catch { /* usa o inicial */ }
      return out({ user: demoUser(rd(EMAIL) || 'colaborador@veri.com.br'), progress });
    }
    case '/api/catalog':
      if (!getToken()) throw new ApiError(401);
      return out({ trilhas: DEMO_TRILHAS, areas: DEMO_AREAS, workshops: [], materiais: DEMO_MATERIAIS });
    case '/api/progress': wr(PROG, JSON.stringify(init.body || {})); return out({ ok: true });
    case '/api/track': return out({ ok: true });
    default: throw new ApiError(404);
  }
}
