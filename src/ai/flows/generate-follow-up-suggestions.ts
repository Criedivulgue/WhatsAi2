// src/ai/flows/generate-follow-up-suggestions.ts
'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar sugestões de acompanhamento personalizadas, incluindo rascunhos de e-mail,
 * mensagens de WhatsApp, recomendações de acompanhamento e eventos pré-criados para o Google Calendar. O objetivo é otimizar o processo
 * de acompanhamento do usuário, fornecendo sugestões orientadas por IA, adaptadas ao contato e à conversa específicos.
 *
 * - generateFollowUpSuggestions - A função principal que orquestra a geração de sugestões de acompanhamento.
 * - GenerateFollowUpSuggestionsInput - O tipo de entrada para a função generateFollowUpSuggestions.
 * - GenerateFollowUpSuggestionsOutput - O tipo de saída para a função generateFollowUpSuggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpSuggestionsInputSchema = z.object({
  contactName: z.string().describe('O nome do contato para acompanhamento.'),
  conversationSummary: z.string().describe('Um resumo da conversa anterior com o contato.'),
  brandInformation: z.string().describe('Informações sobre a marca, tom, regras e base de conhecimento.'),
});
export type GenerateFollowUpSuggestionsInput = z.infer<typeof GenerateFollowUpSuggestionsInputSchema>;

const GenerateFollowUpSuggestionsOutputSchema = z.object({
  emailDraft: z.string().describe('Um rascunho de e-mail para acompanhamento com o contato.'),
  whatsAppMessage: z.string().describe('Uma mensagem de WhatsApp sugerida para acompanhamento com o contato.'),
  followUpRecommendation: z.string().describe('Uma recomendação para os próximos passos a serem tomados com o contato.'),
  calendarEventSuggestion: z.string().describe('Uma sugestão de evento pré-criado para o Google Calendar, incluindo data, hora e pauta.'),
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
  prompt: `Você é um assistente de IA que ajuda os usuários a otimizar o processo de acompanhamento com os contatos.

  Com base no nome do contato, um resumo da conversa anterior e as informações da marca, gere sugestões de acompanhamento personalizadas.

  Nome do Contato: {{{contactName}}}
  Resumo da Conversa: {{{conversationSummary}}}
  Informações da Marca (incluindo Tom, Regras e Base de Conhecimento): {{{brandInformation}}}

  Use a base de conhecimento fornecida nas informações da marca para responder a quaisquer perguntas factuais que possam ter surgido.
  Considere o tom e as regras da marca ao redigir o rascunho do e-mail e a mensagem do WhatsApp. Forneça uma recomendação de acompanhamento clara e concisa.
  Sugira um evento pré-criado para o Google Calendar, incluindo data, hora e pauta, para facilitar o processo de acompanhamento.

  Garanta que as sugestões sejam adaptadas ao contato e à conversa e que estejam alinhadas com as diretrizes da marca.

  Saída em formato JSON:
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
