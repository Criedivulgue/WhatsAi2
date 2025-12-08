import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-profile-enrichments.ts';
import '@/ai/flows/generate-chat-summary.ts';
import '@/ai/flows/generate-follow-up-suggestions.ts';
import '@/ai/flows/generate-initial-greeting.ts';