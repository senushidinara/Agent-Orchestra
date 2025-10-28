import * as React from 'react';
import { Orchestra } from './components/Orchestra';
import { MainDisplay } from './components/MainDisplay';
import { LogPanel } from './components/LogPanel';
import { InfoPanel } from './components/InfoPanel';
import type { AgentName, LogEntry, Curriculum, Content, Assessment, UserAnswers, Feedback } from './types';
import type { Tab } from './components/TabNavigation';
import { generateCurriculum, generateContent, generateAssessment, getFeedbackOnAssessment } from './services/geminiService';

const App: React.FC = () => {
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [currentAgent, setCurrentAgent] = React.useState<AgentName>('System');
    const [agentStatuses, setAgentStatuses] = React.useState<{ [key in AgentName]?: string }>({});

    const [learningTopic, setLearningTopic] = React.useState<string | null>(null);
    const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
    const [content, setContent] = React.useState<Content | null>(null);
    const [assessment, setAssessment] = React.useState<Assessment | null>(null);
    const [feedback, setFeedback] = React.useState<Feedback | null>(null);

    const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
    const [disabledTabs, setDisabledTabs] = React.useState<Tab[]>(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const addLog = React.useCallback((source: AgentName, target: AgentName, message: string) => {
        setLogs(prev => [...prev, { id: crypto.randomUUID(), timestamp: Date.now(), source, target, message }]);
    }, []);

    const updateAgentStatus = React.useCallback((agent: AgentName, status: string, makeCurrent: boolean = true) => {
        if (makeCurrent) {
            setCurrentAgent(agent);
        }
        setAgentStatuses(prev => ({ ...prev, [agent]: status }));
    }, []);

    const resetState = () => {
        setLogs([]);
        setCurrentAgent('System');
        setAgentStatuses({});
        setLearningTopic(null);
        setCurriculum(null);
        setContent(null);
        setAssessment(null);
        setFeedback(null);
        setActiveTab('Overview');
        setDisabledTabs(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
        setIsProcessing(false);
    }

    const handleStartLearning = async (topic: string) => {
        resetState();
        setIsProcessing(true);
        setLearningTopic(topic);
        addLog('User', 'Central Orchestrator', `Requested to learn about: "${topic}"`);

        try {
            // 1. Generate Curriculum
            updateAgentStatus('Central Orchestrator', 'Delegating to Curriculum Agent...');
            addLog('Central Orchestrator', 'Curriculum Agent', 'Task: Design a curriculum.');
            updateAgentStatus('Curriculum Agent', 'Generating curriculum...');
            const curriculumData = await generateCurriculum(topic);
            setCurriculum(curriculumData);
            setDisabledTabs(prev => prev.filter(t => t !== 'Curriculum'));
            setActiveTab('Curriculum');
            addLog('Curriculum Agent', 'Central Orchestrator', 'Curriculum generation complete.');
            updateAgentStatus('Curriculum Agent', 'Idle');

            // 2. Generate Content
            updateAgentStatus('Central Orchestrator', 'Delegating to Content Agent...');
            addLog('Central Orchestrator', 'Content Agent', 'Task: Generate learning content.');
            updateAgentStatus('Content Agent', 'Generating content for modules...');
            const contentData = await generateContent(curriculumData);
            setContent(contentData);
            setDisabledTabs(prev => prev.filter(t => t !== 'Content' && t !== 'Tutoring'));
            setActiveTab('Content');
            addLog('Content Agent', 'Central Orchestrator', 'Content generation complete.');
            updateAgentStatus('Content Agent', 'Idle');

            // 3. Generate Assessment
            updateAgentStatus('Central Orchestrator', 'Delegating to Assessment Agent...');
            addLog('Central Orchestrator', 'Assessment Agent', 'Task: Create an assessment.');
            updateAgentStatus('Assessment Agent', 'Generating assessment...');
            const assessmentData = await generateAssessment(curriculumData);
            setAssessment(assessmentData);
            setDisabledTabs(prev => prev.filter(t => t !== 'Assessment'));
            setActiveTab('Assessment');
            addLog('Assessment Agent', 'Central Orchestrator', 'Assessment generation complete.');
            updateAgentStatus('Assessment Agent', 'Idle');

            updateAgentStatus('Central Orchestrator', 'Orchestration complete. Ready for user interaction.');
            addLog('Central Orchestrator', 'User', 'Learning environment is ready.');
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            addLog('System', 'User', `Failed to generate learning materials: ${message}`);
            updateAgentStatus('System', 'Error state.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitAssessment = async (answers: UserAnswers) => {
        if (!assessment) return;

        setIsProcessing(true);
        addLog('User', 'Feedback Agent', 'Submitted assessment answers.');
        updateAgentStatus('Feedback Agent', 'Analyzing answers and generating feedback...');
        
        try {
            const feedbackData = await getFeedbackOnAssessment(assessment, answers);
            setFeedback(feedbackData);
            setDisabledTabs(prev => prev.filter(t => t !== 'Feedback' && t !== 'Progress'));
            setActiveTab('Feedback');
            addLog('Feedback Agent', 'User', 'Feedback is ready for review.');
            updateAgentStatus('Feedback Agent', 'Idle');
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            addLog('System', 'User', `Failed to get feedback: ${message}`);
            updateAgentStatus('System', 'Error state.');
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <main className="bg-gray-900 text-white h-screen flex flex-col font-sans">
            <header className="flex-shrink-0 border-b border-gray-700 px-6 py-3">
                <h1 className="text-xl font-bold tracking-wider">AI LEARNING ORCHESTRATOR</h1>
            </header>
            <div className="flex-grow flex overflow-hidden">
                {/* Left Panel */}
                <aside className="w-1/4 flex-shrink-0 bg-gray-800/20 p-6 flex flex-col space-y-6 overflow-y-auto custom-scrollbar">
                    <Orchestra currentAgent={currentAgent} agentStatuses={agentStatuses} />
                    <div className="border-t border-gray-700 pt-6">
                        <InfoPanel currentAgent={currentAgent} />
                    </div>
                </aside>
                {/* Center Panel */}
                <section className="w-1/2 flex-grow p-6 overflow-y-auto custom-scrollbar">
                    <MainDisplay
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        disabledTabs={disabledTabs}
                        onStartLearning={handleStartLearning}
                        curriculum={curriculum}
                        content={content}
                        assessment={assessment}
                        onSubmitAssessment={handleSubmitAssessment}
                        feedback={feedback}
                        isProcessing={isProcessing}
                    />
                </section>
                {/* Right Panel */}
                <aside className="w-1/4 flex-shrink-0 bg-gray-800/20 border-l border-gray-700 overflow-hidden">
                    <LogPanel logs={logs} />
                </aside>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4A5568;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #718096;
                }
            `}</style>
        </main>
    );
};

export default App;
