import * as React from 'react';

interface TabNavigationProps<T extends string> {
    tabs: T[];
    activeTab: T;
    onTabClick: (tab: T) => void;
}

export const TabNavigation = <T extends string>({ tabs, activeTab, onTabClick }: TabNavigationProps<T>) => {
    return (
        <div className="flex border-b border-gray-700">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab
                            ? 'border-b-2 border-cyan-400 text-white'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                >
                    {tab.replace(' Agent', '')}
                </button>
            ))}
        </div>
    );
};