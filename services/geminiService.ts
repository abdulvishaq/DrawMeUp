import { GoogleGenAI, Modality } from "@google/genai";

export type DrawingStyle = 'Doodle' | 'Pencil' | 'Cartoon' | 'Chibi' | 'Watercolor' | 'Oil Painting' | 'Comic' | 'Anime';

const stylePrompts: Record<DrawingStyle, string> = {
  'Doodle': "A fun, quick doodle based on the provided image. Use simple, playful, and spontaneous lines with a hand-drawn feel. It should look like a sketch in a notebook. Only output the image.",
  'Pencil': "A detailed, realistic pencil sketch based on the provided image. The drawing should look like it was done with graphite pencils, featuring rich shading, texture, and cross-hatching techniques. The background must be a clean white. Only output the image.",
  'Cartoon': "A vibrant, colorful cartoon based on the provided image. Use bold, clean outlines, simplified shapes, and bright, flat colors. The style should be fun and exaggerated, like a modern animated character. Only output the image.",
  'Chibi': "An adorable 'chibi' style drawing of the subjects in the provided image. This means giving them oversized heads, large expressive eyes, and small, cute bodies. Keep the style playful and simple. Only output the image.",
  'Watercolor': "A beautiful watercolor painting based on the provided image. The style should have soft, blended colors, visible brush strokes, and a textured paper background effect. Capture the essence of the scene with a fluid and artistic feel. Only output the image.",
  'Oil Painting': "A classic oil painting based on the provided image. Use rich colors, thick, visible brushstrokes with texture (impasto style), and a dramatic play of light and shadow. The result should feel like a masterpiece on canvas. Only output the image.",
  'Comic': "A frame from a classic comic book, based on the provided image. Use heavy black inks for outlines, a limited color palette with halftone dot patterns for shading, and a dynamic, graphic style. Only output the image.",
  'Anime': "A 90s Japanese anime style drawing based on the provided image. Feature sharp, clean lines, large and expressive eyes with detailed highlights, characteristic anime hair, and a vibrant, cel-shaded color palette. Only output the image.",
};

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return apiKey;
};

const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });


export const generateDrawing = async (base64Image: string, mimeType: string, style: DrawingStyle): Promise<string> => {
  const prompt = stylePrompts[style];
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const doodledBase64 = part.inlineData.data;
        const doodledMimeType = part.inlineData.mimeType;
        return `data:${doodledMimeType};base64,${doodledBase64}`;
      }
    }

    throw new Error("The AI did not return an image. Please try again with a different photo.");

  } catch (error) {
    console.error("Error generating drawing with Gemini API:", error);
    throw new Error("Failed to communicate with the AI to create your drawing. Please check your network or try again later.");
  }
};
