// Dados de demonstração (fictícios). Nada aqui vem de clientes, vendedores ou do HubSpot reais.
import { Area, Material, Trilha, User, Video } from './data';

const v = (id: string, t: string, min: number, d: string, youtube?: string): Video => ({ id, t, min, d, ...(youtube ? { youtube } : {}) });

export const DEMO_TRILHAS: Trilha[] = [
  {
    id: 'ignicao', nome: 'Ignição', desc: 'Seus primeiros passos na plataforma e no sistema Veri.',
    videos: [
      v('tut1', 'Vídeo Ignição - Plataforma Veri', 9, 'Como a plataforma funciona e por onde começar.', 'https://youtu.be/S47GRqIIrbY'),
      v('tut2', 'Conhecendo o sistema Veri por dentro', 15, 'Um passeio pelas áreas do sistema.'),
      v('tut3', 'Cadastros e rotinas do dia a dia', 12, 'O que fazer todo dia dentro do sistema.'),
    ],
  },
  {
    id: 'ferramentas', nome: 'Ferramentas do vendedor', desc: 'Como registrar e organizar o seu trabalho comercial.',
    videos: [
      v('tut4', 'Registrar atividade no CRM', 8, 'Passo a passo do registro de cada contato.'),
      v('tut5', 'Preencher as perguntas qualificatórias', 6, 'Quais perguntas fazer e onde registrar.'),
      v('tut6', 'Gravar e registrar uma reunião', 7, 'Como gravar, salvar e anexar no CRM.'),
    ],
  },
  {
    id: 'workshops', nome: 'Workshops (exemplo)', desc: 'Gravações de workshops e aulas com convidados, como exemplo de conteúdo extra.',
    videos: [
      v('ws1', 'Sala Secreta - Aula de Mayara Junges - Gestão e Processos', 70, 'Aula sobre gestão e processos.', 'https://youtu.be/iIKRLU-88aA'),
      v('ws2', 'Aula com Glaucia Campelo - Como Precificar Honorários', 109, 'Como definir e apresentar o preço dos honorários.', 'https://youtu.be/jppUVKKZGv0'),
      v('ws3', 'Aula com Dayane Borges - Escritório contábil com Organização e Eficiência', 68, 'Organização e eficiência na rotina do escritório.', 'https://youtu.be/6DMUK3QW9p0'),
    ],
  },
];

const area = 'comercial';
const cm = (id: string, t: string, min: number, d: string): Video => ({ id: 'cm-' + id, t, min, d });

export const DEMO_AREAS: Area[] = [
  {
    id: 'comercial', nome: 'Comercial', liberada: true,
    trilhas: [
      {
        id: 'rotina', nome: 'Rotina do vendedor', area, desc: 'Cortes específicos do dia a dia: agendar, ligar e garantir uma boa agenda.',
        videos: [
          cm('r1', 'Como agendar outbound', 9, 'Do primeiro contato ao convite para a reunião.'),
          cm('r2', 'Como agendar inbound', 8, 'Como responder rápido ao lead que chegou.'),
          cm('r3', 'O que fazer quando não consegue agendar', 7, 'Próximos passos e quando insistir.'),
          cm('r4', 'Para quem ligar em cada horário', 6, 'Melhores horários e perfis para cada bloco.'),
          cm('r5', 'Quais informações ter antes de ligar', 6, 'O que pesquisar antes de discar.'),
          cm('r6', 'Como passar da secretária', 7, 'Abordagem para chegar ao decisor.'),
          cm('r7', 'Como garantir uma boa agenda', 10, 'Sócios presentes, tamanho do negócio e o que ele usa hoje.'),
        ],
      },
      {
        id: 'negociacao', nome: 'Apresentação e negociação', area, desc: 'Da abertura da reunião ao fechamento, com foco em ticket.',
        videos: [
          cm('n1', 'Como iniciar uma apresentação e o que perguntar', 11, 'Abertura e perguntas de descoberta.'),
          cm('n2', 'Como identificar a dor principal do cliente', 9, 'Perguntas que levam à dor que mais pesa.'),
          cm('n3', 'Como apresentar uma função', 8, 'Mostrar a função ligada à dor do cliente.'),
          cm('n4', 'Como negociar', 12, 'Condições, concessões e fechamento.'),
          cm('n5', 'Como aumentar o ticket de setup', 8, 'Como vender uma implantação mais completa.'),
          cm('n6', 'Como aumentar o ticket de mensalidade', 8, 'Como vender um plano maior.'),
        ],
      },
    ],
  },
  { id: 'marketing', nome: 'Marketing', liberada: false, trilhas: [] },
];

