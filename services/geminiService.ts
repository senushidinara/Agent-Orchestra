import { GoogleGenAI, Type } from "@google/genai";
import type { Curriculum, Content, Assessment, UserAnswers, Feedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper function to call Gemini and parse JSON
async function callGemini_json<T>(prompt: string, schema: any): Promise<T> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", jsonText);
        throw new Error("Received malformed JSON from API.");
    }
}

// Helper function for simple text generation
async function callGemini_text(prompt: string, systemInstruction?: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text;
}


export const generateCurriculum = async (topic: string): Promise<Curriculum> => {
    const prompt = `Create a detailed learning curriculum for the topic: "${topic}". The curriculum should have a main title and a list of 4-6 modules. Each module must have a title and a brief, one-sentence description.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            modules: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ["title", "description"],
                },
            },
        },
        required: ["title", "modules"],
    };

    return callGemini_json<Curriculum>(prompt, schema);
};


export const generateContent = async (curriculum: Curriculum): Promise<Content> => {
    const contentPromises = curriculum.modules.map(async (module) => {
        const prompt = `Generate detailed, beginner-friendly learning content for the module: "${module.title} - ${module.description}". The content should be in Markdown format. Cover the key concepts clearly. Use headings, lists, and bold text to structure the information. Do not include the module title in the response.`;
        const content = await callGemini_text(prompt, 'You are an expert educator creating learning materials.');
        return { [module.title]: content };
    });

    const contents = await Promise.all(contentPromises);
    return Object.assign({}, ...contents);
};


export const generateAssessment = async (curriculum: Curriculum): Promise<Assessment> => {
    const curriculumString = curriculum.modules.map(m => `- ${m.title}: ${m.description}`).join('\n');
    const prompt = `Based on the following curriculum, create a quiz assessment with 5 multiple-choice questions to test understanding. Each question must have exactly 4 options.

Curriculum:
${curriculumString}

Provide only the JSON object for the quiz.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A title for the assessment, e.g., 'Knowledge Check'" },
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                        type: { type: Type.STRING, description: "Should always be 'multiple-choice'" },
                    },
                    required: ["question", "options", "type"],
                },
            },
        },
        required: ["title", "questions"],
    };

    return callGemini_json<Assessment>(prompt, schema);
};


export const getFeedbackOnAssessment = async (assessment: Assessment, answers: UserAnswers): Promise<Feedback> => {
    const prompt = `
A user has completed an assessment. Your task is to provide detailed, coach-like feedback.
For each question, identify the correct answer, compare it with the user's answer, and provide a brief explanation for why the correct answer is right.
If the user's answer is incorrect, provide a helpful and actionable "suggestion" for what they should review or how they can improve their understanding of this specific topic. If the answer is correct, the suggestion can be a simple "Keep up the great work!".
Calculate the final score as a percentage.
Provide encouraging overall feedback based on their performance.

Assessment Questions:
${JSON.stringify(assessment.questions, null, 2)}

User's Answers:
${JSON.stringify(answers, null, 2)}

Respond with only the JSON object containing the feedback.
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            overallFeedback: { type: Type.STRING },
            score: { type: Type.NUMBER },
            questionFeedback: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        userAnswer: { type: Type.STRING },
                        correctAnswer: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN },
                        explanation: { type: Type.STRING },
                        suggestion: { type: Type.STRING },
                    },
                    required: ["question", "userAnswer", "correctAnswer", "isCorrect", "explanation", "suggestion"],
                },
            },
        },
        required: ["overallFeedback", "score", "questionFeedback"],
    };

    return callGemini_json<Feedback>(prompt, schema);
};

export const getTutoringResponse = async (question: string, context: string): Promise<string> => {
    const systemInstruction = `You are an AI Tutor. Your role is to help the user understand the provided learning material.
Answer the user's questions based ONLY on the context provided below. Be friendly, encouraging, and clear in your explanations.
If the question is outside the scope of the context, gently guide them back to the material.

Context:
---
${context}
---
`;
    return callGemini_text(question, systemInstruction);
};
