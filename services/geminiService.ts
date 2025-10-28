import { GoogleGenAI, type Schema } from "@google/genai";
import type { AgentName } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// Fix: Update function to accept an optional schema for more reliable JSON responses.
export const generateContentForAgent = async (agentName: AgentName, prompt: string, schema?: Schema): Promise<string> => {
    try {
        console.log(`Sending prompt for ${agentName}: "${prompt}"`);
        // Fix: Set responseMimeType to application/json only when a schema is provided to ensure the API returns JSON.
        const isJsonPrompt = !!schema;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                ...(isJsonPrompt && { responseMimeType: "application/json" }),
                ...(schema && { responseSchema: schema }),
            },
        });
        
        const text = response.text;
        if (!text) {
            throw new Error("Received an empty response from the API.");
        }
        console.log(`Received response for ${agentName}: "${text}"`);
        return text;
    } catch (error) {
        console.error(`Error calling Gemini API for ${agentName}:`, error);
        throw new Error(`Failed to get response from ${agentName}. Please check your API key and network connection.`);
    }
};