/** Gravações: apresentações reais do time por tipo de objeção. Ficam na seção Gravações da Metodologia. */
export const DEMO_GRAVACOES: Trilha = {
  id: 'modelos', nome: 'Apresentações de vendas', area, desc: 'Consultores apresentando a Veri, e modelos por tipo de objeção (em gravação).',
  videos: [
    { id: 'cm-g0a', t: 'Apresentação Kleiton - venda VERI', min: 21, d: 'Apresentação de venda da Veri feita pelo consultor Kleiton.', youtube: 'https://youtu.be/y-sE2InVd9o' },
    { id: 'cm-g0b', t: 'Apresentação de vendas - Gui', min: 20, d: 'Apresentação de venda da Veri feita pelo consultor Gui.', youtube: 'https://youtu.be/qrg8R4eJJAg' },
    cm('g1', 'Modelo 1: quebra de objeção de preço', 38, 'Reunião gravada em que a objeção principal era o preço.'),
    cm('g2', 'Modelo 2: quebra de objeção de onboarding', 41, 'Reunião gravada em que o medo era a implantação.'),
    cm('g3', 'Modelo 3: quebra de objeção de forma de pagamento', 35, 'Reunião gravada com negociação de pagamento.'),
    cm('g4', 'Apresentação da empresa', 22, 'Como apresentar a Veri em poucos minutos.'),
  ],
};

export const DEMO_MATERIAIS: Material[] = [
  { id: 'dm1', tipo: 'ebook', t: 'Ebook: guia do vendedor Veri (exemplo)', d: 'Visão geral da abordagem comercial da Veri.', src: 'demo:ebook' },
  { id: 'dm2', tipo: 'documento', t: 'Scripts de ligação e WhatsApp (exemplo)', d: 'Modelos de abertura, retomada e follow-up.', src: 'demo:scripts' },
  { id: 'dm3', tipo: 'planilha', t: 'Planilha de acompanhamento de agendas (exemplo)', d: 'Controle de agendas, shows e próximos passos.', src: 'demo:planilha' },
  { id: 'dm4', tipo: 'apresentacao', t: 'Apresentação institucional da Veri (exemplo)', d: 'Slides oficiais para usar nas reuniões.', src: 'demo:slides' },
  { id: 'dm5', tipo: 'documento', t: 'Guia de agendas automáticas (exemplo)', d: 'Como configurar e acompanhar as agendas automáticas.', src: 'demo:agendas' },
];

export function demoUser(email: string): User {
  const base = (email.split('@')[0] || 'colaborador').replace(/[._-]+/g, ' ');
  const nome = base.replace(/\b\w/g, c => c.toUpperCase()).trim() || 'Colaborador';
  return { email, nome, empresa: 'Veri', papel: 'sub', cargo: 'Vendedor (SDR)', tipo: 'colaborador', admin: false, areas: ['comercial'] };
}

