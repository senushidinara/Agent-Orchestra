import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';

export const ProgressTab: React.FC = () => {
    return (
        <TabContentWrapper
            title="Your Progress"
            description="The Progress Tracking Agent visualizes your journey. See your completed modules, assessment scores, and overall mastery of the subject."
        >
            <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                Progress charts and statistics will appear here.
            </div>
        </TabContentWrapper>
    );
};