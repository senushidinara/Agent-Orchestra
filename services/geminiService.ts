import { GoogleGenAI, Type } from "@google/genai";
import type { Curriculum, Assessment, Content, AgentName } from '../types';

// FIX: Removed API key check as per guidelines. The key is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface LearningPackage {
    curriculum: Curriculum;
    content: Content;
    assessment: Assessment;
}

const learningPackageSchema = {
    type: Type.OBJECT,
    properties: {
        curriculum: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Title of the entire learning course." },
                modules: {
                    type: Type.ARRAY,
                    description: "An array of modules that make up the course.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title of the module." },
                            description: { type: Type.STRING, description: "A brief description of the module." }
                        },
                        required: ['title', 'description']
                    }
                }
            },
            required: ['title', 'modules']
        },
        content: {
            type: Type.OBJECT,
            description: "A dictionary mapping module titles from the curriculum to their full content in Markdown format. Each key must exactly match a module title.",
            properties: {}, // This allows for arbitrary keys (module titles)
        },
        assessment: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Title of the assessment." },
                questions: {
                    type: Type.ARRAY,
                    description: "A list of questions for the assessment.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: "The question text." },
                            options: { type: Type.ARRAY, description: "An array of possible answers (strings).", items: { type: Type.STRING } },
                            correct_answer_index: { type: Type.INTEGER, description: "The 0-based index of the correct answer in the 'options' array." }
                        },
                        required: ['question', 'options', 'correct_answer_index']
                    }
                }
            },
            required: ['title', 'questions']
        }
    },
    required: ['curriculum', 'content', 'assessment']
};


export const generateLearningPackage = async (prompt: string): Promise<LearningPackage> => {
    const systemInstruction = `You are a sophisticated AI learning orchestrator. Your goal is to generate a complete and coherent learning package based on a user's request.
    This package must include:
    1.  A curriculum with a title and a list of modules, each with a title and description.
    2.  Detailed content for EACH module in the curriculum. The content should be in Markdown format. The keys of the content object must EXACTLY match the module titles.
    3.  An assessment with a title and a list of multiple-choice questions. Each question must have at least 3 options and specify the index of the correct answer.

    The entire output must be a single JSON object that conforms to the provided schema.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a learning package for the topic: "${prompt}"`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: learningPackageSchema,
            systemInstruction: systemInstruction,
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        // A simple validation to ensure the content keys match module titles.
        const moduleTitles = parsed.curriculum.modules.map((m: any) => m.title);
        const contentKeys = Object.keys(parsed.content);
        if (moduleTitles.length !== contentKeys.length || !moduleTitles.every((title: string) => contentKeys.includes(title))) {
             console.warn("Mismatch between curriculum module titles and content keys. The model may not have followed instructions perfectly.");
        }
        return parsed as LearningPackage;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", jsonText);
        throw new Error("Failed to generate a valid learning package.");
    }
};

export const getTutoringResponse = async (question: string, context: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following context:\n\n${context}\n\nAnswer the user's question: "${question}"`,
        config: {
            systemInstruction: "You are a friendly and encouraging tutor. Explain concepts clearly and concisely. Use Markdown for formatting if it helps clarify the answer."
        }
    });

    return response.text;
};

// This is a mock function to simulate the orchestrator deciding which agent to use.
export const orchestrate = async (intent: string, lastAgent: AgentName): Promise<{ nextAgent: AgentName, task: string, confidence: number }> => {
    // This is a simplified, hardcoded logic flow for the demo.
    // A real implementation would use a model to determine the next step.
    console.log(`Orchestrating based on intent: ${intent} from ${lastAgent}`);
    switch (lastAgent) {
        case 'User':
            return { nextAgent: 'Curriculum Agent', task: `Design a curriculum for: ${intent}`, confidence: 0.95 };
        case 'Curriculum Agent':
            return { nextAgent: 'Content Agent', task: 'Generate content for the defined curriculum.', confidence: 0.98 };
        case 'Content Agent':
            return { nextAgent: 'Assessment Agent', task: 'Create an assessment based on the curriculum and content.', confidence: 0.97 };
        case 'Assessment Agent':
            return { nextAgent: 'System', task: 'Learning package generated. Awaiting user interaction.', confidence: 1.0 };
        default:
            return { nextAgent: 'System', task: 'Orchestration complete or unknown state.', confidence: 0.9 };
    }
}
