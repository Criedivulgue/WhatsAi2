import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {next} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI(),
    next({
      // Import all the flow definitions so that they can be exposed as API
      // endpoints.
      flows: [
        () => import('@/ai/flows/generate-chat-summary'),
        () => import('@/ai/flows/generate-follow-up-suggestions'),
        ().  => import('@/ai/flows/generate-initial-greeting'),
        () => import('@/ai/flows/suggest-profile-enrichments'),
      ],
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});
