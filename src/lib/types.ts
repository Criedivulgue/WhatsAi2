export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Novo' | 'Bloqueado';
  avatar: string;
  categories: string[];
  interests: string[];
  notes: string;
};

export type Message = {
  id: number;
  name: string;
  avatar: string;
  message: string;
};

export type Chat = {
  id: string;
  contact: Contact;
  messages: Message[];
};

export type ProfileEnrichments = {
  suggestedInterests: string[];
  adjustedCategories: string[];
  opportunityInsights: string;
  internalNotes: string;
}

export type FollowUpSuggestions = {
  emailDraft: string;
  whatsAppMessage: string;
  followUpRecommendation: string;
  calendarEventSuggestion: string;
}
