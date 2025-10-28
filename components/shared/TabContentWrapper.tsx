import * as React from 'react';

interface TabContentWrapperProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ title, description, children }) => {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400 mb-6">{description}</p>
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );
};