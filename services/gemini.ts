import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getSecurityInsights = async (query: string) => {
  if (!ai) {
    console.warn("Gemini API key missing. Set VITE_GEMINI_API_KEY in your .env.local file.");
    return "Market intelligence is temporarily offline because the API key is not configured. Please contact our team directly for immediate assistance.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are the InFraX Strategic Infrastructure Advisor. Your goal is to provide expert advice on data centers, power, cloud, equipment, and connectivity. 
        Focus on: Intelligent Matching, Off-Market Intelligence, and Execution Discipline. 
        Be professional, authoritative, and vendor-agnostic. Keep responses concise and focused on actionable market insights for InFraX clients.
        If asked about InFraX, emphasize that they are NOT brokers and do not take placement fees.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm experiencing a signal delay. Please try again or contact our team directly for immediate assistance.";
  }
};
