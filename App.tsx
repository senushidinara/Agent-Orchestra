import * as React from 'react';
import { Orchestra } from './components/Orchestra';
import { MainDisplay } from './components/MainDisplay';
import { LogPanel } from './components/LogPanel';
import { InfoPanel } from './components/InfoPanel';
import { AGENT_CONFIG } from './constants';
import { generateContentForAgent } from './services/geminiService';
import { Type } from '@google/genai';
import type { Schema } from '@google/genai';
import type { AgentName, AgentConfig, LogEntry, Curriculum, Assessment, AgentResponse } from './types';

const agents: AgentConfig[] = Object.entries(AGENT_CONFIG).map(([name, config]) => ({
    name: name as AgentName,
    ...config,
}));

// A utility to create a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A utility to extract JSON from a markdown code block
const extractJson = (text: string): string => {
    // The model might return JSON in a markdown block, so we extract it.
    const match = text.match(/```(json)?\n([\s\S]*?)\n```/);
    if (match && match[2]) {
        return match[2];
    }
    // Or it might be just the JSON string.
    return text.trim();
};

// A safe JSON parser
// Fix: Add a trailing comma to the generic type parameter `<T,>` to resolve parsing ambiguity with JSX syntax in a .tsx file.
const safeJsonParse = <T,>(jsonString: string): T | null => {
    try {
        return JSON.parse(jsonString) as T;
    } catch (e) {
        const error = e as Error;
        console.error("Failed to parse JSON:", error.message);
        return null;
    }
}


