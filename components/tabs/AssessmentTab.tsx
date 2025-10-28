import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Assessment } from '../../types';
import { ActionButton } from '../shared/ActionButton';

interface AssessmentTabProps {
    assessment: Assessment | null;
}

export const AssessmentTab: React.FC<AssessmentTabProps> = ({ assessment }) => {
    return (
        <TabContentWrapper
            title="Knowledge Check"
            description="The Assessment Agent has created a quiz to test your understanding of the material. Your results will be used by the Feedback Agent."
        >
            {assessment ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-cyan-400">{assessment.title}</h3>
                    <form className="space-y-8">
                        {assessment.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <p className="font-semibold mb-4">{`${qIndex + 1}. ${q.question}`}</p>
                                <div className="space-y-2">
                                    {q.options.map((option, oIndex) => (
                                        <label key={oIndex} className="flex items-center p-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
                                            <input type="radio" name={`question-${qIndex}`} value={oIndex} className="mr-3 h-4 w-4 bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                         <div className="flex justify-end">
                            <ActionButton type="submit">Submit Answers</ActionButton>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    An assessment will be generated here after you review the content.
                </div>
            )}
        </TabContentWrapper>
    );
};