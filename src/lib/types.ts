export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactType: 'Lead' | 'Prospect' | 'Client' | 'VIP' | 'Past Client';
  avatar: string;
  categories: string[];
  interests: string[];
  notes: string;
  brandId: string;
};

export type Message = {
  id: number;
  sender: string; // 'user' (contact) or 'attendant'
  content: string;
  timestamp: Date;
  avatar: string; // Keep if you want to show avatars per message
};

export type Chat = {
  id: string;
  contactId: string;
  brandId: string;
  attendantId?: string; // Can be optional initially
  status: 'Active' | 'Awaiting Return' | 'Closed' | 'Archived' | 'AI-Assisted';
  lastMessageTimestamp: Date;
  messages: Message[];
  // For UI convenience, we might join the contact details
  contact?: Contact;
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

// Type for the onboarding form data
export type OnboardingData = {
  brandName: string;
  brandTone: string;
  hardRules?: string;
  softRules?: string;
  attendantName: string;
  attendantEmail: string;
  password?: string;
  autoSummarize: boolean;
  autoEnrich: boolean;
  autoFollowUp: boolean;
};
