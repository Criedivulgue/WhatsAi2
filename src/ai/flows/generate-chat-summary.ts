'use server';

/**
 * @fileOverview Um fluxo para gerar um resumo estruturado de uma conversa de chat.
 *
 * - generateChatSummary - Uma função que gera o resumo do chat.
 * - GenerateChatSummaryInput - O tipo de entrada para a função generateChatSummary.
 * - GenerateChatSummaryOutput - O tipo de retorno para a função generateChatSummary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatSummaryInputSchema = z.object({
  conversationText: z
    .string()
    .describe('O texto completo da conversa do chat a ser resumido.'),
});
export type GenerateChatSummaryInput = z.infer<typeof GenerateChatSummaryInputSchema>;

const GenerateChatSummaryOutputSchema = z.object({
  summary: z.string().describe('Um resumo estruturado da conversa do chat.'),
  actionItems: z.array(z.string()).describe('Uma lista de itens de ação extraídos da conversa.'),
});
export type GenerateChatSummaryOutput = z.infer<typeof GenerateChatSummaryOutputSchema>;

export async function generateChatSummary(input: GenerateChatSummaryInput): Promise<GenerateChatSummaryOutput> {
  return generateChatSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatSummaryPrompt',
  input: {schema: GenerateChatSummaryInputSchema},
  output: {schema: GenerateChatSummaryOutputSchema},
  prompt: `Você é um assistente de IA encarregado de resumir conversas de chat e extrair itens de ação.

  Resuma a seguinte conversa:
  {{conversationText}}

  Forneça um resumo estruturado da conversa, incluindo pontos-chave e decisões tomadas. Além disso, extraia uma lista de itens de ação que precisam ser concluídos. Retorne o resumo e os itens de ação no formato especificado pelo esquema de saída. O campo actionItems deve ser uma lista de strings.
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
