import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';

export const TutoringTab: React.FC = () => {
    return (
        <TabContentWrapper
            title="AI Tutor"
            description="The Tutoring Agent is here to help. Ask any questions you have about the learning material."
        >
            <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                Tutoring chat interface will be available here.
            </div>
        </TabContentWrapper>
    );
};