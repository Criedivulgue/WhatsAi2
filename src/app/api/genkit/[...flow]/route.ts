'use server';

/**
 * @fileoverview This file is an API route that exposes Genkit flows as API
 * endpoints.
 *
 * This is the entry point for all Genkit flow API requests.
 */

import {ai} from '@/ai/genkit';
import {run} from 'genkit';

export async function POST(
  req: Request,
  {params}: {params: {flow: string[]}}
) {
  const flowId = params.flow.join('/');
  const input = await req.json();

  const response = await run(flowId, input);

  return new Response(JSON.stringify(response), {
    headers: {'Content-Type': 'application/json'},
  });
}