// ---------- Metodologia: checklists (exemplo de conteúdo) ----------
export const DEMO_CHECKLISTS: { id: string; t: string; itens: string[] }[] = [
  { id: 'ck-out', t: 'Como agendar outbound', itens: ['Separar a lista do dia por perfil', 'Pesquisar o escritório antes de ligar', 'Abrir com algo específico dele', 'Propor um próximo passo pequeno', 'Registrar o contato no CRM'] },
  { id: 'ck-in', t: 'Como agendar inbound', itens: ['Responder o lead novo em poucos minutos', 'Confirmar o motivo do contato', 'Oferecer dois horários', 'Enviar confirmação da agenda'] },
  { id: 'ck-nao', t: 'O que fazer quando não consegue agendar', itens: ['Tentar por outro canal (ligação, WhatsApp, e-mail)', 'Variar o horário da tentativa', 'Registrar o motivo no CRM', 'Programar o próximo follow-up'] },
  { id: 'ck-hor', t: 'Para quem ligar em cada horário', itens: ['Manhã: decisores e sócios', 'Início da tarde: retomadas e follow-ups', 'Fim do dia: quem não atendeu antes'] },
  { id: 'ck-info', t: 'Informações antes de ligar', itens: ['Tamanho do escritório', 'Sistema que usa hoje', 'Quem decide a compra', 'Histórico de contato no CRM'] },
  { id: 'ck-obj', t: 'Quebrar objeções', itens: ['Ouvir a objeção até o fim', 'Confirmar o motivo real', 'Responder com um caso parecido', 'Checar se a dúvida foi resolvida'] },
  { id: 'ck-neg', t: 'Negociar', itens: ['Definir o limite antes da conversa', 'Trocar desconto por condição', 'Registrar o combinado por escrito'] },
  { id: 'ck-pag', t: 'Garantir o pagamento', itens: ['Confirmar a forma de pagamento', 'Enviar contrato e cobrança juntos', 'Conferir a primeira cobrança'] },
];

// ---------- Operação: checklist de rotina do dia (padrão) ----------
export interface ItemOp { id: string; h?: string; t: string; ok: boolean }
export const OP_PADRAO: ItemOp[] = [
  { id: 'o1', h: '09h', t: 'Bloco de ligações da manhã (X horas)', ok: false },
  { id: 'o2', h: '09h30', t: 'Enviar e-mail de marketing', ok: false },
  { id: 'o3', h: '10h', t: 'Garantir 200 ligações no dia', ok: false },
  { id: 'o4', h: '10h30', t: 'Atualizar o CRM', ok: false },
  { id: 'o5', t: 'Retomar agendas paradas', ok: false },
  { id: 'o6', t: 'Follow-up dos leads da semana', ok: false },
  { id: 'o7', t: 'Registrar a gravação das reuniões', ok: false },
  { id: 'o8', t: 'Registrar a atividade no CRM', ok: false },
  { id: 'o9', t: 'Preencher as perguntas qualificatórias da agenda', ok: false },
];

// ---------- Resultados (dados fictícios) ----------
export type Secao = 'videos' | 'gravacoes' | 'materiais' | 'checklists';
export interface Sugestao { t: string; tipo: string; secao: Secao }
export interface Indicador { id: string; nome: string; grupo: string; un: '' | '%' | 'min' | 'R$'; sub: string; melhor: 'maior' | 'menor'; meta: number; sug: Sugestao[] }

const sv = (t: string): Sugestao => ({ t, tipo: 'Vídeo', secao: 'videos' });
const sg = (t: string): Sugestao => ({ t, tipo: 'Gravação', secao: 'gravacoes' });
const sm = (t: string): Sugestao => ({ t, tipo: 'Material', secao: 'materiais' });
const sc = (t: string): Sugestao => ({ t, tipo: 'Checklist', secao: 'checklists' });

