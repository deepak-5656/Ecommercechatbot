
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Function to handle lead capture when Gemini identifies these details
const captureDetailsDeclaration: FunctionDeclaration = {
  name: "capture_customer_details",
  parameters: {
    type: Type.OBJECT,
    description: "Capture user contact and order information for support follow-up.",
    properties: {
      email: { type: Type.STRING, description: "The customer's email address" },
      mobile: { type: Type.STRING, description: "The customer's mobile phone number" },
      orderId: { type: Type.STRING, description: "The specific order ID referenced by the customer" },
    },
  },
};

export const chatWithAI = async (message: string, history: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [captureDetailsDeclaration] }],
        temperature: 0.7,
      },
    });

    return {
      text: response.text || "I'm sorry, I couldn't process that. Could you try again?",
      functionCalls: response.functionCalls || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
