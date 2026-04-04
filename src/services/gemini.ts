import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client using the environment variable
// The platform handles the injection of the API key automatically.
export const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const getModel = (modelName: string = "gemini-3-flash-preview") => {
  return ai.models.generateContent({
    model: modelName,
    contents: "", // Placeholder for initialization if needed
  });
};
