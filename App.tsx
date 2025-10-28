
import * as React from 'react';
import { Orchestra } from './components/Orchestra';
import { InfoPanel } from './components/InfoPanel';
import { LogPanel } from './components/LogPanel';
import { MainDisplay } from './components/MainDisplay';
import { generateLearningPackage } from './services/geminiService';
import type { AgentName, LearningPackage, LogEntry } from './types';

function App() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [currentAgent, setCurrentAgent] = React.useState<AgentName>('Central Orchestrator');
    const [agentStatuses, setAgentStatuses] = React.useState<{ [key in AgentName]?: string }>({});
    const [learningPackage, setLearningPackage] = React.useState<LearningPackage | null>(null);

    const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogs(prev => [...prev, { ...entry, id: crypto.randomUUID(), timestamp: Date.now() }]);
    };
    
    const updateAgentStatus = (agent: AgentName, status: string) => {
        setCurrentAgent(agent);
        setAgentStatuses(prev => ({ ...prev, [agent]: status }));
    };

    const handleNewJourney = async (prompt: string) => {
        setIsLoading(true);
        setLogs([]);
        setLearningPackage(null);
        setAgentStatuses({});
        setCurrentAgent('Central Orchestrator');

        try {
            const finalPackage = await generateLearningPackage(prompt, addLog, updateAgentStatus);
            setLearningPackage(finalPackage);
        } catch (error) {
            console.error("Failed to generate learning package", error);
            addLog({
                source: 'System',
                target: 'User',
                message: 'An unexpected error occurred. Please check the console for details.'
            });
        } finally {
            setIsLoading(false);
            setCurrentAgent('Central Orchestrator');
            setAgentStatuses(prev => ({ ...prev, 'Central Orchestrator': 'Idle' }));
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col">
            <header className="border-b border-gray-700/50 p-4">
                <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    AI Learning Orchestrator
                </h1>
            </header>
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-px bg-gray-700/50">
                <aside className="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm p-4 space-y-6">
                    <Orchestra currentAgent={currentAgent} agentStatuses={agentStatuses} />
                    <InfoPanel currentAgent={currentAgent} />
                </aside>
                <section className="lg:col-span-7 bg-gray-800/60 backdrop-blur-sm rounded-lg">
                    <MainDisplay
                        isLoading={isLoading}
                        onSubmit={handleNewJourney}
                        learningPackage={learningPackage}
                    />
                </section>
                <aside className="lg:col-span-3 bg-gray-800/80 backdrop-blur-sm">
                    <LogPanel logs={logs} />
                </aside>
            </main>
        </div>
    );
}

export default App;
