import * as React from 'react';
import { TabNavigation, Tab } from './TabNavigation';
import { OverviewTab } from './tabs/OverviewTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { ContentTab } from './tabs/ContentTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { TutoringTab } from './tabs/TutoringTab';
import { ProgressTab } from './tabs/ProgressTab';
import type { Curriculum, Assessment, Content } from '../types';

interface MainDisplayProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    disabledTabs: Tab[];
    onSubmitPrompt: (prompt: string) => void;
    curriculum: Curriculum | null;
    content: Content | null;
    assessment: Assessment | null;
}

const TABS: Tab[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];

export const MainDisplay: React.FC<MainDisplayProps> = ({
    activeTab,
    onTabChange,
    disabledTabs,
    onSubmitPrompt,
    curriculum,
    content,
    assessment
}) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab onSubmit={onSubmitPrompt} />;
            case 'Curriculum':
                return <CurriculumTab curriculum={curriculum} />;
            case 'Content':
                return <ContentTab curriculum={curriculum} content={content} />;
            case 'Assessment':
                return <AssessmentTab assessment={assessment} />;
            case 'Feedback':
                return <FeedbackTab />;
            case 'Tutoring':
                return <TutoringTab curriculum={curriculum} content={content} />;
            case 'Progress':
                return <ProgressTab />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col h-full">
            <TabNavigation
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={onTabChange}
                disabledTabs={disabledTabs}
            />
            <div className="flex-grow overflow-y-auto">
                {renderTabContent()}
            </div>
        </div>
    );
};
