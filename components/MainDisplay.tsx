import * as React from 'react';
import { TabNavigation } from './TabNavigation';
import { OverviewTab } from './tabs/OverviewTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { ContentTab } from './tabs/ContentTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { TutoringTab } from './tabs/TutoringTab';
import { ProgressTab } from './tabs/ProgressTab';
import type { Curriculum, Assessment } from '../types';

type TabName = 'Overview' | 'Curriculum' | 'Content' | 'Assessment' | 'Feedback' | 'Tutoring' | 'Progress';

interface MainDisplayProps {
    onStartLearning: (prompt: string) => void;
    curriculum: Curriculum | null;
    content: string | null;
    assessment: Assessment | null;
}

export const MainDisplay: React.FC<MainDisplayProps> = ({ onStartLearning, curriculum, content, assessment }) => {
    const tabs: TabName[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];
    const [activeTab, setActiveTab] = React.useState<TabName>('Overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab onSubmit={onStartLearning} />;
            case 'Curriculum':
                return <CurriculumTab curriculum={curriculum} />;
            case 'Content':
                return <ContentTab content={content} />;
            case 'Assessment':
                return <AssessmentTab assessment={assessment} />;
            case 'Feedback':
                return <FeedbackTab />;
            case 'Tutoring':
                return <TutoringTab />;
            case 'Progress':
                return <ProgressTab />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col h-full">
            {/* Fix: Explicitly provide the generic type to TabNavigation to resolve type inference issues. */}
            <TabNavigation<TabName> tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="pt-6 flex-grow">
                {renderTabContent()}
            </div>
        </div>
    );
};
