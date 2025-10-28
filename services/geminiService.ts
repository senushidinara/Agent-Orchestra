
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import the 'LearningPackage' type to resolve the 'Cannot find name' error.
import type { Curriculum, Assessment, Content, AgentName, LogEntry, LearningPackage } from '../types';

// FIX: Initialize the GoogleGenAI client according to the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// FIX: Use an appropriate model for complex generation tasks.
const model = "gemini-2.5-pro";

// FIX: Define a schema for generating the curriculum to ensure structured JSON output.
const curriculumSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The overall title of the learning course."
        },
        modules: {
            type: Type.ARRAY,
            description: "An array of learning modules, typically between 3 and 7 modules.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The title of the module."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A brief one-sentence description of the module's content."
                    }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["title", "modules"]
};

// FIX: Define a schema for generating content for a module.
const contentSchema = {
    type: Type.OBJECT,
    properties: {
        markdownContent: {
            type: Type.STRING,
            description: "Detailed learning content for the module in Markdown format. It should be comprehensive, educational, and well-structured with headings, lists, and code blocks where appropriate."
        }
    },
    required: ["markdownContent"]
};

// FIX: Define a schema for generating an assessment.
const assessmentSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The title of the assessment quiz."
        },
        questions: {
            type: Type.ARRAY,
            description: "An array of multiple-choice questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text."
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: {
                            type: Type.STRING
                        }
                    },
                },
                required: ["question", "options"]
            }
        }
    },
    required: ["title", "questions"]
};

// FIX: Implement the main orchestration logic for generating a learning package.
export async function generateLearningPackage(
    prompt: string,
    updateLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void,
    updateAgentStatus: (agent: AgentName, status: string) => void
): Promise<LearningPackage> {
    const addLog = (source: AgentName, target: AgentName, message: string) => {
        updateLog({ source, target, message });
    };

    try {
        // 1. User -> Orchestrator
        addLog('User', 'Central Orchestrator', `Received learning request: "${prompt}"`);
        updateAgentStatus('Central Orchestrator', 'Planning learning path...');
        await new Promise(res => setTimeout(res, 500));

        // 2. Orchestrator -> Curriculum Agent
        addLog('Central Orchestrator', 'Curriculum Agent', 'Please generate a curriculum for the topic.');
        updateAgentStatus('Curriculum Agent', 'Generating curriculum...');
        
        const curriculumResponse = await ai.models.generateContent({
            model,
            contents: `Generate a detailed curriculum for the topic: "${prompt}". The curriculum should have a clear title and a list of modules, where each module has a title and a short description.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: curriculumSchema,
            },
        });

        const curriculum: Curriculum = JSON.parse(curriculumResponse.text);

        addLog('Curriculum Agent', 'Central Orchestrator', `Curriculum generated with ${curriculum.modules.length} modules.`);
        updateAgentStatus('Central Orchestrator', 'Reviewing curriculum...');
        await new Promise(res => setTimeout(res, 500));

        // 3. Orchestrator -> Content Agent
        addLog('Central Orchestrator', 'Content Agent', 'Curriculum approved. Please generate content for all modules.');
        updateAgentStatus('Content Agent', 'Generating module content...');
        const content: Content = {};
        for (const module of curriculum.modules) {
            updateAgentStatus('Content Agent', `Generating content for: "${module.title}"`);
            addLog('Content Agent', 'Central Orchestrator', `Requesting content for module: ${module.title}`);

            const contentResponse = await ai.models.generateContent({
                model,
                contents: `Generate detailed educational content in Markdown format for the module titled "${module.title}" with the description "${module.description}". The overall topic is "${prompt}". The content should be well-structured and easy to understand.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: contentSchema,
                }
            });

            const moduleContent = JSON.parse(contentResponse.text);
            content[module.title] = moduleContent.markdownContent;
            addLog('Content Agent', 'Central Orchestrator', `Content for module "${module.title}" has been created.`);
            await new Promise(res => setTimeout(res, 200));
        }

        // 4. Orchestrator -> Assessment Agent
        addLog('Central Orchestrator', 'Assessment Agent', 'Content generation complete. Please create an assessment.');
        updateAgentStatus('Assessment Agent', 'Creating assessment quiz...');

        const assessmentResponse = await ai.models.generateContent({
            model,
            contents: `Based on the following curriculum, create a multiple-choice quiz with 5 questions to assess understanding. Each question should have 4 options. Curriculum: ${JSON.stringify(curriculum)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: assessmentSchema,
            },
        });

        const assessment: Assessment = JSON.parse(assessmentResponse.text);
        addLog('Assessment Agent', 'Central Orchestrator', 'Assessment created successfully.');
        updateAgentStatus('Central Orchestrator', 'Finalizing learning package...');
        await new Promise(res => setTimeout(res, 500));

        addLog('Central Orchestrator', 'User', 'Your personalized learning package is ready!');
        updateAgentStatus('Central Orchestrator', 'Idle');

        return { curriculum, content, assessment };

    } catch (error) {
        console.error("Error generating learning package:", error);
        addLog('System', 'User', 'An error occurred while generating the learning package. Please try again.');
        updateAgentStatus('Central Orchestrator', 'Error');
        throw error;
    }
}

// FIX: Implement the tutoring response function.
export const getTutoringResponse = async (question: string, context: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // flash is appropriate for simple Q&A
            contents: `Based on the provided course content, answer the user's question. If the question is outside the scope of the content, politely say so.
            
            --- COURSE CONTENT ---
            ${context}
            --- END OF COURSE CONTENT ---
            
            USER QUESTION: ${question}`,
            config: {
                systemInstruction: "You are a helpful and friendly AI tutor for a personalized learning platform.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error in getTutoringResponse:", error);
        return "I'm sorry, I encountered an error and can't respond right now.";
    }
};