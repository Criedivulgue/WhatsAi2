// This file is now deprecated for mock data, but we'll keep it for reference or future testing needs.
// The application now fetches live data from Firestore.

import type { Contact, Chat } from './types';
import { Timestamp } from 'firebase/firestore';

// Note: This data is no longer actively used in the contacts page.
export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    brandId: 'brand-1',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    phone: '+1-202-555-0143',
    contactType: 'Prospect',
    avatar: 'avatar-1',
    categories: ['VIP', 'Lead'],
    interests: ['Desenvolvimento de IA', 'UX/UI Design'],
    notes: 'Conheci na TechCon 2023. Interessada em nosso plano empresarial.',
  },
  // Other mock contacts...
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    contactId: 'contact-1',
    brandId: 'brand-1',
    status: 'Active',
    lastMessageTimestamp: Timestamp.now(),
    contact: mockContacts[0],
    messages: [
      { id: '1', sender: 'user', senderId: 'contact-1', avatar: 'avatar-1', content: "Olá! Gostaria de saber se podem me dar mais detalhes sobre as funcionalidades do plano empresarial.", timestamp: Timestamp.fromMillis(Date.now() - 1000 * 60 * 5) },
      { id: '2', sender: 'attendant', senderId: 'attendant-1', avatar: 'avatar-1', content: 'Claro, Elena! Nosso plano empresarial inclui segurança avançada, suporte dedicado e acesso ilimitado à API. Há alguma funcionalidade específica que te interessa?', timestamp: Timestamp.fromMillis(Date.now() - 1000 * 60 * 4) },
      { id: '3', sender: 'user', senderId: 'contact-1', avatar: 'avatar-1', content: "O suporte dedicado parece ótimo. Qual é o tempo de resposta típico?", timestamp: Timestamp.fromMillis(Date.now() - 1000 * 60 * 3) },
    ],
  },
  // Other mock chats...
];
