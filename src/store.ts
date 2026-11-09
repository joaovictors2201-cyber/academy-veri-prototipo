// Estado local da demonstração (salvo só neste navegador).
import { INDICADORES, ItemOp, OP_PADRAO, PESSOAS } from './demo';

const rd = (k: string) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };
const wr = (k: string, v: string) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* sem storage */ } };

export const getSetor = () => rd('veri.setor');
export const setSetorStore = (s: string) => wr('veri.setor', s);

const hoje = () => new Date().toISOString().slice(0, 10);

/** Checklist do dia: a lista (itens) persiste; as marcações zeram quando muda o dia. */
export function loadOperacao(): ItemOp[] {
  try {
    const raw = rd('veri.operacao');
    if (raw) {
      const o = JSON.parse(raw) as { dia: string; itens: ItemOp[] };
      return o.dia === hoje() ? o.itens : o.itens.map(i => ({ ...i, ok: false }));
    }
  } catch { /* usa o padrão */ }
  return OP_PADRAO.map(i => ({ ...i }));
}
export const saveOperacao = (itens: ItemOp[]) => wr('veri.operacao', JSON.stringify({ dia: hoje(), itens }));

/** Metas editáveis (líder). Sem edição, vale a meta padrão do indicador. */
export function loadMetas(): Record<string, number> {
  try { return JSON.parse(rd('veri.metas') || '{}'); } catch { return {}; }
}
export const saveMetas = (m: Record<string, number>) => wr('veri.metas', JSON.stringify(m));

export const metaDe = (id: string, metas: Record<string, number>) => metas[id] ?? INDICADORES.find(i => i.id === id)!.meta;

export const noAlvo = (melhor: 'maior' | 'menor', valor: number, meta: number) => (melhor === 'maior' ? valor >= meta : valor <= meta);

/** Quantos indicadores de uma pessoa estão fora da meta. */
export function vermelhos(pessoaId: string, metas: Record<string, number>): number {
  const p = PESSOAS.find(x => x.id === pessoaId);
  if (!p) return 0;
  return INDICADORES.filter((ind, i) => !noAlvo(ind.melhor, p.valores[i], metaDe(ind.id, metas))).length;
}

export function fmtValor(v: number, un: '' | '%' | 'min' | 'R$'): string {
  const n = Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');
  if (un === '%') return n + '%';
  if (un === 'min') return n + ' min';
  if (un === 'R$') return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  return n;
}

export const media = (idx: number): number => {
  const outros = PESSOAS.filter(p => p.id !== 'eu');
  return outros.reduce((a, p) => a + p.valores[idx], 0) / outros.length;
};
