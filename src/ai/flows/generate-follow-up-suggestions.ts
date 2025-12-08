// src/ai/flows/generate-follow-up-suggestions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized follow-up suggestions, including email drafts,
 * WhatsApp messages, follow-up recommendations, and pre-created events for Google Calendar. It aims to streamline the
 * user's follow-up process by providing AI-driven suggestions tailored to the specific contact and conversation.
 *
 * - generateFollowUpSuggestions - The main function that orchestrates the generation of follow-up suggestions.
 * - GenerateFollowUpSuggestionsInput - The input type for the generateFollowUpSuggestions function.
 * - GenerateFollowUpSuggestionsOutput - The output type for the generateFollowUpSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpSuggestionsInputSchema = z.object({
  contactName: z.string().describe('The name of the contact to follow up with.'),
  conversationSummary: z.string().describe('A summary of the previous conversation with the contact.'),
  brandInformation: z.string().describe('Information about the user\u2019s brand, tone, and rules.'),
});
export type GenerateFollowUpSuggestionsInput = z.infer<typeof GenerateFollowUpSuggestionsInputSchema>;

const GenerateFollowUpSuggestionsOutputSchema = z.object({
  emailDraft: z.string().describe('A draft email for following up with the contact.'),
  whatsAppMessage: z.string().describe('A suggested WhatsApp message for following up with the contact.'),
  followUpRecommendation: z.string().describe('A recommendation for the next steps to take with the contact.'),
  calendarEventSuggestion: z.string().describe('A suggestion for a pre-created event for Google Calendar, including date, time, and agenda.'),
});
export type GenerateFollowUpSuggestionsOutput = z.infer<typeof GenerateFollowUpSuggestionsOutputSchema>;

export async function generateFollowUpSuggestions(
  input: GenerateFollowUpSuggestionsInput
): Promise<GenerateFollowUpSuggestionsOutput> {
  return generateFollowUpSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpSuggestionsPrompt',
  input: {schema: GenerateFollowUpSuggestionsInputSchema},
  output: {schema: GenerateFollowUpSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping users to streamline their follow-up process with contacts.

  Based on the contact's name, a summary of the previous conversation, and the brand's information, generate personalized follow-up suggestions.

  Contact Name: {{{contactName}}}
  Conversation Summary: {{{conversationSummary}}}
  Brand Information: {{{brandInformation}}}

  Consider the brand’s tone and rules when crafting the email draft and WhatsApp message. Provide a clear and concise follow-up recommendation.
  Suggest a pre-created event for Google Calendar, including date, time, and agenda, to facilitate the follow-up process.

  Ensure that the suggestions are tailored to the contact and the conversation, and that they align with the brand's guidelines.

  Output in JSON format:
  {
    "emailDraft": "",
    "whatsAppMessage": "",
    "followUpRecommendation": "",
    "calendarEventSuggestion": ""
  }`,
});

const generateFollowUpSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpSuggestionsFlow',
    inputSchema: GenerateFollowUpSuggestionsInputSchema,
    outputSchema: GenerateFollowUpSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
