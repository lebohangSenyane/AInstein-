'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an initial study plan based on a user-provided prompt.
 *
 * - generateInitialStudyPlan - A function that takes a prompt and returns a study plan.
 * - GenerateInitialStudyPlanInput - The input type for the generateInitialStudyPlan function.
 * - GenerateInitialStudyPlanOutput - The return type for the generateInitialStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialStudyPlanInputSchema = z.object({
  prompt: z.string().describe('A description of the course and learning goals.'),
});
export type GenerateInitialStudyPlanInput = z.infer<typeof GenerateInitialStudyPlanInputSchema>;

const GenerateInitialStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('An initial study plan outline.'),
});
export type GenerateInitialStudyPlanOutput = z.infer<typeof GenerateInitialStudyPlanOutputSchema>;

export async function generateInitialStudyPlan(
  input: GenerateInitialStudyPlanInput
): Promise<GenerateInitialStudyPlanOutput> {
  return generateInitialStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialStudyPlanPrompt',
  input: {schema: GenerateInitialStudyPlanInputSchema},
  output: {schema: GenerateInitialStudyPlanOutputSchema},
  prompt: `You are an expert study plan generator. Based on the course description and learning goals provided, generate an initial study plan outline.

Course Description and Learning Goals: {{{prompt}}}`,
});

const generateInitialStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateInitialStudyPlanFlow',
    inputSchema: GenerateInitialStudyPlanInputSchema,
    outputSchema: GenerateInitialStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
