
'use server';

import { generateChatSummary } from '@/ai/flows/generate-chat-summary';
import { generateFollowUpSuggestions } from '@/ai/flows/generate-follow-up-suggestions';
import { generateInitialGreeting } from '@/ai/flows/generate-initial-greeting';
import { suggestProfileEnrichments } from '@/ai/flows/suggest-profile-enrichments';
import type { Chat } from '@/lib/types';


export async function getInitialGreetingAction(clientPhoneNumber: string) {
    // TODO: Inject Brand Context here
    return await generateInitialGreeting({ clientPhoneNumber });
}

export async function getChatSummaryAction(conversationText: string) {
    return await generateChatSummary({ conversationText });
}

export async function getProfileEnrichmentsAction(chat: Chat) {
    if (!chat.contact) {
        throw new Error("Dados do contato não encontrados no chat.");
    }
    // In a real scenario, you'd fetch the full message history
    const chatContent = chat.messages.map(m => `${m.sender}: ${m.content}`).join('\n');
    return await suggestProfileEnrichments({
        chatContent,
        currentInterests: chat.contact.interests,
        currentCategories: chat.contact.categories,
        existingNotes: chat.contact.notes,
    });
}

export async function getFollowUpSuggestionsAction(chat: Chat, brandInformation: string) {
    if (!chat.contact) {
        throw new Error("Dados do contato não encontrados no chat.");
    }
    // A summary might be better here in a real scenario
    const conversationSummary = chat.messages.slice(-10).map(m => `${m.sender}: ${m.content}`).join('\n');
    return await generateFollowUpSuggestions({
        contactName: chat.contact.name,
        conversationSummary,
        brandInformation
    });
}
