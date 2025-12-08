'use server';

/**
 * @fileOverview A flow that summarizes study materials.
 *
 * - summarizeStudyMaterials - A function that handles the summarization of study materials.
 * - SummarizeStudyMaterialsInput - The input type for the summarizeStudyMaterials function.
 * - SummarizeStudyMaterialsOutput - The return type for the summarizeStudyMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudyMaterialsInputSchema = z.object({
  studyMaterials: z
    .string()
    .describe("The study materials to summarize. This should be a large chunk of text."),
});
export type SummarizeStudyMaterialsInput = z.infer<typeof SummarizeStudyMaterialsInputSchema>;

const SummarizeStudyMaterialsOutputSchema = z.object({
  summary: z
    .string()
    .describe("The concise summary of the study materials."),
});
export type SummarizeStudyMaterialsOutput = z.infer<typeof SummarizeStudyMaterialsOutputSchema>;

export async function summarizeStudyMaterials(input: SummarizeStudyMaterialsInput): Promise<SummarizeStudyMaterialsOutput> {
  return summarizeStudyMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStudyMaterialsPrompt',
  input: {schema: SummarizeStudyMaterialsInputSchema},
  output: {schema: SummarizeStudyMaterialsOutputSchema},
  prompt: `You are an expert summarizer, skilled at condensing large amounts of text into concise, easy-to-understand summaries.

  Please summarize the following study materials:

  {{{studyMaterials}}}
  `,
});

const summarizeStudyMaterialsFlow = ai.defineFlow(
  {
    name: 'summarizeStudyMaterialsFlow',
    inputSchema: SummarizeStudyMaterialsInputSchema,
    outputSchema: SummarizeStudyMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
