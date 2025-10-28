
import * as React from 'react';
import { Orchestra } from './components/Orchestra';
import { LogPanel } from './components/LogPanel';
import { InfoPanel } from './components/InfoPanel';
import { MainDisplay } from './components/MainDisplay';
import type { AgentName, LogEntry, Curriculum, Content, Assessment, Feedback, UserAnswers } from './types';
import { generateCurriculum, generateContent, generateAssessment, getFeedbackOnAssessment } from './services/geminiService';
import type { Tab } from './components/TabNavigation';

const App: React.FC = () => {
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [currentAgent, setCurrentAgent] = React.useState<AgentName>('System');
    const [agentStatuses, setAgentStatuses] = React.useState<{ [key in AgentName]?: string }>({});

    const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
    const [content, setContent] = React.useState<Content | null>(null);
    const [assessment, setAssessment] = React.useState<Assessment | null>(null);
    const [feedback, setFeedback] = React.useState<Feedback | null>(null);

    const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
    const [disabledTabs, setDisabledTabs] = React.useState<Tab[]>(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const addLog = (source: AgentName, target: AgentName, message: string) => {
        setLogs(prev => [...prev, { id: crypto.randomUUID(), timestamp: Date.now(), source, target, message }]);
    };

    const updateAgentStatus = (agent: AgentName, status: string) => {
        setCurrentAgent(agent);
        setAgentStatuses(prev => ({ ...prev, [agent]: status }));
    };

    const resetState = () => {
        setLogs([]);
        setCurriculum(null);
        setContent(null);
        setAssessment(null);
        setFeedback(null);
        setActiveTab('Overview');
        setDisabledTabs(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
        setAgentStatuses({});
        setCurrentAgent('System');
    }

    const handleStartLearning = async (topic: string) => {
        if (isGenerating) return;

        resetState();
        setIsGenerating(true);
        
        addLog('User', 'Central Orchestrator', `Request to learn about: "${topic}"`);

        try {
            // 1. Generate Curriculum
            updateAgentStatus('Curriculum Agent', 'Generating curriculum...');
            addLog('Central Orchestrator', 'Curriculum Agent', 'Task: Design a learning curriculum.');
            const newCurriculum = await generateCurriculum(topic);
            setCurriculum(newCurriculum);
            updateAgentStatus('Curriculum Agent', 'Curriculum generated.');
            addLog('Curriculum Agent', 'Central Orchestrator', 'Success: Curriculum created.');

            // 2. Generate Content
            updateAgentStatus('Content Agent', 'Generating content...');
            addLog('Central Orchestrator', 'Content Agent', 'Task: Generate content for all modules.');
            const newContent = await generateContent(newCurriculum);
            setContent(newContent);
            updateAgentStatus('Content Agent', 'Content generated.');
            addLog('Content Agent', 'Central Orchestrator', 'Success: Content created.');
            
            // 3. Generate Assessment
            updateAgentStatus('Assessment Agent', 'Generating assessment...');
            addLog('Central Orchestrator', 'Assessment Agent', 'Task: Create an assessment quiz.');
            const newAssessment = await generateAssessment(newCurriculum);
            setAssessment(newAssessment);
            updateAgentStatus('Assessment Agent', 'Assessment generated.');
            addLog('Assessment Agent', 'Central Orchestrator', 'Success: Assessment created.');

            updateAgentStatus('System', 'Learning package ready.');
            addLog('Central Orchestrator', 'User', 'Learning package is ready. You can now explore the tabs.');

            setDisabledTabs([]);
            setActiveTab('Curriculum');

        } catch (error) {
            console.error("Failed to generate learning package:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            updateAgentStatus('System', 'Error occurred.');
            addLog('Central Orchestrator', 'User', `Error: Failed to generate learning package. ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitAssessment = async (answers: UserAnswers) => {
        if (!assessment) return;

        updateAgentStatus('Feedback Agent', 'Analyzing answers...');
        addLog('User', 'Feedback Agent', 'Submitted assessment answers.');
        
        try {
            const newFeedback = await getFeedbackOnAssessment(assessment, answers);
            setFeedback(newFeedback);
            updateAgentStatus('Feedback Agent', 'Feedback generated.');
            addLog('Feedback Agent', 'User', 'Feedback is ready for review.');
            setActiveTab('Feedback');
        } catch (error) {
            console.error("Failed to get feedback:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            updateAgentStatus('System', 'Error occurred.');
            addLog('Feedback Agent', 'User', `Error: Failed to generate feedback. ${errorMessage}`);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
            <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                <h1 className="text-xl font-bold text-center">AI Learning Orchestrator</h1>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 flex-grow overflow-hidden">
                <aside className="lg:col-span-3 space-y-6 flex-shrink-0 flex flex-col">
                    <Orchestra currentAgent={currentAgent} agentStatuses={agentStatuses} />
                    <InfoPanel currentAgent={currentAgent} />
                </aside>
                <div className="lg:col-span-6 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                    <MainDisplay
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        disabledTabs={disabledTabs}
                        isGenerating={isGenerating}
                        onStartLearning={handleStartLearning}
                        curriculum={curriculum}
                        content={content}
                        assessment={assessment}
                        onSubmitAssessment={handleSubmitAssessment}
                        feedback={feedback}
                    />
                </div>
                <aside className="lg:col-span-3 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                    <LogPanel logs={logs} />
                </aside>
            </main>
        </div>
    );
};

export default App;
