// Dados de exemplo do protótipo. Nada aqui vem de clientes reais.
export type PersonaId = 'lead' | 'academy' | 'veri' | 'colab';
export type ScreenId =
  | 'inicio' | 'conteudo' | 'lives' | 'materiais' | 'comunidade' | 'ofertas' | 'planos'
  | 'sistema' | 'gamificacao' | 'indicacao' | 'beneficios'
  | 'treinamentos' | 'checklists' | 'gravacoes' | 'intranet' | 'metricas'
  | 'sobre' | 'problemas' | 'eventos';

export const NIVEL: Record<PersonaId, number> = { lead: 0, academy: 1, veri: 2, colab: 3 };

export const PERSONAS: { id: PersonaId; label: string; nome: string; papel: string; resumo: string }[] = [
  { id: 'lead', label: 'Lead (teste grátis)', nome: 'Mariana Souza', papel: 'Lead · teste de 7 dias', resumo: 'Conhece a Veri pelo conteúdo gratuito e tem 7 dias para experimentar.' },
  { id: 'academy', label: 'Cliente Veri Academy', nome: 'Rafael Lima', papel: 'Cliente Veri Academy', resumo: 'Paga pela plataforma de educação. Ainda não usa o sistema Veri.' },
  { id: 'veri', label: 'Cliente Veri', nome: 'Camila Duarte', papel: 'Cliente Veri · Escritório Exemplo', resumo: 'Usa o sistema Veri e recebe tudo do Academy, mais benefícios de cliente.' },
  { id: 'colab', label: 'Colaborador', nome: 'João Ferreira', papel: 'Colaborador · Comercial', resumo: 'Time interno: treinamentos, checklists, gravações e intranet.' },
];

export const NAV: Record<PersonaId, { id: ScreenId; label: string }[]> = {
  lead: [
    { id: 'inicio', label: 'Início' }, { id: 'sobre', label: 'A Veri' }, { id: 'problemas', label: 'Problemas que resolvemos' },
    { id: 'conteudo', label: 'Conteúdos' }, { id: 'lives', label: 'Lives' }, { id: 'eventos', label: 'Eventos' },
    { id: 'materiais', label: 'Materiais' }, { id: 'comunidade', label: 'Comunidade' }, { id: 'ofertas', label: 'Ofertas e sorteios' },
    { id: 'gamificacao', label: 'Missões e desconto' }, { id: 'planos', label: 'Planos' },
  ],
  academy: [
    { id: 'inicio', label: 'Início' }, { id: 'problemas', label: 'Problemas que resolvemos' }, { id: 'conteudo', label: 'Conteúdos' },
    { id: 'lives', label: 'Lives' }, { id: 'eventos', label: 'Eventos' }, { id: 'materiais', label: 'Materiais' },
    { id: 'comunidade', label: 'Comunidade' }, { id: 'gamificacao', label: 'Conquistas' }, { id: 'ofertas', label: 'Ofertas e sorteios' }, { id: 'planos', label: 'Planos' },
  ],
  veri: [
    { id: 'inicio', label: 'Início' }, { id: 'conteudo', label: 'Conteúdos' }, { id: 'sistema', label: 'Tutoriais do sistema' },
    { id: 'lives', label: 'Lives' }, { id: 'eventos', label: 'Eventos' }, { id: 'materiais', label: 'Materiais' }, { id: 'comunidade', label: 'Comunidade' },
    { id: 'indicacao', label: 'Indique e ganhe' }, { id: 'gamificacao', label: 'Conquistas' }, { id: 'beneficios', label: 'Benefícios' }, { id: 'ofertas', label: 'Ofertas e sorteios' },
  ],
  colab: [
    { id: 'inicio', label: 'Início' }, { id: 'treinamentos', label: 'Treinamentos' }, { id: 'checklists', label: 'Checklists comerciais' },
    { id: 'gravacoes', label: 'Gravações' }, { id: 'materiais', label: 'Materiais' }, { id: 'sistema', label: 'Tutoriais do sistema' },
    { id: 'intranet', label: 'Intranet' }, { id: 'comunidade', label: 'Comunidade' }, { id: 'metricas', label: 'Métricas de sucesso' },
  ],
};

