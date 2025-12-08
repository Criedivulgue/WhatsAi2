'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an initial AI greeting for new clients in the PWA chat.
 *
 * @exports generateInitialGreeting - An asynchronous function that generates the initial greeting.
 * @exports GenerateInitialGreetingInput - The input type for the generateInitialGreeting function.
 * @exports GenerateInitialGreetingOutput - The output type for the generateInitialGreeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialGreetingInputSchema = z.object({
  clientPhoneNumber: z
    .string()
    .describe('The phone number of the client entering the PWA chat.'),
});

export type GenerateInitialGreetingInput = z.infer<
  typeof GenerateInitialGreetingInputSchema
>;

const GenerateInitialGreetingOutputSchema = z.object({
  greeting: z.string().describe('The AI-generated initial greeting message.'),
});

export type GenerateInitialGreetingOutput = z.infer<
  typeof GenerateInitialGreetingOutputSchema
>;

export async function generateInitialGreeting(
  input: GenerateInitialGreetingInput
): Promise<GenerateInitialGreetingOutput> {
  return generateInitialGreetingFlow(input);
}

const initialGreetingPrompt = ai.definePrompt({
  name: 'initialGreetingPrompt',
  input: {schema: GenerateInitialGreetingInputSchema},
  output: {schema: GenerateInitialGreetingOutputSchema},
  prompt: `You are an AI assistant welcoming a new client to a chat application.

  The client's phone number is {{{clientPhoneNumber}}}.

  Generate a brief and friendly greeting message explaining how to interact with the chat system.  Keep the greeting concise, under 50 words.
  Be conversational and helpful.
  Indicate you are an AI assistant.`,
});

const generateInitialGreetingFlow = ai.defineFlow(
  {
    name: 'generateInitialGreetingFlow',
    inputSchema: GenerateInitialGreetingInputSchema,
    outputSchema: GenerateInitialGreetingOutputSchema,
  },
  async input => {
    const {output} = await initialGreetingPrompt(input);
    return output!;
  }
);
