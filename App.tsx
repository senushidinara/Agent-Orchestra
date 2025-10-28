import * as React from 'react';
import { Orchestra } from './components/Orchestra';
import { MainDisplay } from './components/MainDisplay';
import { LogPanel } from './components/LogPanel';
import { InfoPanel } from './components/InfoPanel';
import type { Tab } from './components/TabNavigation';
import type { AgentName, LogEntry, Curriculum, Content, Assessment } from './types';
import { generateLearningPackage, orchestrate, LearningPackage } from './services/geminiService';

const App: React.FC = () => {
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [activeAgent, setActiveAgent] = React.useState<AgentName | null>(null);
    const [agentStatus, setAgentStatus] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
    const [content, setContent] = React.useState<Content | null>(null);
    const [assessment, setAssessment] = React.useState<Assessment | null>(null);

    const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
    const [disabledTabs, setDisabledTabs] = React.useState<Tab[]>(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);

    const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogs(prev => [...prev, {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: new Date().toLocaleTimeString(),
        }]);
    };

    const runOrchestration = async (initialIntent: string) => {
        setIsLoading(true);
        setCurriculum(null);
        setContent(null);
        setAssessment(null);
        setActiveTab('Overview');
        setDisabledTabs(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
        setLogs([]);

        addLog({ source: 'User', target: 'Central Orchestrator', intent: 'Start Learning', message: `User wants to learn about: "${initialIntent}"` });

        try {
            // This is a simplified sequential flow for the demo.
            // A more complex system might have branching logic.
            let lastAgent: AgentName = 'User';
            let currentTask = initialIntent;
            let learningPackage: LearningPackage | null = null;

            // Step 1: Orchestrator -> Curriculum Agent (Simulated)
            setActiveAgent('Central Orchestrator');
            setAgentStatus('Planning curriculum generation...');
            let nextStep = await orchestrate(currentTask, lastAgent);
            addLog({ source: 'Central Orchestrator', target: nextStep.nextAgent, intent: 'Delegate Task', message: nextStep.task });
            
            // Step 2: Curriculum, Content, and Assessment Agent (Combined Gemini Call)
            setActiveAgent('Curriculum Agent'); // We can show a sequence of agents
            setAgentStatus('Generating entire learning package...');
            
            learningPackage = await generateLearningPackage(initialIntent);
            
            setCurriculum(learningPackage.curriculum);
            addLog({ source: 'Curriculum Agent', target: 'Content Agent', intent: 'Curriculum Defined', message: 'Curriculum structure created successfully.' });

            setActiveAgent('Content Agent');
            setAgentStatus('Populating content for all modules...');
            setContent(learningPackage.content);
            addLog({ source: 'Content Agent', target: 'Assessment Agent', intent: 'Content Generated', message: 'All module content has been generated.' });

            setActiveAgent('Assessment Agent');
            setAgentStatus('Creating knowledge check questions...');
            setAssessment(learningPackage.assessment);
            addLog({ source: 'Assessment Agent', target: 'System', intent: 'Assessment Created', message: 'Assessment is ready for the user.' });

            // Final step
            setActiveAgent('System');
            setAgentStatus('Learning package ready!');
            addLog({ source: 'System', target: 'User', intent: 'Ready', message: 'The learning package is now available in the tabs.' });

            setDisabledTabs([]); // Enable all tabs
            setActiveTab('Curriculum');


        } catch (error) {
            console.error("Orchestration failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addLog({ source: 'System', target: 'User', intent: 'Error', message: `Failed to generate learning package: ${errorMessage}` });
            setAgentStatus(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
            setActiveAgent(null);
            setAgentStatus('');
        }
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <header className="py-4 px-8 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-center">AI Agent Learning Orchestrator</h1>
            </header>
            <main className="p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 max-w-screen-2xl mx-auto">
                <aside className="lg:col-span-1 space-y-4 lg:space-y-8 flex flex-col">
                    <Orchestra activeAgent={activeAgent} agentStatus={agentStatus} />
                    <InfoPanel />
                </aside>
                <div className="lg:col-span-3 grid grid-rows-[2fr,1fr] gap-4 lg:gap-8 h-[calc(100vh-120px)]">
                    <MainDisplay
                         activeTab={activeTab}
                         onTabChange={setActiveTab}
                         disabledTabs={disabledTabs}
                         onSubmitPrompt={runOrchestration}
                         curriculum={curriculum}
                         content={content}
                         assessment={assessment}
                    />
                    <LogPanel logs={logs} />
                </div>
            </main>
        </div>
    );
};

export default App;
