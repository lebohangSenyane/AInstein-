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
    const llmResponse = await ai.generate({
      prompt: `generate an image of ${input.prompt}`,
      model: 'googleai/gemini-pro-vision',
    });
    
    const imagePart = llmResponse.output()?.content[0];
    if (imagePart?.media) {
        return {
            imageUrl: imagePart.media.url
        }
    }
    
    return {
        imageUrl: ''
    };
  }
);
