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
    .describe('O número de telefone do cliente que entra no chat do PWA.'),
});

export type GenerateInitialGreetingInput = z.infer<
  typeof GenerateInitialGreetingInputSchema
>;

const GenerateInitialGreetingOutputSchema = z.object({
  greeting: z.string().describe('A mensagem de saudação inicial gerada pela IA.'),
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
  prompt: `Você é um assistente de IA dando as boas-vindas a um novo cliente em um aplicativo de chat.

  O número de telefone do cliente é {{{clientPhoneNumber}}}.

  Gere uma mensagem de saudação breve e amigável explicando como interagir com o sistema de chat. Mantenha a saudação concisa, com menos de 50 palavras.
  Seja conversacional e prestativo.
  Indique que você é um assistente de IA.`,
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
