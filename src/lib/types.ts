import type { Timestamp } from 'firebase/firestore';

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
  id?: string; // Firestore will generate this
  sender: string; // 'user' (contact) or 'attendant' or 'ai'
  content: string;
  timestamp: Timestamp;
  avatar?: string;
  senderId: string;
};

export type Chat = {
  id: string;
  contactId: string;
  brandId: string;
  attendantId?: string;
  status: 'Active' | 'Awaiting Return' | 'Closed' | 'Archived' | 'AI-Assisted';
  lastMessageTimestamp: Timestamp;
  lastMessageContent?: string;
  // For UI convenience, we might join the contact details
  contact?: Contact;
  // This will be populated after fetching from Firestore
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
