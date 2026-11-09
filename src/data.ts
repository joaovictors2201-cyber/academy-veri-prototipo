export interface Quiz { q: string; ops: string[]; a: number; exp: string }
export interface Video { id: string; t: string; min: number; d: string; src?: string; youtube?: string; legenda?: string; poster?: string; menu?: string; locked?: boolean }
export interface Trilha { id: string; nome: string; desc: string; videos: Video[]; quiz?: Quiz; area?: string }
export interface VideoFull extends Video { trilha: Trilha }
export interface Area { id: string; nome: string; liberada: boolean; trilhas: Trilha[] }
export interface Workshop { id: string; quando?: string; t: string; d: string; link?: string; youtube?: string }
export type MaterialTipo = 'ebook' | 'apresentacao' | 'planilha' | 'documento';
export interface Material { id: string; tipo: MaterialTipo; t: string; d: string; src: string; bytes?: number }
export interface User { email: string; nome: string; empresa: string; papel: 'master' | 'sub'; cargo: string; tipo: 'colaborador' | 'cliente'; admin: boolean; areas: string[] }

export type Tab = 'coment' | 'duvidas' | 'sug';

/** Certificado pausado por enquanto. Para reativar, troque para true (telas e textos voltam). */
export const CERTIFICADO_ATIVO = false;

/** Capa (CSS "background") a partir da miniatura do YouTube; vazio se o vídeo não é do YouTube. Escurece levemente para o texto/ícone ficar legível. */
export function capaYoutube(v: { youtube?: string }): { background?: string } {
  const id = youtubeId(v.youtube);
  return id ? { background: `linear-gradient(rgba(11,36,84,.28),rgba(11,36,84,.28)), url(https://i.ytimg.com/vi/${id}/hqdefault.jpg) center/cover no-repeat #0B2454` } : {};
}

/** Aceita o link do YouTube (watch, youtu.be, embed, live, shorts) ou o ID de 11 caracteres. */
export function youtubeId(v?: string): string {
  if (!v) return '';
  const m = v.match(/(?:youtu\.be\/|[?&]v=|embed\/|live\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(v.trim()) ? v.trim() : '';
}

export const prefsDef = [
  { k: 'p1', t: 'Lembretes de retomada', d: 'Avisar quando um vídeo ficar mais de 5 dias em andamento.' },
  { k: 'p2', t: 'Respostas do suporte por e-mail', d: 'Receber uma cópia quando uma dúvida sua for respondida.' },
  { k: 'p3', t: 'Resumo semanal para o escritório', d: 'Enviar seu progresso para o usuário master.' },
  { k: 'p4', t: 'Reprodução automática do próximo vídeo', d: 'Seguir para o próximo módulo ao concluir o atual.' },
];

export const papelLabel = (u: User) => (u.tipo === 'colaborador' ? 'Colaborador' : u.papel === 'master' ? 'Usuário master' : 'Sub-usuário');
export const iniciais = (nome: string) => nome.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
export const primeiroNome = (nome: string) => nome.split(/\s+/)[0] || nome;

export function fmtDuracao(totalMin: number) {
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
}