/** plano mínimo: 0 = aberto no teste grátis, 1 = Academy, 2 = Cliente Veri */
export type Conteudo = { id: string; t: string; tipo: string; min: number; plano: 0 | 1 | 2; cor: string; parceiro?: boolean; tag?: string };
export const CONTEUDOS: Conteudo[] = [
  { id: 'c0', t: 'CNDs: como emitir e acompanhar com a Veri', tipo: 'Vídeo', min: 14, plano: 0, cor: '#0B2454', tag: 'Mais pedido no suporte' },
  { id: 'p1', t: 'Aula de parceiro: gestão financeira do escritório (exemplo)', tipo: 'Vídeo', min: 26, plano: 0, cor: '#1F3C7A', parceiro: true },
  { id: 'p2', t: 'Aula de parceiro: captação de clientes (exemplo)', tipo: 'Vídeo', min: 30, plano: 1, cor: '#2B4F96', parceiro: true },
  { id: 'c1', t: 'Como precificar honorários', tipo: 'Vídeo', min: 18, plano: 0, cor: '#0B2454' },
  { id: 'c2', t: 'Escritório com organização e eficiência', tipo: 'Vídeo', min: 24, plano: 0, cor: '#1F3C7A' },
  { id: 'c3', t: 'Ebook: primeiros passos de marketing', tipo: 'Ebook', min: 12, plano: 0, cor: '#2B4F96' },
  { id: 'c4', t: 'Funil de vendas para serviços', tipo: 'Vídeo', min: 32, plano: 1, cor: '#0B2454' },
  { id: 'c5', t: 'Gestão de equipe em escritórios', tipo: 'Vídeo', min: 28, plano: 1, cor: '#1F3C7A' },
  { id: 'c6', t: 'Planilha de metas e indicadores', tipo: 'Planilha', min: 8, plano: 1, cor: '#2B4F96' },
  { id: 'c7', t: 'IA no atendimento ao cliente', tipo: 'Vídeo', min: 22, plano: 1, cor: '#0B2454' },
  { id: 'c8', t: 'Suporte que reduz chamados', tipo: 'Vídeo', min: 20, plano: 2, cor: '#1F3C7A' },
  { id: 'c9', t: 'Masterclass exclusiva para clientes Veri', tipo: 'Vídeo', min: 45, plano: 2, cor: '#2B4F96' },
];

export const SISTEMA = [
  { t: 'Primeiros passos no sistema Veri', min: 9 }, { t: 'Cadastro de clientes e contratos', min: 12 },
  { t: 'Rotinas e tarefas da equipe', min: 14 }, { t: 'Relatórios e indicadores', min: 11 },
  { t: 'Integrações disponíveis', min: 8 }, { t: 'Permissões e acessos', min: 7 },
];

export const LIVES = [
  { dia: 'Seg', tema: 'Marketing para escritórios', quando: 'Toda segunda · 19h' },
  { dia: 'Ter', tema: 'Vendas e negociação', quando: 'Toda terça · 19h' },
  { dia: 'Qua', tema: 'Gestão e operação', quando: 'Toda quarta · 19h' },
  { dia: 'Qui', tema: 'UX, suporte e atendimento', quando: 'Toda quinta · 19h' },
  { dia: 'Sex', tema: 'IA e automação de funis', quando: 'Toda sexta · 12h' },
];

export const MATERIAIS = [
  { t: 'Apresentação: conheça o sistema Veri (slides)', tipo: 'Slides', plano: 0 },
  { t: 'Material de parceiro: guia de planejamento tributário (exemplo)', tipo: 'PDF · Parceiro', plano: 0 },
  { t: 'Ebook: guia de precificação', tipo: 'PDF', plano: 0 }, { t: 'Planilha: fluxo de caixa do escritório', tipo: 'Planilha', plano: 0 },
  { t: 'Kit de posts para redes sociais', tipo: 'Material rico', plano: 1 }, { t: 'Modelo de proposta comercial', tipo: 'Documento', plano: 1 },
  { t: 'Checklist de onboarding de cliente', tipo: 'Checklist', plano: 1 }, { t: 'Playbook de upgrade para clientes Veri', tipo: 'Playbook', plano: 2 },
];

export type Post = { autor: string; cargo: string; tempo: string; txt: string; likes: number; coments: { autor: string; txt: string }[] };
export const POSTS: Post[] = [
  { autor: 'Larissa M.', cargo: 'Sócia de escritório contábil', tempo: 'há 2 h', txt: 'Alguém já testou cobrar por pacote de serviços em vez de por hora? Quero ouvir resultados.', likes: 14, coments: [{ autor: 'Paulo R.', txt: 'Testamos no ano passado. Conto como foi se tiver interesse.' }, { autor: 'Time Veri', txt: 'A live de quinta fala disso. Vale assistir.' }] },
  { autor: 'Time Veri', cargo: 'Veri', tempo: 'ontem', txt: 'Resumo da live de vendas já está nas gravações. Quem perdeu pode assistir quando quiser.', likes: 31, coments: [{ autor: 'Ana C.', txt: 'Ótimo conteúdo, obrigada!' }] },
  { autor: 'Paulo R.', cargo: 'Gestor de escritório', tempo: 'há 2 dias', txt: 'Como vocês organizam a rotina de fechamento mensal com a equipe remota?', likes: 9, coments: [] },
];

