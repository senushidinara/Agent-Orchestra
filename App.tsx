
import React, { useState, useCallback } from 'react';
import { Orchestra } from './components/Orchestra';
import { MainDisplay } from './components/MainDisplay';
import { LogPanel } from './components/LogPanel';
import { InfoPanel } from './components/InfoPanel';
import type { AgentName, LogEntry, LearningPackage } from './types';
import { generateLearningPackage, orchestrate } from './services/geminiService';

const GlassPanel: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-gray-900/40 backdrop-blur-xl border border-cyan-400/20 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentAgent, setCurrentAgent] = useState<AgentName>('User');
    const [agentStatuses, setAgentStatuses] = useState<{ [key in AgentName]?: string }>({});
    const [learningPackage, setLearningPackage] = useState<LearningPackage | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogs(prev => [...prev, {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...entry,
        }]);
    }, []);

    const handleStartLearning = useCallback(async (prompt: string) => {
        setIsLoading(true);
        setLearningPackage(null);
        setLogs([]);
        setAgentStatuses({});
        setCurrentAgent('User');

        addLog({ source: 'User', target: 'Central Orchestrator', intent: 'start_learning', message: `Request to learn: "${prompt}"` });

        try {
            let nextStep = await orchestrate(prompt, 'User');
            setCurrentAgent(nextStep.nextAgent);
            setAgentStatuses(prev => ({ ...prev, 'User': 'Done', [nextStep.nextAgent]: 'Processing...' }));
            addLog({ source: 'Central Orchestrator', target: nextStep.nextAgent, intent: 'generate_curriculum', message: nextStep.task, confidence: nextStep.confidence });
            
            const lp = await generateLearningPackage(prompt);
            setLearningPackage(lp);

            addLog({ source: 'Curriculum Agent', target: 'Central Orchestrator', intent: 'curriculum_complete', message: `Curriculum "${lp.curriculum.title}" created with ${lp.curriculum.modules.length} modules.` });
            setAgentStatuses(prev => ({ ...prev, 'Curriculum Agent': 'Done' }));

            nextStep = await orchestrate('curriculum_done', 'Curriculum Agent');
            setCurrentAgent(nextStep.nextAgent);
            setAgentStatuses(prev => ({ ...prev, [nextStep.nextAgent]: 'Processing...' }));
            addLog({ source: 'Central Orchestrator', target: nextStep.nextAgent, intent: 'generate_content', message: nextStep.task, confidence: nextStep.confidence });
            
            await new Promise(res => setTimeout(res, 300));
            addLog({ source: 'Content Agent', target: 'Central Orchestrator', intent: 'content_complete', message: `Content generated for all ${Object.keys(lp.content).length} modules.` });
            setAgentStatuses(prev => ({ ...prev, 'Content Agent': 'Done' }));

            nextStep = await orchestrate('content_done', 'Content Agent');
            setCurrentAgent(nextStep.nextAgent);
            setAgentStatuses(prev => ({ ...prev, [nextStep.nextAgent]: 'Processing...' }));
            addLog({ source: 'Central Orchestrator', target: nextStep.nextAgent, intent: 'generate_assessment', message: nextStep.task, confidence: nextStep.confidence });

            await new Promise(res => setTimeout(res, 300));
            addLog({ source: 'Assessment Agent', target: 'Central Orchestrator', intent: 'assessment_complete', message: `Assessment "${lp.assessment.title}" created with ${lp.assessment.questions.length} questions.` });
            setAgentStatuses(prev => ({ ...prev, 'Assessment Agent': 'Done' }));

            nextStep = await orchestrate('assessment_done', 'Assessment Agent');
            setCurrentAgent(nextStep.nextAgent);
            setAgentStatuses(prev => ({ ...prev, [nextStep.nextAgent]: 'Complete' }));
            addLog({ source: 'Central Orchestrator', target: nextStep.nextAgent, intent: 'process_complete', message: nextStep.task, confidence: nextStep.confidence });

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            addLog({ source: 'System', target: 'User', intent: 'error', message: `Failed to generate learning package: ${message}` });
            setCurrentAgent('System');
            setAgentStatuses(prev => ({ ...prev, [currentAgent]: 'Error' }));
        } finally {
            setIsLoading(false);
        }
    }, [addLog, currentAgent]);

    return (
        <div className="text-gray-100 min-h-screen font-sans flex flex-col p-4">
            <header className="bg-transparent text-center py-2">
                <h1 className="text-2xl font-bold text-cyan-300 tracking-wider">AI LEARNING ORCHESTRATOR</h1>
            </header>
            <main className="flex-grow pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <aside className="lg:col-span-3 flex flex-col gap-6">
                     <GlassPanel className="p-4">
                        <Orchestra currentAgent={currentAgent} agentStatuses={agentStatuses} />
                    </GlassPanel>
                    <GlassPanel className="p-4">
                        <InfoPanel currentAgent={currentAgent} />
                    </GlassPanel>
                </aside>
                <div className="lg:col-span-6">
                    <GlassPanel className="h-full">
                        <MainDisplay
                            isLoading={isLoading}
                            onSubmit={handleStartLearning}
                            learningPackage={learningPackage}
                        />
                    </GlassPanel>
                </div>
                <aside className="lg:col-span-3">
                    <GlassPanel className="h-full">
                        <LogPanel logs={logs} />
                    </GlassPanel>
                </aside>
            </main>
        </div>
    );
};

export default App;
