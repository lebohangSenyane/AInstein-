'use server';

/**
 * @fileOverview A flow that accepts an image and an optional question, and returns an answer to the question based on the image.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diagram or concept, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().optional().describe('The question to be answered about the image.'),
});
export type AnalyzeImageInput = z.infer<
  typeof AnalyzeImageInputSchema
>;

const AnalyzeImageOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the image.'),
});
export type AnalyzeImageOutput = z.infer<
  typeof AnalyzeImageOutputSchema
>;

export async function analyzeImage(
  input: AnalyzeImageInput
): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert AI assistant that analyzes images.

You will be given an image and an optional question about the image.
If a question is provided, answer the question based on the content of the image.
If no question is provided, describe the image in detail.

Image: {{media url=photoDataUri}}
{{#if question}}Question: {{{question}}}{{/if}}`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
