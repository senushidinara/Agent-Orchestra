import * as React from 'react';

export const InfoPanel: React.FC = () => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-4 flex-grow">
            <h2 className="text-lg font-semibold mb-4 text-center">Info Panel</h2>
            <div className="text-sm text-gray-400 space-y-2">
                <p>This panel will display contextual information, such as the current learning topic, progress summaries, or tips.</p>
                <p>As agents complete tasks, their outputs and generated content will be summarized and made accessible here.</p>
            </div>
        </div>
    );
};