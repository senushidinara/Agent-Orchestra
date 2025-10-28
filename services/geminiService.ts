// services/geminiService.ts
import { GoogleGenAI, Type } from '@google/genai';
import type { Curriculum, Assessment, QuizQuestion, UserAnswers, Feedback, Content } from '../types';

// FIX: Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Schemas for structured responses from the model

const curriculumSchema = {
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
                required: ['title', 'description'],
            },
        },
    },
    required: ['title', 'modules'],
};

const contentSchema = (moduleTitles: string[]) => ({
    type: Type.OBJECT,
    properties: moduleTitles.reduce((acc, title) => {
        acc[title] = { type: Type.STRING, description: `Content for module: ${title}` };
        return acc;
    }, {} as any),
    required: moduleTitles,
});


const assessmentSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['question', 'options'],
            },
        },
    },
    required: ['title', 'questions'],
};


const feedbackSchema = (questions: QuizQuestion[]) => ({
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.NUMBER, description: "Overall score as a percentage (0-100)." },
        feedbackPerQuestion: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    isCorrect: { type: Type.BOOLEAN },
                    correctAnswer: { type: Type.STRING, description: `The correct option text for the question.` },
                    explanation: { type: Type.STRING, description: "A brief explanation for why the answer is correct or incorrect." },
                },
                required: ['isCorrect', 'correctAnswer', 'explanation'],
            },
        },
    },
    required: ['overallScore', 'feedbackPerQuestion'],
});


// Helper to call Gemini and parse JSON
async function callGemini<T>(prompt: string, schema: any): Promise<T> {
    const response = await ai.models.generateContent({
        // FIX: Use gemini-2.5-flash for basic text tasks.
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            temperature: 0.5,
        },
    });

    // FIX: Access response text correctly and parse it.
    const text = response.text;
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", text);
        throw new Error("Received invalid JSON from the model.");
    }
}


export async function generateCurriculum(topic: string): Promise<Curriculum> {
    const prompt = `You are a Curriculum Agent. Design a concise curriculum for a beginner on the topic: "${topic}". The curriculum should include a main title and 3-5 modules. Each module needs a short, descriptive title and a one-sentence description.`;
    return callGemini<Curriculum>(prompt, curriculumSchema);
}


export async function generateContent(curriculum: Curriculum): Promise<Content> {
    const moduleTitles = curriculum.modules.map(m => m.title);
    const prompt = `You are a Content Agent. Based on the following curriculum, generate detailed learning content for each module. The content for each module should be in Markdown format, be educational, and about 200-300 words.

    Curriculum Title: ${curriculum.title}
    Modules:
    ${curriculum.modules.map(m => `- ${m.title}: ${m.description}`).join('\n')}
    `;
    const schema = contentSchema(moduleTitles);
    return callGemini<Content>(prompt, schema);
}


export async function generateAssessment(curriculum: Curriculum): Promise<Assessment> {
    const prompt = `You are an Assessment Agent. Create a multiple-choice quiz to assess understanding of a curriculum on "${curriculum.title}". Generate 5 questions based on the overall topic. Each question should have 4 options. Do not indicate the correct answer.`;
    return callGemini<Assessment>(prompt, assessmentSchema);
}


export async function getFeedbackOnAssessment(assessment: Assessment, userAnswers: UserAnswers): Promise<Feedback> {
    const questionsAndAnswers = assessment.questions.map((q, i) => {
        const userAnswerIndex = userAnswers[i];
        const userAnswerText = userAnswerIndex !== undefined ? q.options[userAnswerIndex] : "Not answered";
        return `Question ${i + 1}: ${q.question}\nOptions: ${q.options.join(', ')}\nUser Answer: "${userAnswerText}"`;
    }).join('\n\n');

    const prompt = `You are a Feedback Agent. A user has completed a quiz. Evaluate their answers and provide feedback. For each question, state if the user was correct, provide the correct answer text, and a brief explanation. Also, calculate an overall score as a percentage.

    ${questionsAndAnswers}
    `;
    const schema = feedbackSchema(assessment.questions);
    return callGemini<Feedback>(prompt, schema);
}


export async function getTutoringResponse(question: string, context: string): Promise<string> {
    const prompt = `You are a Tutoring Agent. A student has a question related to their learning material.
    
    Provided context (learning material):
    ---
    ${context}
    ---

    Student's question: "${question}"

    Answer the student's question concisely and helpfully, using only the provided context. If the question is outside the scope of the context, politely state that you can only answer questions about the provided material.`;
    
    const response = await ai.models.generateContent({
        // FIX: Use gemini-2.5-flash for basic text tasks.
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // FIX: Access response text correctly.
    return response.text;
}
