'use server';

/**
 * @fileOverview A question answering AI agent that uses RAG to retrieve relevant information and provide accurate answers.
 *
 * - answerQuestionsWithContext - A function that handles the question answering process.
 * - AnswerQuestionsWithContextInput - The input type for the answerQuestionsWithContext function.
 * - AnswerQuestionsWithContextOutput - The return type for the answerQuestionsWithContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsWithContextInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  context: z.string().describe('The context or study material to answer the question from.'),
});
export type AnswerQuestionsWithContextInput = z.infer<typeof AnswerQuestionsWithContextInputSchema>;

const AnswerQuestionsWithContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsWithContextOutput = z.infer<typeof AnswerQuestionsWithContextOutputSchema>;

export async function answerQuestionsWithContext(input: AnswerQuestionsWithContextInput): Promise<AnswerQuestionsWithContextOutput> {
  return answerQuestionsWithContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsWithContextPrompt',
  input: {schema: AnswerQuestionsWithContextInputSchema},
  output: {schema: AnswerQuestionsWithContextOutputSchema},
  prompt: `You are an AI study assistant named AInstein. Your task is to answer questions based on the provided context.

Context: {{{context}}}

Question: {{{question}}}

Answer: `,
});

const answerQuestionsWithContextFlow = ai.defineFlow(
  {
    name: 'answerQuestionsWithContextFlow',
    inputSchema: AnswerQuestionsWithContextInputSchema,
    outputSchema: AnswerQuestionsWithContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
