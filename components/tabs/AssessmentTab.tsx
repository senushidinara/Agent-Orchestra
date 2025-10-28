import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import { ActionButton } from '../shared/ActionButton';
import type { Assessment, UserAnswers } from '../../types';

interface AssessmentTabProps {
    assessment: Assessment | null;
    onSubmit: (answers: UserAnswers) => void;
    isSubmitted: boolean;
}

export const AssessmentTab: React.FC<AssessmentTabProps> = ({ assessment, onSubmit, isSubmitted }) => {
    const [answers, setAnswers] = React.useState<UserAnswers>({});

    const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        if (assessment && Object.keys(answers).length === assessment.questions.length) {
            onSubmit(answers);
        } else {
            alert('Please answer all questions before submitting.');
        }
    };

    return (
        <TabContentWrapper
            title="Knowledge Check"
            description="The Assessment Agent has prepared a quiz to test your understanding. Answer all questions and submit to see your feedback."
        >
            {assessment ? (
                <div className="space-y-6">
                    {assessment.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="font-semibold mb-3">{`${qIndex + 1}. ${q.question}`}</p>
                            <div className="space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <label key={oIndex} className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${answers[qIndex] === oIndex ? 'bg-cyan-600/50' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            checked={answers[qIndex] === oIndex}
                                            onChange={() => handleAnswerChange(qIndex, oIndex)}
                                            className="h-4 w-4 text-cyan-600 bg-gray-600 border-gray-500 focus:ring-cyan-500"
                                            disabled={isSubmitted}
                                        />
                                        <span className="ml-3 text-gray-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <ActionButton onClick={handleSubmit} disabled={isSubmitted}>
                            {isSubmitted ? 'Submitted' : 'Submit Answers'}
                        </ActionButton>
                    </div>
                     {isSubmitted && <p className="text-center text-cyan-400 mt-4">Assessment submitted! Check the 'Feedback' tab for your results.</p>}
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    An assessment will be generated here after the curriculum is created.
                </div>
            )}
        </TabContentWrapper>
    );
};
