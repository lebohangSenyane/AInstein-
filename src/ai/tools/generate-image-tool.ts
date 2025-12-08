'use server';
/**
 * @fileOverview A tool for generating images from a text prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const generateImageTool = ai.defineTool(
  {
    name: 'generateImageTool',
    description:
      'A tool for generating images. Use this when the user asks for a diagram, image, or visualization.',
    inputSchema: z.object({
      prompt: z
        .string()
        .describe(
          'A detailed description of the image to be generated. Should be in English.'
        ),
    }),
    outputSchema: z.object({
      imageUrl: z
        .string()
        .describe(
          "The data URI of the generated image. Should be in 'data:image/png;base64,<encoded_data>' format."
        ),
    }),
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-2.0-fast-generate-001',
      prompt: input.prompt,
    });
    
    if (media.url) {
        return {
            imageUrl: media.url
        }
    }
    
    return {
        imageUrl: ''
    };
  }
);
