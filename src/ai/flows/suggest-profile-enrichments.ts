'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para sugerir enriquecimentos de perfil com base no conteúdo do chat.
 *
 * O fluxo analisa o conteúdo do chat para sugerir novos interesses, categorias de contato ajustadas,
 * insights de oportunidade e notas internas para enriquecer os perfis de contato.
 *
 * @exports suggestProfileEnrichments - A função principal para acionar o fluxo de sugestão de enriquecimento de perfil.
 * @exports SuggestProfileEnrichmentsInput - O tipo de entrada para a função suggestProfileEnrichments.
 * @exports SuggestProfileEnrichmentsOutput - O tipo de saída para a função suggestProfileEnrichments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileEnrichmentsInputSchema = z.object({
  chatContent: z
    .string()
    .describe('O conteúdo da conversa do chat a ser analisado.'),
  currentInterests: z.array(z.string()).optional().describe('Os interesses atuais do contato.'),
  currentCategories: z.array(z.string()).optional().describe('As categorias atuais do contato.'),
  existingNotes: z.string().optional().describe('Quaisquer notas internas existentes sobre o contato.'),
});
export type SuggestProfileEnrichmentsInput = z.infer<
  typeof SuggestProfileEnrichmentsInputSchema
>;

const SuggestProfileEnrichmentsOutputSchema = z.object({
  suggestedInterests: z
    .array(z.string())
    .describe('Novos interesses sugeridos para o contato.'),
  adjustedCategories: z
    .array(z.string())
    .describe('Ajustes sugeridos para as categorias do contato.'),
  opportunityInsights: z
    .string()
    .describe('Insights sobre oportunidades potenciais relacionadas ao contato.'),
  internalNotes: z.string().describe('Notas internas sugeridas sobre o contato.'),
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
  prompt: `Você é um assistente de IA que analisa o conteúdo do chat para sugerir enriquecimentos para perfis de contato.

  Com base no seguinte conteúdo do chat, sugira novos interesses, categorias de contato ajustadas, insights de oportunidade e notas internas.

  Conteúdo do Chat: {{{chatContent}}}

  Interesses Atuais: {{#if currentInterests}}{{#each currentInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Nenhum{{/if}}
  Categorias Atuais: {{#if currentCategories}}{{#each currentCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Nenhuma{{/if}}
  Anotações Existentes: {{{existingNotes}}}

  Considere os interesses, categorias e anotações existentes do contato ao fazer sugestões.
  Forneça sugestões claras e concisas que possam ser facilmente implementadas pelo usuário.
  Formate a saída como um objeto JSON com as seguintes chaves: suggestedInterests, adjustedCategories, opportunityInsights e internalNotes.
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
