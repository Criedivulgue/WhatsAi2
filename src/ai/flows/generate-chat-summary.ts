'use server';

/**
 * @fileOverview A flow to generate a structured summary of a chat conversation.
 *
 * - generateChatSummary - A function that generates the chat summary.
 * - GenerateChatSummaryInput - The input type for the generateChatSummary function.
 * - GenerateChatSummaryOutput - The return type for the generateChatSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatSummaryInputSchema = z.object({
  conversationText: z
    .string()
    .describe('The complete text of the chat conversation to summarize.'),
});
export type GenerateChatSummaryInput = z.infer<typeof GenerateChatSummaryInputSchema>;

const GenerateChatSummaryOutputSchema = z.object({
  summary: z.string().describe('A structured summary of the chat conversation.'),
  actionItems: z.array(z.string()).describe('A list of action items extracted from the conversation.'),
});
export type GenerateChatSummaryOutput = z.infer<typeof GenerateChatSummaryOutputSchema>;

export async function generateChatSummary(input: GenerateChatSummaryInput): Promise<GenerateChatSummaryOutput> {
  return generateChatSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatSummaryPrompt',
  input: {schema: GenerateChatSummaryInputSchema},
  output: {schema: GenerateChatSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing chat conversations and extracting action items.

  Summarize the following conversation:
  {{conversationText}}

  Provide a structured summary of the conversation, including key points and decisions made.  Also, extract a list of action items that need to be completed.  Return the summary and action items in the format specified by the output schema.  The actionItems field should be a list of strings.
  `,
});

const generateChatSummaryFlow = ai.defineFlow(
  {
    name: 'generateChatSummaryFlow',
    inputSchema: GenerateChatSummaryInputSchema,
    outputSchema: GenerateChatSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