export const PROBLEMAS = [
  { id: 'cnd', t: 'Certidões (CNDs)', destaque: true, dor: 'Emitir, conferir validade e acompanhar certidões de vários clientes consome horas e gera retrabalho.', solucao: 'A Veri centraliza as certidões, avisa antes de vencerem e mostra o que está pendente por cliente.', video: 'CNDs na Veri: do vencimento ao aviso' },
  { id: 'acomp', t: 'Acompanhamento de obrigações', dor: 'A equipe perde prazos quando as obrigações ficam espalhadas em planilhas e mensagens.', solucao: 'Rotinas e tarefas por cliente, com responsável, prazo e status visíveis para todo o time.', video: 'Acompanhamento de obrigações em um só lugar' },
  { id: 'rotinas', t: 'Rotinas automáticas', dor: 'Tarefas repetitivas ocupam o time e abrem espaço para erro.', solucao: 'Rotinas que rodam sozinhas e avisam só quando precisam de uma decisão.', video: 'Como configurar rotinas automáticas' },
  { id: 'usab', t: 'Usabilidade no dia a dia', dor: 'Dúvidas simples de uso viram chamados e atrasam o trabalho.', solucao: 'Tutoriais curtos por tela, dentro da plataforma, para resolver sem abrir chamado.', video: 'Tour rápido pelo sistema' },
];

export const SOBRE = {
  servicos: ['Gestão de rotinas e obrigações por cliente', 'Certidões e prazos em um só lugar', 'Automação de tarefas repetitivas', 'Relatórios e indicadores do escritório', 'Integrações com outros sistemas'],
  dores: ['Prazos perdidos', 'Retrabalho com certidões', 'Equipe sem visão do todo', 'Muitos chamados por dúvidas simples'],
};

export const EVENTOS = [
  { t: 'Próximo evento Veri (exemplo)', quando: 'Data a definir', d: 'Encontro com clientes e parceiros: palestras, networking e sorteios.', sorteio: 'Sorteio de 3 ingressos' },
  { t: 'Imersão de gestão para escritórios (exemplo)', quando: 'Data a definir', d: 'Um dia de conteúdo prático sobre vendas, gestão e operação.', sorteio: 'Sorteio de 2 vagas' },
];

/** Missões do teste grátis: cada uma libera 5% de desconto na implantação da Veri (regra de exemplo, até 25%). */
export const MISSOES = [
  { id: 'm1', t: 'Assistir a um conteúdo aberto' }, { id: 'm2', t: 'Ver um vídeo de “Problemas que resolvemos”' },
  { id: 'm3', t: 'Pedir lembrete de uma live' }, { id: 'm4', t: 'Participar de um sorteio' }, { id: 'm5', t: 'Curtir uma postagem da comunidade' },
];
export const DESCONTO_POR_MISSAO = 5;

export const MARCOS_BRINDES = [
  { n: 1, t: 'Garrafinha Veri' }, { n: 3, t: 'Copo Veri' }, { n: 5, t: 'Mochila Veri' },
];

export const OFERTAS = [
  { t: 'Sorteio: 3 ingressos para o evento Veri', tipo: 'Sorteio', fim: 'Encerra em 5 dias', plano: 0 },
  { t: 'Desconto no plano anual do Academy', tipo: 'Oferta', fim: 'Válido até o fim do mês', plano: 0 },
  { t: 'Sorteio de livros de gestão', tipo: 'Sorteio', fim: 'Encerra em 12 dias', plano: 1 },
  { t: 'Sorteio mensal exclusivo para clientes Academy', tipo: 'Sorteio', fim: 'Participação em dobro no Academy (exemplo)', plano: 1 },
  { t: 'Condição especial para contratar o Veri', tipo: 'Oferta', fim: 'Para clientes Academy', plano: 1 },
  { t: 'Brinde exclusivo: kit Veri', tipo: 'Brinde', fim: 'Para clientes Veri', plano: 2 },
];

