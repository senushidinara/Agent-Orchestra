import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import { ActionButton } from '../shared/ActionButton';

interface OverviewTabProps {
    onSubmit: (prompt: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSubmit }) => {
    const [prompt, setPrompt] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt.trim());
            setPrompt('');
        }
    };

    return (
        <TabContentWrapper
            title="Welcome to the AI Learning Orchestrator"
            description="Start your personalized learning journey by telling us what you want to learn. The agent orchestra will work together to create a custom curriculum, content, and assessments for you."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Introduction to Quantum Computing' or 'Learn to bake sourdough bread'"
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                    rows={4}
                />
                <div className="flex justify-end">
                    <ActionButton type="submit" disabled={!prompt.trim()}>
                        Start Learning
                    </ActionButton>
                </div>
            </form>
        </TabContentWrapper>
    );
};