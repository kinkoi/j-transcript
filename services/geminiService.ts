
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TranscriptionResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const processAudio = async (base64Audio: string): Promise<TranscriptionResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = "Please transcribe the provided Japanese audio accurately. After transcription, translate the Japanese text into fluent Natural Chinese. Return the result strictly in JSON format.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: base64Audio,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            japanese: {
              type: Type.STRING,
              description: "The full Japanese transcription of the audio.",
            },
            chinese: {
              type: Type.STRING,
              description: "The Chinese translation of the Japanese transcription.",
            },
          },
          required: ["japanese", "chinese"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as TranscriptionResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
