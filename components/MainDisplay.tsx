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
    onStartLearning: (topic: string) => void;
    curriculum: Curriculum | null;
    content: Content | null;
    assessment: Assessment | null;
    onSubmitAssessment: (answers: UserAnswers) => void;
    feedback: Feedback | null;
    isProcessing: boolean;
}

const ALL_TABS: Tab[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];

export const MainDisplay: React.FC<MainDisplayProps> = ({
    activeTab,
    onTabChange,
    disabledTabs,
    onStartLearning,
    curriculum,
    content,
    assessment,
    onSubmitAssessment,
    feedback,
    isProcessing,
}) => {
    return (
        <div className="h-full flex flex-col">
            <TabNavigation
                tabs={ALL_TABS}
                activeTab={activeTab}
                onTabChange={onTabChange}
                disabledTabs={disabledTabs}
            />
            <div className="flex-grow">
                {activeTab === 'Overview' && <OverviewTab onSubmit={onStartLearning} />}
                {activeTab === 'Curriculum' && <CurriculumTab curriculum={curriculum} />}
                {activeTab === 'Content' && <ContentTab curriculum={curriculum} content={content} />}
                {activeTab === 'Assessment' && <AssessmentTab assessment={assessment} onSubmit={onSubmitAssessment} isSubmitting={isProcessing} />}
                {activeTab === 'Feedback' && <FeedbackTab feedback={feedback} assessment={assessment} />}
                {activeTab === 'Tutoring' && <TutoringTab curriculum={curriculum} content={content} />}
                {activeTab === 'Progress' && <ProgressTab />}
            </div>
        </div>
    );
};
