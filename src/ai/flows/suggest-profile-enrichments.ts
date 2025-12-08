'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting profile enrichments based on chat content.
 *
 * The flow analyzes chat content to suggest new interests, adjusted contact categories,
 * opportunity insights, and internal notes to enrich contact profiles.
 *
 * @exports suggestProfileEnrichments - The main function to trigger the profile enrichment suggestion flow.
 * @exports SuggestProfileEnrichmentsInput - The input type for the suggestProfileEnrichments function.
 * @exports SuggestProfileEnrichmentsOutput - The output type for the suggestProfileEnrichments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileEnrichmentsInputSchema = z.object({
  chatContent: z
    .string()
    .describe('The content of the chat conversation to analyze.'),
  currentInterests: z.array(z.string()).optional().describe('The contact\'s current interests.'),
  currentCategories: z.array(z.string()).optional().describe('The contact\'s current categories.'),
  existingNotes: z.string().optional().describe('Any existing internal notes about the contact.'),
});
export type SuggestProfileEnrichmentsInput = z.infer<
  typeof SuggestProfileEnrichmentsInputSchema
>;

const SuggestProfileEnrichmentsOutputSchema = z.object({
  suggestedInterests: z
    .array(z.string())
    .describe('Suggested new interests for the contact.'),
  adjustedCategories: z
    .array(z.string())
    .describe('Suggested adjustments to the contact\'s categories.'),
  opportunityInsights: z
    .string()
    .describe('Insights into potential opportunities related to the contact.'),
  internalNotes: z.string().describe('Suggested internal notes about the contact.'),
});
export type SuggestProfileEnrichmentsOutput = z.infer<
  typeof SuggestProfileEnrichmentsOutputSchema
>;

export async function suggestProfileEnrichments(
  input: SuggestProfileEnrichmentsInput
): Promise<SuggestProfileEnrichmentsOutput> {
  return suggestProfileEnrichmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileEnrichmentsPrompt',
  input: {schema: SuggestProfileEnrichmentsInputSchema},
  output: {schema: SuggestProfileEnrichmentsOutputSchema},
  prompt: `You are an AI assistant that analyzes chat content to suggest enrichments for contact profiles.

  Based on the following chat content, suggest new interests, adjusted contact categories, opportunity insights, and internal notes.

  Chat Content: {{{chatContent}}}

  Current Interests: {{#if currentInterests}}{{#each currentInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
  Current Categories: {{#if currentCategories}}{{#each currentCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
  Existing Notes: {{{existingNotes}}}

  Consider the contact's current interests, categories, and existing notes when making suggestions.
  Provide clear and concise suggestions that can be easily implemented by the user.
  Format the output as a JSON object with the following keys: suggestedInterests, adjustedCategories, opportunityInsights, and internalNotes.
  `,
});

const suggestProfileEnrichmentsFlow = ai.defineFlow(
  {
    name: 'suggestProfileEnrichmentsFlow',
    inputSchema: SuggestProfileEnrichmentsInputSchema,
    outputSchema: SuggestProfileEnrichmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