export const CONQUISTAS = [
  { t: 'Primeiro vídeo concluído', pts: 50, ok: true }, { t: 'Trilha completa', pts: 200, ok: true },
  { t: 'Participou de 3 lives', pts: 150, ok: false }, { t: 'Participou da comunidade', pts: 100, ok: true },
  { t: 'Concluiu 10 vídeos', pts: 300, ok: false },
];
export const CONQUISTAS_EXT = [
  { t: 'Indicou um escritório', pts: 300, ok: true }, { t: 'Indicação virou cliente', pts: 1000, ok: false },
  { t: 'Avaliou a plataforma', pts: 100, ok: true }, { t: 'Compartilhou um conteúdo', pts: 80, ok: false },
];

export const TREINOS = [
  { t: 'Onboarding de novos colaboradores', min: 40, area: 'Todos', feito: true }, { t: 'Conhecendo o sistema Veri por dentro', min: 55, area: 'Todos', feito: true },
  { t: 'Cultura e atendimento Veri', min: 30, area: 'Todos', feito: false }, { t: 'Trilha Comercial: SDR', min: 70, area: 'Comercial', feito: false },
  { t: 'Trilha Comercial: Consultor', min: 85, area: 'Comercial', feito: false },
];

export const CHECKLISTS: { t: string; itens: string[] }[] = [
  { t: 'Quebrar objeções', itens: ['Ouvir a objeção até o fim', 'Confirmar o motivo real', 'Responder com um caso parecido', 'Checar se a dúvida foi resolvida'] },
  { t: 'Gerar desejo', itens: ['Mostrar o problema que o cliente sente hoje', 'Mostrar o cenário depois da solução', 'Usar exemplo de cliente parecido'] },
  { t: 'Negociar', itens: ['Definir limite antes da conversa', 'Trocar desconto por condição', 'Registrar o combinado por escrito'] },
  { t: 'Prospecção fria', itens: ['Pesquisar o escritório antes', 'Abrir com algo específico dele', 'Propor um próximo passo pequeno'] },
  { t: 'Outbound', itens: ['Lista segmentada', 'Sequência de contatos definida', 'Registrar tudo no CRM'] },
  { t: 'Apresentação perfeita', itens: ['Começar pelo problema', 'Mostrar a demonstração curta', 'Fechar com próximo passo e data'] },
  { t: 'Garantir o pagamento', itens: ['Confirmar forma de pagamento', 'Enviar contrato e cobrança juntos', 'Conferir a primeira cobrança'] },
];

export const GRAVACOES = [
  { t: 'Treinamento comercial: abril', min: 62 }, { t: 'Alinhamento de produto', min: 48 },
  { t: 'Reunião geral do time', min: 55 }, { t: 'Revisão de objeções do mês', min: 38 },
];

export const INTRANET = [
  { t: 'Calendário da empresa', d: 'Feriados, eventos e lives' }, { t: 'Políticas e processos', d: 'Regras internas e fluxos' },
  { t: 'Contatos por área', d: 'Quem resolve cada assunto' }, { t: 'Comunicados', d: 'Novidades do time' },
];

export const INDICACOES_INI = [
  { nome: 'Escritório Alfa', status: 3 }, { nome: 'Contábil Beta', status: 1 }, { nome: 'Gestão Ômega', status: 0 },
];
export const ETAPAS = ['Enviada', 'Contato feito', 'Demo ou teste', 'Contratou', 'Recompensa liberada'];

export const FONTES = [
  { f: 'Tickets de suporte (HubSpot)', d: 'Chamados, tempo de atendimento e assunto' },
  { f: 'Cobrança (Asaas)', d: 'Receita, planos e cancelamentos' },
  { f: 'Sistema Veri', d: 'Uso real do produto' },
  { f: 'Banco da Academy', d: 'Progresso, tempo de tela e certificados' },
  { f: 'Analytics (PostHog)', d: 'Comportamento por página e funil' },
  { f: 'RH e financeiro', d: 'Custo por hora do atendimento' },
  { f: 'Pesquisas NPS e CSAT', d: 'Satisfação e feedback por conteúdo' },
];

// Base real do suporte 2026 (arquivo "Suporte 2026.docx", de janeiro até 06/11/2026).
export const SUPORTE = {
  chamados: 22490, avaliacoes: 6301, positivas: 98, espera: '04min36seg', tma: '1h20min', tmaMin: 80,
  acessosConsultivos: 5516, tickets: 1478,
  casosChat: ['Usabilidade', 'CNDs', 'Bugs', 'Rotinas Automáticas', 'Problema na API'],
  casosTicket: ['CNDs', 'Bugs', 'Usabilidade', 'Problema na API'],
  mesesPeriodo: 10.2,
};
