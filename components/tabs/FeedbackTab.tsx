import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';

export const FeedbackTab: React.FC = () => {
    return (
        <TabContentWrapper
            title="Feedback"
            description="The Feedback Agent will provide insights here based on your assessment performance."
        >
            <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                Submit an assessment to receive feedback.
            </div>
        </TabContentWrapper>
    );
};