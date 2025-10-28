import * as React from 'react';
import { MainDisplay } from './components/MainDisplay';
import type { Tab } from './components/TabNavigation';
import type { AgentName, LogEntry, Curriculum, Content, Assessment, UserAnswers, Feedback } from './types';
import { generateCurriculum, generateContent, generateAssessment, getFeedbackOnAssessment } from './services/geminiService';

const App: React.FC = () => {
    // App State
    const [logs, setLogs] = React.useState<LogEntry[]>([]);
    const [currentAgent, setCurrentAgent] = React.useState<AgentName>('Central Orchestrator');
    const [agentStatuses, setAgentStatuses] = React.useState<{ [key in AgentName]?: string }>({});
    
    const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
    const [disabledTabs, setDisabledTabs] = React.useState<Tab[]>(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);

    const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
    const [content, setContent] = React.useState<Content | null>(null);
    const [assessment, setAssessment] = React.useState<Assessment | null>(null);
    const [userAnswers, setUserAnswers] = React.useState<UserAnswers | null>(null);
    const [feedback, setFeedback] = React.useState<Feedback | null>(null);

    const [isProcessing, setIsProcessing] = React.useState(false);

    // Logging utility
    const addLog = (source: AgentName, target: AgentName, message: string) => {
        setLogs(prev => [...prev, { id: crypto.randomUUID(), timestamp: Date.now(), source, target, message }]);
    };
    
    // Agent status utility
    const updateAgentStatus = (agent: AgentName, status: string, isActive: boolean = true) => {
        if (isActive) setCurrentAgent(agent);
        setAgentStatuses(prev => ({ ...prev, [agent]: status }));
    };

    // Main orchestration logic
    const handleStartLearning = async (prompt: string) => {
        if (isProcessing) return;
        setIsProcessing(true);

        // Reset state for new journey
        setCurriculum(null);
        setContent(null);
        setAssessment(null);
        setUserAnswers(null);
        setFeedback(null);
        setLogs([]);
        setAgentStatuses({});
        setDisabledTabs(['Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress']);
        setActiveTab('Overview');

        try {
            // 1. Central Orchestrator starts
            addLog('User', 'Central Orchestrator', `User requested to learn about: "${prompt}"`);
            updateAgentStatus('Central Orchestrator', 'Initiating learning plan...');

            // 2. Curriculum Agent
            updateAgentStatus('Curriculum Agent', 'Generating curriculum...');
            addLog('Central Orchestrator', 'Curriculum Agent', 'Task: Design curriculum.');
            const newCurriculum = await generateCurriculum(prompt);
            setCurriculum(newCurriculum);
            addLog('Curriculum Agent', 'Central Orchestrator', 'Curriculum generated successfully.');
            setDisabledTabs(prev => prev.filter(t => t !== 'Curriculum'));

            // 3. Content Agent
            updateAgentStatus('Content Agent', 'Generating content for modules...');
            addLog('Central Orchestrator', 'Content Agent', 'Task: Generate content based on curriculum.');
            const newContent = await generateContent(newCurriculum);
            setContent(newContent);
            addLog('Content Agent', 'Central Orchestrator', 'Content generated successfully.');
            setDisabledTabs(prev => prev.filter(t => t !== 'Content' && t !== 'Tutoring'));

            // 4. Assessment Agent
            updateAgentStatus('Assessment Agent', 'Creating assessment...');
            addLog('Central Orchestrator', 'Assessment Agent', 'Task: Create assessment quiz.');
            const newAssessment = await generateAssessment(newCurriculum);
            setAssessment(newAssessment);
            addLog('Assessment Agent', 'Central Orchestrator', 'Assessment created successfully.');
            setDisabledTabs(prev => prev.filter(t => t !== 'Assessment'));

            // 5. Orchestration complete
            updateAgentStatus('Central Orchestrator', 'Learning package ready!');
            addLog('Central Orchestrator', 'User', 'The learning package is ready. You can now explore the tabs.');
            setActiveTab('Curriculum');

        } catch (error) {
            console.error("Orchestration failed:", error);
            addLog('System', 'User', `An error occurred during orchestration: ${error instanceof Error ? error.message : 'Unknown error'}`);
            updateAgentStatus('Central Orchestrator', 'Failed to generate learning plan.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Feedback logic
    const handleAssessmentSubmit = async (answers: UserAnswers) => {
        if (!assessment) return;
        setUserAnswers(answers);
        
        updateAgentStatus('Feedback Agent', 'Analyzing answers and generating feedback...');
        addLog('User', 'Feedback Agent', 'User submitted assessment.');
        
        try {
            const newFeedback = await getFeedbackOnAssessment(assessment, answers);
            setFeedback(newFeedback);
            addLog('Feedback Agent', 'User', 'Feedback is ready.');
            updateAgentStatus('Feedback Agent', 'Feedback generated.');
            setDisabledTabs(prev => prev.filter(t => t !== 'Feedback'));
            setActiveTab('Feedback');
        } catch (error) {
            console.error("Feedback generation failed:", error);
            addLog('System', 'User', `An error occurred during feedback generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
            updateAgentStatus('Feedback Agent', 'Failed to generate feedback.');
        }
    };


    return (
        <MainDisplay
            logs={logs}
            currentAgent={currentAgent}
            agentStatuses={agentStatuses}
            activeTab={activeTab}
            disabledTabs={disabledTabs}
            curriculum={curriculum}
            content={content}
            assessment={assessment}
            userAnswers={userAnswers}
            feedback={feedback}
            onTabChange={setActiveTab}
            onStartLearning={handleStartLearning}
            onAssessmentSubmit={handleAssessmentSubmit}
        />
    );
};

export default App;
