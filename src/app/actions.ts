
'use server';

import { generateChatSummary } from '@/ai/flows/generate-chat-summary';
import { generateFollowUpSuggestions } from '@/ai/flows/generate-follow-up-suggestions';
import { generateInitialGreeting } from '@/ai/flows/generate-initial-greeting';
import { suggestProfileEnrichments } from '@/ai/flows/suggest-profile-enrichments';
import { type Chat } from '@/lib/types';


export async function getInitialGreetingAction(clientPhoneNumber: string) {
    return await generateInitialGreeting({ clientPhoneNumber });
}

export async function getChatSummaryAction(conversationText: string) {
    return await generateChatSummary({ conversationText });
}

export async function getProfileEnrichmentsAction(chat: Chat) {
    const chatContent = chat.messages.map(m => `${m.name}: ${m.message}`).join('\n');
    return await suggestProfileEnrichments({
        chatContent,
        currentInterests: chat.contact.interests,
        currentCategories: chat.contact.categories,
        existingNotes: chat.contact.notes,
    });
}

export async function getFollowUpSuggestionsAction(chat: Chat, brandInformation: string) {
    const conversationSummary = chat.messages.slice(-5).map(m => `${m.name}: ${m.message}`).join('\n');
    return await generateFollowUpSuggestions({
        contactName: chat.contact.name,
        conversationSummary,
        brandInformation
    });
}
