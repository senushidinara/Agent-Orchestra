
import * as React from 'react';
import { TabNavigation, Tab } from './TabNavigation';
import type { LearningPackage } from '../types';
import { OverviewTab } from './tabs/OverviewTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { ContentTab } from './tabs/ContentTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { TutoringTab } from './tabs/TutoringTab';
import { ProgressTab } from './tabs/ProgressTab';

interface MainDisplayProps {
    isLoading: boolean;
    onSubmit: (prompt: string) => void;
    learningPackage: LearningPackage | null;
}

const TABS: Tab[] = ['Overview', 'Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress'];

export const MainDisplay: React.FC<MainDisplayProps> = ({ isLoading, onSubmit, learningPackage }) => {
    const [activeTab, setActiveTab] = React.useState<Tab>('Overview');

    const curriculum = learningPackage?.curriculum || null;
    const content = learningPackage?.content || null;
    const assessment = learningPackage?.assessment || null;

    const disabledTabs = React.useMemo<Tab[]>(() => {
        const disabled: Tab[] = [];
        if (!learningPackage) {
            disabled.push('Curriculum', 'Content', 'Assessment', 'Feedback', 'Tutoring', 'Progress');
        }
        return disabled;
    }, [learningPackage]);

    const handleTabChange = (tab: Tab) => {
        if (!disabledTabs.includes(tab)) {
            setActiveTab(tab);
        }
    };
    
    React.useEffect(() => {
        if (isLoading) {
            setActiveTab('Overview');
        }
    }, [isLoading]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab onSubmit={onSubmit} />;
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
        <div className="p-6 h-full flex flex-col relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                    <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">The AI agents are working...</p>
                    <p className="text-sm text-gray-400">Generating your personalized learning package.</p>
                </div>
            )}
            <TabNavigation
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                disabledTabs={disabledTabs}
            />
            <div className="flex-grow overflow-y-auto">
                {renderTabContent()}
            </div>
        </div>
    );
};