const App: React.FC = () => {
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [thinkingAgents, setThinkingAgents] = React.useState<Record<AgentName, boolean>>({});
    const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
    const [content, setContent] = React.useState<string | null>(null);
    const [assessment, setAssessment] = React.useState<Assessment | null>(null);

    const addLog = React.useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogs(prev => [
            ...prev,
            {
                id: prev.length,
                timestamp: new Date().toLocaleTimeString(),
                ...log
            }
        ]);
    }, []);

    const setAgentThinking = React.useCallback((agentName: AgentName, isThinking: boolean) => {
        setThinkingAgents(prev => ({ ...prev, [agentName]: isThinking }));
    }, []);

    const handleStartLearning = React.useCallback(async (userPrompt: string) => {
        // Reset state for new journey
        setLogs([]);
        setCurriculum(null);
        setContent(null);
        setAssessment(null);
        setThinkingAgents({});
        
        await sleep(100);

        try {
            const orchestrator: AgentName = 'Central Orchestrator';
            const curriculumAgent: AgentName = 'Curriculum Agent';
            const contentAgent: AgentName = 'Content Agent';
            const assessmentAgent: AgentName = 'Assessment Agent';
            
            // 1. Orchestrator starts the process
            setAgentThinking(orchestrator, true);
            addLog({ source: 'System', target: orchestrator, intent: 'Start Learning Journey', message: `Goal: "${userPrompt}"` });
            await sleep(500);

            // 1.1 Orchestrator tasks Curriculum Agent
            addLog({ source: orchestrator, target: curriculumAgent, intent: 'Request: Generate Curriculum', message: `Design a learning path for "${userPrompt}"` });
            setAgentThinking(orchestrator, false);
            setAgentThinking(curriculumAgent, true);
            
            // 2. Curriculum Agent generates the curriculum
            const curriculumPrompt = `Based on the topic "${userPrompt}", generate a curriculum.`;
            const curriculumSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    intent: { type: Type.STRING, description: 'e.g., "CurriculumGenerated"' },
                    confidence: { type: Type.NUMBER, description: '0.0 to 1.0' },
                    rationale: { type: Type.STRING, description: 'A brief explanation of curriculum design choices' },
                    payload: {
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
                                }
                            }
                        },
                        required: ['title', 'modules'],
                    }
                },
                required: ['intent', 'confidence', 'rationale', 'payload'],
            };
            const curriculumResponseJson = await generateContentForAgent(curriculumAgent, curriculumPrompt, curriculumSchema);
            const curriculumResponse = safeJsonParse<AgentResponse<Curriculum>>(extractJson(curriculumResponseJson));

            if (!curriculumResponse) throw new Error("Curriculum Agent returned invalid data.");

            setCurriculum(curriculumResponse.payload);
            addLog({ 
                source: curriculumAgent, 
                target: orchestrator, 
                intent: curriculumResponse.intent, 
                message: curriculumResponse.rationale || `Curriculum "${curriculumResponse.payload.title}" created.`,
                confidence: curriculumResponse.confidence 
            });
            setAgentThinking(curriculumAgent, false);
            
            await sleep(500);

            // 3. Orchestrator tasks Content Agent
            const firstModule = curriculumResponse.payload.modules[0];
            setAgentThinking(orchestrator, true);
            addLog({ source: orchestrator, target: contentAgent, intent: 'Request: Generate Content', message: `Create content for module: "${firstModule.title}"` });
            await sleep(500);
            setAgentThinking(orchestrator, false);
            setAgentThinking(contentAgent, true);
            
            const contentPrompt = `Generate educational content for the topic: "${firstModule.title} - ${firstModule.description}". The content should be in markdown format.`;
            const contentSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    intent: { type: Type.STRING, description: 'e.g., "ContentGenerated"' },
                    confidence: { type: Type.NUMBER, description: '0.0 to 1.0' },
                    rationale: { type: Type.STRING, description: 'A brief explanation of the content\'s focus' },
                    payload: {
                        type: Type.OBJECT,
                        properties: {
                            markdownContent: { type: Type.STRING, description: 'The educational content as a single markdown string' }
                        },
                        required: ['markdownContent'],
                    }
                },
                required: ['intent', 'confidence', 'rationale', 'payload'],
            };
            const contentResponseJson = await generateContentForAgent(contentAgent, contentPrompt, contentSchema);
            const contentResponse = safeJsonParse<AgentResponse<{ markdownContent: string }>>(extractJson(contentResponseJson));

            if (!contentResponse) throw new Error("Content Agent returned invalid data.");

            setContent(contentResponse.payload.markdownContent);
            addLog({ 
                source: contentAgent, 
                target: orchestrator, 
                intent: contentResponse.intent, 
                message: contentResponse.rationale || `Content for "${firstModule.title}" generated.`,
                confidence: contentResponse.confidence 
            });
            setAgentThinking(contentAgent, false);
            
            await sleep(500);

            // 4. Orchestrator tasks Assessment Agent
            setAgentThinking(orchestrator, true);
            addLog({ source: orchestrator, target: assessmentAgent, intent: 'Request: Generate Assessment', message: `Create a quiz for module: "${firstModule.title}"` });
            await sleep(500);
            setAgentThinking(orchestrator, false);
            setAgentThinking(assessmentAgent, true);

            const assessmentPrompt = `Based on the topic "${firstModule.title}", create a short quiz.`;
            const assessmentSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    intent: { type: Type.STRING, description: 'e.g., "AssessmentGenerated"' },
                    confidence: { type: Type.NUMBER, description: '0.0 to 1.0' },
                    rationale: { type: Type.STRING, description: 'Why these questions are effective' },
                    payload: {
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
                                }
                            }
                        },
                        required: ['title', 'questions'],
                    }
                },
                required: ['intent', 'confidence', 'rationale', 'payload'],
            };
            const assessmentResponseJson = await generateContentForAgent(assessmentAgent, assessmentPrompt, assessmentSchema);
            const assessmentResponse = safeJsonParse<AgentResponse<Assessment>>(extractJson(assessmentResponseJson));

            if (!assessmentResponse) throw new Error("Assessment Agent returned invalid data.");

            setAssessment(assessmentResponse.payload);
            addLog({ 
                source: assessmentAgent, 
                target: orchestrator, 
                intent: assessmentResponse.intent, 
                message: assessmentResponse.rationale || `Assessment for "${firstModule.title}" generated.`,
                confidence: assessmentResponse.confidence
            });
            setAgentThinking(assessmentAgent, false);

        } catch (e) {
            const error = e as Error;
            console.error("Orchestration failed:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            addLog({ source: 'System', target: 'Central Orchestrator', intent: 'Error', message });
            // Turn off all thinking indicators on error
            setThinkingAgents({});
        }

    }, [addLog, setAgentThinking]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <header className="py-4 px-8 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-cyan-400">AI Learning Orchestrator</h1>
            </header>
            <main className="p-4 grid grid-cols-1 lg:grid-cols-[300px,1fr] xl:grid-cols-[300px,1fr,450px] gap-4 h-[calc(100vh-73px)]">
                {/* Left Column */}
                <div className="flex-col gap-4 hidden lg:flex">
                    <Orchestra agents={agents} isThinking={thinkingAgents} />
                    <InfoPanel />
                </div>

                {/* Center Column */}
                <div className="h-full overflow-hidden">
                    <MainDisplay
                        onStartLearning={handleStartLearning}
                        curriculum={curriculum}
                        content={content}
                        assessment={assessment}
                    />
                </div>

                {/* Right Column */}
                <div className="bg-gray-800/50 rounded-lg overflow-hidden hidden xl:flex xl:flex-col">
                    <h2 className="text-lg font-semibold p-4 border-b border-gray-700 flex-shrink-0">Agent Communication Log</h2>
                    <LogPanel logs={logs} />
                </div>
            </main>
        </div>
    );
};

export default App;