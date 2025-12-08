'use server';

/**
 * @fileOverview A flow that provides real-time voice interaction for tutoring.
 * It takes a user's question, finds an answer, and converts the answer to speech.
 *
 * - liveTutor - A function that handles the live tutoring process.
 * - LiveTutorInput - The input type for the liveTutor function.
 * - LiveTutorOutput - The return type for the liveTutor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { answerQuestionsWithContext } from './answer-questions-with-context';
import { textToSpeech } from './text-to-speech-accessibility';

const LiveTutorInputSchema = z.object({
  question: z.string().describe("The user's spoken question."),
  context: z.string().optional().describe('The context from the conversation history.'),
});
export type LiveTutorInput = z.infer<typeof LiveTutorInputSchema>;

const LiveTutorOutputSchema = z.object({
  answer: z.string().describe('The textual answer to the question.'),
  audioDataUri: z.string().describe('The audio data URI of the spoken answer.'),
});
export type LiveTutorOutput = z.infer<typeof LiveTutorOutputSchema>;

export async function liveTutor(input: LiveTutorInput): Promise<LiveTutorOutput> {
  return liveTutorFlow(input);
}

const liveTutorFlow = ai.defineFlow(
  {
    name: 'liveTutorFlow',
    inputSchema: LiveTutorInputSchema,
    outputSchema: LiveTutorOutputSchema,
  },
  async (input) => {
    // First, get the text answer.
    const answerResult = await answerQuestionsWithContext({
      question: input.question,
      context: input.context || '',
    });

    // Then, convert the answer to speech.
    const speechResult = await textToSpeech({
      text: answerResult.answer,
    });

    return {
      answer: answerResult.answer,
      audioDataUri: speechResult.audioDataUri,
    };
  }
);
