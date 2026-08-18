/* ---------------------------------------------------------------------------
 * Catálogo FITE — materiais digitais (ebooks, checklists, planilhas, treinos).
 * Edite/adicione itens aqui: o catálogo, o modal e o carrinho leem desta lista.
 *
 * Campos:
 *   id        - identificador único e estável (usado no carrinho salvo)
 *   cat       - chave do filtro (precisa existir em FITE_CATEGORIAS)
 *   price     - número em reais. 0 = material gratuito
 *   oldPrice  - opcional, mostra preço riscado
 *   tone      - 1..5, define o gradiente da capa
 * ------------------------------------------------------------------------- */
window.FITE_CATEGORIAS = [
  { key: "TODOS", label: "Todos" },
  { key: "EBOOK", label: "Ebooks" },
  { key: "CHECKLIST", label: "Checklists" },
  { key: "PLANILHA", label: "Planilhas" },
  { key: "TREINAMENTO", label: "Treinamentos" },
];

window.FITE_PRODUTOS = [
  {
    id: "fite-01",
    codigo: "FITE 01",
    cat: "EBOOK",
    tone: 1,
    destaque: true,
    title: "Guia prático de ergonomia auditável",
    subtitle: "AEP, AET, indicadores e gestão de riscos para empresas",
    price: 0,
    formato: "PDF - 68 páginas",
    nivel: "Introdutório",
    resumo:
      "O material de entrada da FITE: mostra como sair do laudo parado na pasta e transformar ergonomia em um sistema de gestão com evidência, prioridade e indicador.",
    inclui: [
      "Checklist de maturidade ergonômica",
      "Diferença entre AEP, AET e gestão contínua",
      "Indicadores que ajudam a conversar com a diretoria",
    ],
  },
  {
    id: "fite-02",
    codigo: "FITE 02",
    cat: "EBOOK",
    tone: 2,
    title: "AEP e AET na prática",
    subtitle: "Do levantamento de campo ao relatório que a auditoria aceita",
    price: 97,
    oldPrice: 147,
    formato: "PDF - 124 páginas",
    nivel: "Intermediário",
    resumo:
      "Passo a passo das duas análises exigidas pela NR-17: o que observar em campo, como registrar, como quantificar e como escrever o relatório sem deixar lacuna técnica.",
    inclui: [
      "Roteiro de entrevista e observação de posto",
      "Modelo de estrutura de relatório AEP e AET",
      "Erros que derrubam o laudo em auditoria",
    ],
  },
  {
    id: "fite-03",
    codigo: "FITE 03",
    cat: "EBOOK",
    tone: 3,
    title: "Indicadores de ergonomia para a diretoria",
    subtitle: "Traduzindo risco ergonômico em linguagem de negócio",
    price: 127,
    formato: "PDF - 96 páginas",
    nivel: "Avançado",
    resumo:
      "Como escolher, calcular e apresentar indicadores diretos e indiretos que sustentam decisão de investimento em ergonomia diante da liderança.",
    inclui: [
      "Catálogo de 24 indicadores com fórmula e fonte do dado",
      "Modelo de painel executivo mensal",
      "Como conectar afastamento, custo e produtividade",
    ],
  },
  {
    id: "fite-04",
    codigo: "FITE 04",
    cat: "EBOOK",
    tone: 4,
    title: "Exoesqueletos na Indústria 4.0",
    subtitle: "Protocolo de avaliação, implementação e acompanhamento",
    price: 197,
    formato: "PDF - 88 páginas",
    nivel: "Avançado",
    resumo:
      "Baseado em implementação real de exoesqueletos em linha produtiva: critérios de seleção do posto, teste piloto, treinamento do operador e medição de resultado.",
    inclui: [
      "Matriz de elegibilidade de posto para exoesqueleto",
      "Roteiro de piloto de 90 dias",
      "Indicadores de adesão e de redução de sobrecarga",
    ],
  },
  {
    id: "fite-05",
    codigo: "FITE 05",
    cat: "CHECKLIST",
    tone: 5,
    title: "Checklist de maturidade ergonômica",
    subtitle: "52 pontos de verificação em 5 dimensões",
    price: 47,
    formato: "PDF editável - 14 páginas",
    nivel: "Introdutório",
    resumo:
      "Diagnóstico rápido do estágio da sua operação: documentação, campo, indicadores, governança e cultura. Gera uma nota por dimensão e um plano de prioridade.",
    inclui: [
      "52 pontos com critério de pontuação",
      "Régua de maturidade em 4 estágios",
      "Plano de ação sugerido por estágio",
    ],
  },
  {
    id: "fite-06",
    codigo: "FITE 06",
    cat: "CHECKLIST",
    tone: 1,
    title: "Checklist de conformidade NR-17 e NR-36",
    subtitle: "Requisito por requisito, com a evidência esperada",
    price: 67,
    formato: "PDF editável - 22 páginas",
    nivel: "Intermediário",
    resumo:
      "Lista de verificação para auditoria interna: cada requisito normativo com o documento, registro ou prática que comprova o atendimento.",
    inclui: [
      "Requisitos da NR-17 e da NR-36 lado a lado",
      "Coluna de evidência aceita em auditoria",
      "Campo de responsável e prazo por item",
    ],
  },
  {
    id: "fite-07",
    codigo: "FITE 07",
    cat: "CHECKLIST",
    tone: 2,
    title: "Checklist de posto administrativo",
    subtitle: "Home office e escritório corporativo",
    price: 47,
    formato: "PDF editável - 12 páginas",
    nivel: "Introdutório",
    resumo:
      "Verificação de mobiliário, monitor, iluminação, pausas e organização do trabalho para postos administrativos presenciais e remotos.",
    inclui: [
      "Versão presencial e versão home office",
      "Orientação de ajuste por item verificado",
      "Registro fotográfico padronizado",
    ],
  },
  {
    id: "fite-08",
    codigo: "FITE 08",
    cat: "PLANILHA",
    tone: 3,
    title: "Matriz de risco ergonômico",
    subtitle: "Priorização automática por severidade e exposição",
    price: 147,
    oldPrice: 197,
    formato: "Excel - fórmulas liberadas",
    nivel: "Intermediário",
    resumo:
      "Planilha pronta para classificar risco por posto, calcular prioridade e gerar a fila de intervenção que a liderança consegue acompanhar.",
    inclui: [
      "Cálculo automático de grau de risco",
      "Painel de prioridade por área e por posto",
      "Histórico de reavaliação por ciclo",
    ],
  },
  {
    id: "fite-09",
    codigo: "FITE 09",
    cat: "PLANILHA",
    tone: 4,
    title: "Plano de ação ergonômico",
    subtitle: "Do achado técnico ao acompanhamento com prazo",
    price: 97,
    formato: "Excel - fórmulas liberadas",
    nivel: "Intermediário",
    resumo:
      "Estrutura de plano de ação com responsável, prazo, status, custo estimado e evidência de conclusão, pronta para apresentar em reunião de SESMT.",
    inclui: [
      "Painel de status e atrasos",
      "Vínculo entre achado, ação e evidência",
      "Exportação para relatório executivo",
    ],
  },
  {
    id: "fite-10",
    codigo: "FITE 10",
    cat: "PLANILHA",
    tone: 5,
    title: "Painel de absenteísmo e queixas",
    subtitle: "Série histórica de afastamentos por setor",
    price: 127,
    formato: "Excel - fórmulas liberadas",
    nivel: "Avançado",
    resumo:
      "Consolida afastamentos, queixas osteomusculares e retornos ao trabalho em uma série histórica que mostra tendência por setor e sustenta decisão de intervenção.",
    inclui: [
      "Entrada mensal simplificada",
      "Gráficos de tendência por setor",
      "Alerta automático de área crítica",
    ],
  },
  {
    id: "fite-11",
    codigo: "FITE 11",
    cat: "TREINAMENTO",
    tone: 1,
    destaque: true,
    title: "Ergonomia de Alta Performance",
    subtitle: "Curso gravado - 8 módulos com estudos de caso reais",
    price: 897,
    oldPrice: 1190,
    formato: "Vídeo - 11h + material de apoio",
    nivel: "Avançado",
    resumo:
      "O método FITE completo em aula: diagnóstico, quantificação, intervenção e gestão, com casos de indústria, corporativo e retorno ao trabalho.",
    inclui: [
      "Acesso por 12 meses",
      "Todos os checklists e planilhas do catálogo inclusos",
      "Certificado de conclusão",
    ],
  },
  {
    id: "fite-12",
    codigo: "FITE 12",
    cat: "TREINAMENTO",
    tone: 3,
    title: "Mentoria em saúde do trabalhador",
    subtitle: "Acompanhamento individual - 6 encontros",
    price: 2490,
    formato: "Online ao vivo - 6 sessões de 1h",
    nivel: "Profissional",
    resumo:
      "Para fisioterapeutas e profissionais de SST que querem atuar de forma consultiva: posicionamento técnico, precificação, condução de projeto e relação com a liderança.",
    inclui: [
      "6 encontros individuais com Helmar Aquino",
      "Revisão dos seus relatórios e propostas",
      "Suporte por mensagem entre os encontros",
    ],
  },
];
