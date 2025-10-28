import * as React from 'react';
import { TabNavigation } from './TabNavigation';
import type { Tab } from './TabNavigation';
import { OverviewTab } from './tabs/OverviewTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { ContentTab } from './tabs/ContentTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { TutoringTab } from './tabs/TutoringTab';
import { ProgressTab } from './tabs/ProgressTab';
import type { Curriculum, Content, Assessment, Feedback, UserAnswers, AgentName, LogEntry } from '../types';
import { Orchestra } from './Orchestra';
import { LogPanel } from './LogPanel';
import { InfoPanel } from './InfoPanel';


interface MainDisplayProps {
    // State from App
    logs: LogEntry[];
    currentAgent: AgentName;
    agentStatuses: { [key in AgentName]?: string };
    activeTab: Tab;
    disabledTabs: Tab[];
    curriculum: Curriculum | null;
    content: Content | null;
    assessment: Assessment | null;
    userAnswers: UserAnswers | null;
    feedback: Feedback | null;
    // Callbacks to App
    onTabChange: (tab: Tab) => void;
    onStartLearning: (prompt: string) => void;
    onAssessmentSubmit: (answers: UserAnswers) => void;
}

const TABS: Tab[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];

export const MainDisplay: React.FC<MainDisplayProps> = (props) => {
    const renderTabContent = () => {
        switch (props.activeTab) {
            case 'Overview':
                return <OverviewTab onSubmit={props.onStartLearning} />;
            case 'Curriculum':
                return <CurriculumTab curriculum={props.curriculum} />;
            case 'Content':
                return <ContentTab curriculum={props.curriculum} content={props.content} />;
            case 'Assessment':
                return <AssessmentTab assessment={props.assessment} onSubmit={props.onAssessmentSubmit} isSubmitted={!!props.userAnswers} />;
            case 'Feedback':
                return <FeedbackTab assessment={props.assessment} feedback={props.feedback} />;
            case 'Tutoring':
                return <TutoringTab curriculum={props.curriculum} content={props.content} />;
            case 'Progress':
                return <ProgressTab />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full bg-gray-900 text-gray-200 flex p-4 gap-4">
            {/* Left Panel */}
            <div className="w-1/4 flex flex-col gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <Orchestra currentAgent={props.currentAgent} agentStatuses={props.agentStatuses} />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-grow">
                     <InfoPanel currentAgent={props.currentAgent} />
                </div>
            </div>

            {/* Middle Panel */}
            <main className="w-1/2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col">
                <TabNavigation
                    tabs={TABS}
                    activeTab={props.activeTab}
                    onTabChange={props.onTabChange}
                    disabledTabs={props.disabledTabs}
                />
                <div className="flex-grow">
                    {renderTabContent()}
                </div>
            </main>

            {/* Right Panel */}
            <div className="w-1/4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col">
                <LogPanel logs={props.logs} />
            </div>
        </div>
    );
};
