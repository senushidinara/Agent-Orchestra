import * as React from 'react';

export type Tab = 'Overview' | 'Curriculum' | 'Content' | 'Assessment' | 'Feedback' | 'Tutoring' | 'Progress';

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    disabledTabs: Tab[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange, disabledTabs }) => {
    return (
        <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = tab === activeTab;
                    const isDisabled = disabledTabs.includes(tab);
                    const activeClasses = 'border-cyan-500 text-cyan-400';
                    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500';
                    const disabledClasses = 'text-gray-600 cursor-not-allowed';

                    return (
                        <button
                            key={tab}
                            onClick={() => !isDisabled && onTabChange(tab)}
                            disabled={isDisabled}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none 
                                ${isDisabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}
                            `}
                        >
                            {tab}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