export const INDICADORES: Indicador[] = [
  { id: 'ligacoes', nome: 'Ligações', grupo: 'Atividade', un: '', sub: 'por dia', melhor: 'maior', meta: 200, sug: [sv('Para quem ligar em cada horário'), sc('Como agendar outbound')] },
  { id: 'tentLig', nome: 'Média de tentativas de ligação', grupo: 'Atividade', un: '', sub: 'por lead', melhor: 'maior', meta: 5, sug: [sv('Como agendar outbound'), sc('O que fazer quando não consegue agendar')] },
  { id: 'tentWpp', nome: 'Média de tentativas de WhatsApp', grupo: 'Atividade', un: '', sub: 'por lead', melhor: 'maior', meta: 4, sug: [sm('Scripts de ligação e WhatsApp'), sc('O que fazer quando não consegue agendar')] },
  { id: 'atendidos', nome: 'Leads atendidos', grupo: 'Atividade', un: '', sub: 'no mês', melhor: 'maior', meta: 120, sug: [sv('Quais informações ter antes de ligar')] },
  { id: 'qualif', nome: '% de leads qualificados', grupo: 'Qualidade', un: '%', sub: 'dos atendidos', melhor: 'maior', meta: 35, sug: [sv('Como identificar a dor principal do cliente'), sc('Informações antes de ligar')] },
  { id: 'ltLig', nome: 'Lead time de ligação', grupo: 'Velocidade', un: 'min', sub: 'até o 1º contato', melhor: 'menor', meta: 10, sug: [sv('Como agendar inbound'), sc('Como agendar inbound')] },
  { id: 'ltWpp', nome: 'Lead time de WhatsApp', grupo: 'Velocidade', un: 'min', sub: 'até a 1ª resposta', melhor: 'menor', meta: 5, sug: [sv('Como agendar inbound'), sm('Scripts de ligação e WhatsApp')] },
  { id: 'agendas', nome: 'Agendas', grupo: 'Funil', un: '', sub: 'no mês', melhor: 'maior', meta: 30, sug: [sv('Como agendar outbound'), sv('Como agendar inbound'), sv('O que fazer quando não consegue agendar')] },
  { id: 'shows', nome: 'Shows', grupo: 'Funil', un: '', sub: 'no mês', melhor: 'maior', meta: 20, sug: [sv('Como garantir uma boa agenda')] },
  { id: 'contratos', nome: 'Contratos', grupo: 'Funil', un: '', sub: 'no mês', melhor: 'maior', meta: 8, sug: [sv('Como negociar'), sg('Modelo 1: quebra de objeção de preço')] },
  { id: 'convLA', nome: '% Conversão lead → agenda', grupo: 'Conversão', un: '%', sub: '', melhor: 'maior', meta: 22, sug: [sv('Como passar da secretária'), sv('Como agendar outbound')] },
  { id: 'convAS', nome: '% Conversão agenda → show', grupo: 'Conversão', un: '%', sub: '', melhor: 'maior', meta: 70, sug: [sv('Como garantir uma boa agenda'), sc('Como agendar inbound')] },
  { id: 'convSC', nome: '% Conversão show → contrato', grupo: 'Conversão', un: '%', sub: '', melhor: 'maior', meta: 35, sug: [sv('Como negociar'), sg('Modelo 3: quebra de objeção de forma de pagamento')] },
  { id: 'ticket', nome: 'Ticket médio geral', grupo: 'Receita e parcerias', un: 'R$', sub: '', melhor: 'maior', meta: 1800, sug: [sv('Como aumentar o ticket de setup'), sv('Como aumentar o ticket de mensalidade')] },
  { id: 'indicacoes', nome: 'Número de indicações', grupo: 'Receita e parcerias', un: '', sub: 'no mês', melhor: 'maior', meta: 4, sug: [sm('Scripts de ligação e WhatsApp')] },
  { id: 'parcerias', nome: 'Parcerias ativas', grupo: 'Receita e parcerias', un: '', sub: '', melhor: 'maior', meta: 3, sug: [sg('Apresentação da empresa')] },
  { id: 'cobrancas', nome: 'Cobranças semanais de setup pendentes', grupo: 'Operação', un: '', sub: 'por semana', melhor: 'menor', meta: 2, sug: [sc('Garantir o pagamento')] },
  { id: 'roletagem', nome: 'Roletagem de agendas e negociações', grupo: 'Operação', un: '', sub: 'revisões no mês', melhor: 'maior', meta: 15, sug: [sc('Retomar agendas paradas (Operação)')] },
  { id: 'agAuto', nome: 'Agendas automáticas', grupo: 'Operação', un: '', sub: 'no mês', melhor: 'maior', meta: 10, sug: [sm('Guia de agendas automáticas')] },
];

