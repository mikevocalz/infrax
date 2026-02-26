import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSecurityInsights = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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