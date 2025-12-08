import type { Contact, Chat } from './types';

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    phone: '+1-202-555-0143',
    status: 'Ativo',
    avatar: 'avatar-1',
    categories: ['VIP', 'Lead'],
    interests: ['Desenvolvimento de IA', 'UX/UI Design'],
    notes: 'Conheci na TechCon 2023. Interessada em nosso plano empresarial.',
  },
  {
    id: 'contact-2',
    name: 'Marcus Chen',
    email: 'marcus.c@example.com',
    phone: '+1-202-555-0187',
    status: 'Novo',
    avatar: 'avatar-2',
    categories: ['Nova Consulta'],
    interests: ['Ciência de Dados', 'Computação em Nuvem'],
    notes: 'Entrou em contato pelo formulário de contato. Precisa de acompanhamento.',
  },
  {
    id: 'contact-3',
    name: 'Aisha Khan',
    email: 'aisha.k@example.com',
    phone: '+1-202-555-0121',
    status: 'Ativo',
    avatar: 'avatar-3',
    categories: ['Parceiro'],
    interests: ['DevOps', 'Cibersegurança'],
    notes: 'Contato técnico em uma empresa parceira. Muito experiente.',
  },
  {
    id: 'contact-4',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1-202-555-0199',
    status: 'Bloqueado',
    avatar: 'avatar-4',
    categories: ['Spam'],
    interests: [],
    notes: 'Marcado como spam após mensagens não solicitadas.',
  },
  {
    id: 'contact-5',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    phone: '+1-202-555-0156',
    status: 'Ativo',
    avatar: 'avatar-5',
    categories: ['Cliente'],
    interests: ['Desenvolvimento Web', 'React'],
    notes: 'Cliente de longa data, renovação em 2 meses.',
  },
   {
    id: 'contact-6',
    name: 'Ben Carter',
    email: 'ben.c@example.com',
    phone: '+1-202-555-0178',
    status: 'Novo',
    avatar: 'avatar-6',
    categories: ['Nova Consulta'],
    interests: ['Desenvolvimento Mobile'],
    notes: 'Baixou nosso whitepaper sobre tendências mobile.',
  },
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    contact: mockContacts[0],
    messages: [
      { id: 1, name: 'Elena Rodriguez', avatar: 'avatar-1', message: "Olá! Gostaria de saber se podem me dar mais detalhes sobre as funcionalidades do plano empresarial." },
      { id: 2, name: 'Atendente', avatar: 'avatar-1', message: 'Claro, Elena! Nosso plano empresarial inclui segurança avançada, suporte dedicado e acesso ilimitado à API. Há alguma funcionalidade específica que te interessa?' },
      { id: 3, name: 'Elena Rodriguez', avatar: 'avatar-1', message: "O suporte dedicado parece ótimo. Qual é o tempo de resposta típico?" },
    ],
  },
  {
    id: 'chat-2',
    contact: mockContacts[1],
    messages: [
      { id: 1, name: 'Marcus Chen', avatar: 'avatar-2', message: 'Oi, acabei de preencher um formulário no site de vocês. Tenho algumas perguntas sobre as ferramentas de ciência de dados.' },
    ],
  },
  {
    id: 'chat-3',
    contact: mockContacts[2],
    messages: [
      { id: 1, name: 'Aisha Khan', avatar: 'avatar-3', message: "Olá equipe, dando seguimento à nossa discussão da semana passada sobre a integração da API. Alguma atualização?" },
      { id: 2, name: 'Atendente', avatar: 'avatar-1', message: 'Olá Aisha, sim! A equipe de engenharia publicou a documentação mais recente. Posso te enviar o link.' },
    ],
  },
   {
    id: 'chat-5',
    contact: mockContacts[4],
    messages: [
      { id: 1, name: 'Olivia Martinez', avatar: 'avatar-5', message: 'Minha assinatura será renovada em breve. Podemos discutir os novos preços?' },
      { id: 2, name: 'Atendente', avatar: 'avatar-1', message: "Com certeza, Olivia. Temos algumas novas opções que acho que você vai gostar. Estou olhando sua conta agora." },
    ],
  },
  {
    id: 'chat-6',
    contact: mockContacts[5],
    messages: [
        { id: 1, name: 'Ben Carter', avatar: 'avatar-6', message: 'Li o whitepaper de vocês e achei muito esclarecedor. Gostaria de uma demonstração do produto.' },
    ]
  }
];
