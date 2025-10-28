
import * as React from 'react';
import type { Tab } from './TabNavigation';
import { TabNavigation } from './TabNavigation';
import { OverviewTab } from './tabs/OverviewTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { ContentTab } from './tabs/ContentTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { TutoringTab } from './tabs/TutoringTab';
import { ProgressTab } from './tabs/ProgressTab';
import type { Curriculum, Content, Assessment, Feedback, UserAnswers } from '../types';

interface MainDisplayProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    disabledTabs: Tab[];
    isGenerating: boolean;
    onStartLearning: (topic: string) => void;
    curriculum: Curriculum | null;
    content: Content | null;
    assessment: Assessment | null;
    onSubmitAssessment: (answers: UserAnswers) => void;
    feedback: Feedback | null;
}

const ALL_TABS: Tab[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];

export const MainDisplay: React.FC<MainDisplayProps> = ({
    activeTab,
    onTabChange,
    disabledTabs,
    isGenerating,
    onStartLearning,
    curriculum,
    content,
    assessment,
    onSubmitAssessment,
    feedback,
}) => {
    return (
        <div className="p-6 h-full flex flex-col relative">
            <TabNavigation
                tabs={ALL_TABS}
                activeTab={activeTab}
                onTabChange={onTabChange}
                disabledTabs={disabledTabs}
            />
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                 {activeTab === 'Overview' && <OverviewTab onSubmit={onStartLearning} />}
                 {activeTab === 'Curriculum' && <CurriculumTab curriculum={curriculum} />}
                 {activeTab === 'Content' && <ContentTab curriculum={curriculum} content={content} />}
                 {activeTab === 'Assessment' && <AssessmentTab assessment={assessment} onSubmit={onSubmitAssessment} />}
                 {activeTab === 'Feedback' && <FeedbackTab feedback={feedback} assessment={assessment} />}
                 {activeTab === 'Tutoring' && <TutoringTab curriculum={curriculum} content={content} />}
                 {activeTab === 'Progress' && <ProgressTab />}
            </div>
            {isGenerating && (
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">The agents are working...</p>
                </div>
            )}
        </div>
    );
};