export const PESSOAS: { id: string; nome: string; valores: number[] }[] = [
  { id: 'eu', nome: 'Você (exemplo)', valores: [205, 3.1, 4.4, 126, 36, 14, 4, 24, 14, 7, 17, 58, 36, 1950, 4, 3, 1, 16, 11] },
  { id: 'ana', nome: 'Ana Costa', valores: [215, 5.4, 4.2, 135, 38, 8, 4, 34, 25, 10, 25, 74, 40, 1900, 6, 4, 1, 18, 12] },
  { id: 'bruno', nome: 'Bruno Alves', valores: [500, 1.8, 2.0, 140, 26, 12, 6, 22, 11, 3, 14, 50, 27, 1400, 1, 2, 5, 9, 4] },
  { id: 'carla', nome: 'Carla Mendes', valores: [205, 4.8, 4.5, 128, 36, 6, 3, 31, 22, 9, 24, 71, 41, 2100, 5, 5, 2, 17, 11] },
  { id: 'diego', nome: 'Diego Rocha', valores: [190, 3.9, 3.5, 118, 33, 14, 7, 27, 18, 6, 21, 66, 34, 1750, 3, 3, 3, 14, 8] },
];

// ---------- Intranet (exemplo) ----------
export interface Post { autor: string; cargo: string; tempo: string; txt: string; likes: number; coments: { autor: string; txt: string }[] }
export const DEMO_POSTS: Post[] = [
  { autor: 'Ana Costa', cargo: 'SDR · Comercial', tempo: 'há 1 h', txt: 'Testei ligar logo depois do e-mail de marketing e a taxa de atendimento subiu na minha lista. Alguém mais percebeu?', likes: 8, coments: [{ autor: 'Diego Rocha', txt: 'Comigo funcionou no bloco das 10h.' }] },
  { autor: 'Líder do Comercial', cargo: 'Líder · Comercial', tempo: 'ontem', txt: 'Gravação do treinamento de objeções já está na Metodologia. Quem não viu, assista até sexta.', likes: 14, coments: [] },
  { autor: 'Carla Mendes', cargo: 'SDR · Comercial', tempo: 'há 2 dias', txt: 'Dica: antes de ligar, olhar o histórico no CRM economiza uns dois minutos por contato.', likes: 11, coments: [{ autor: 'Bruno Alves', txt: 'Boa. Vou adotar.' }] },
];
export const COMUNICADOS = [
  { t: 'Novo bloco de ligações às 10h', d: 'A partir da próxima semana o bloco da manhã passa a ter 2 horas seguidas.', q: 'Esta semana' },
  { t: 'Atualização do CRM', d: 'Novos campos nas perguntas qualificatórias da agenda.', q: 'Semana passada' },
  { t: 'Reunião geral do time', d: 'Resultados do mês e metas do próximo ciclo.', q: 'Dia 5' },
];
export const AGENDA = [
  { d: 'Seg', t: 'Alinhamento semanal do Comercial', h: '09h' },
  { d: 'Qua', t: 'Revisão de objeções (gravada)', h: '15h' },
  { d: 'Sex', t: 'Retrospectiva e metas da semana', h: '16h' },
];
export const CONTATOS = [
  { nome: 'Líder do Comercial', area: 'Comercial', d: 'Metas, agendas e negociações' },
  { nome: 'Time de Marketing', area: 'Marketing', d: 'E-mails, materiais e campanhas' },
  { nome: 'Time de Suporte', area: 'Suporte', d: 'Dúvidas de clientes e do sistema' },
  { nome: 'RH', area: 'Pessoas', d: 'Benefícios, férias e treinamentos' },
];
export const DOCS = ['Políticas internas (exemplo)', 'Código de conduta (exemplo)', 'Fluxo de aprovação de desconto (exemplo)', 'Manual do CRM (exemplo)'];

// As gravações moram na área Comercial (para o player achar os vídeos) e aparecem na seção Gravações.
DEMO_AREAS[0].trilhas.push(DEMO_GRAVACOES);
