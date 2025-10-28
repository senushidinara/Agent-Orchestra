import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Feedback, Assessment } from '../../types';

interface FeedbackTabProps {
    feedback: Feedback | null;
    assessment: Assessment | null;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ feedback, assessment }) => {
    return (
        <TabContentWrapper
            title="Personalized Feedback"
            description="The Feedback Agent has analyzed your assessment. Here's a breakdown of your performance and explanations to help you improve."
        >
            {feedback && assessment ? (
                <div className="space-y-6">
                    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500/50 text-center">
                        <h3 className="text-lg font-semibold text-gray-300">Overall Score</h3>
                        <p className="text-4xl font-bold text-cyan-400">{feedback.overallScore}%</p>
                    </div>

                    {assessment.questions.map((q, index) => {
                        const fb = feedback.feedbackPerQuestion[index];
                        if (!fb) return null;
                        const isCorrect = fb.isCorrect;
                        return (
                            <div key={index} className={`p-4 bg-gray-800/80 rounded-lg border ${isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                                <p className="font-semibold mb-2">{`${index + 1}. ${q.question}`}</p>
                                <div className="space-y-2 text-sm">
                                    <p className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? 'Correct!' : 'Incorrect.'}
                                    </p>
                                    <p><span className="font-semibold text-gray-400">Correct Answer: </span>{fb.correctAnswer}</p>
                                    <p><span className="font-semibold text-gray-400">Explanation: </span>{fb.explanation}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    Submit the assessment to receive feedback here.
                </div>
            )}
        </TabContentWrapper>
    );
};
