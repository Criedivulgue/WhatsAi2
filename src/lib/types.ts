
import type { Timestamp } from 'firebase/firestore';

// ==================================================================
// NEW, CORRECTED & SEPARATED TYPES
// This aligns with the architecture defined in converters.ts
// ==================================================================

/**
 * Represents the core user data, stored in `/users/{uid}`.
 * This document links to the user's brand.
 */
export type User = {
  id: string; // Firebase Auth UID
  brandId: string; // The ID of the brand document in the /brands collection
  avatarUrl: string;
  publicName: string; // The public-facing name for the brand/attendant
  attendantPersona?: string; // Specific persona for this user as an attendant
};

/**
 * Represents the brand's identity, stored in `/brands/{brandId}`.
 * This contains the shared information for a brand.
 */
export type Brand = {
  id: string;
  brandName: string;
  slogan?: string;
  city?: string;
  state?: string;
  whatsappNumber?: string;
  brandTone?: string;
  knowledgeBase?: string;
  hardRules?: string;
  softRules?: string;
  aiConfig?: {
    autoSummarize: boolean;
    autoEnrich: boolean;
    autoFollowUp: boolean;
  };
};


// ==================================================================
// DEPRECATED & LEGACY TYPES
// ==================================================================

/**
 * @deprecated Use `User` and `Brand` types instead.
 * Represents the complete User Profile stored in Firestore under /users/{userId}
 */
export type UserProfile = {
  id: string; // This will be the UID from Firebase Auth
  email: string;
  publicName: string; // The public-facing name for the brand/attendant
  slogan?: string;
  avatarUrl: string;
  city: string;
  state: string;
  whatsappNumber: string;
  attendantPersona?: string; 
  brandTone?: string; 
  knowledgeBase?: string; 
  hardRules?: string; 
  softRules?: string; 
  aiConfig?: {
    autoSummarize: boolean;
    autoEnrich: boolean;
    autoFollowUp: boolean;
  };
  createdAt: Timestamp;
}

export type UserProfileData = Pick<
  UserProfile,
  | 'publicName'
  | 'slogan'
  | 'avatarUrl'
  | 'city'
  | 'state'
  | 'whatsappNumber'
>;

// ==================================================================
// OTHER EXISTING TYPES (CORRECTED)
// ==================================================================

export type Contact = {
  id: string;
  brandId: string; // The ID of the brand this contact belongs to
  name: string;
  email?: string;
  phone: string;
  contactType: 'Lead' | 'Prospect' | 'Client' | 'VIP' | 'Past Client';
  avatar?: string;
  categories?: string[];
  interests?: string[];
  notes?: string;
};

export type Message = {
  id?: string; 
  sender: 'user' | 'attendant' | 'ai';
  content: string;
  timestamp: Timestamp;
  avatar?: string;
  senderId: string;
};

export type Chat = {
  id: string;
  brandId: string; // The ID of the brand this chat belongs to
  contactId: string;
  attendantId: string; // The ID of the user attendant assigned to this chat
  status: 'Active' | 'Awaiting Return' | 'Closed' | 'Archived' | 'AI-Assisted';
  lastMessageTimestamp: Timestamp;
  lastMessageContent?: string;
  contact?: Contact;
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
